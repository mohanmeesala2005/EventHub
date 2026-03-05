package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/yourusername/eventhub/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthHandler struct {
	DB        *gorm.DB
	JWTSecret string
}

// registerInput defines the expected JSON body for registration.
type registerInput struct {
	Username string `json:"username" binding:"required"`
	Name     string `json:"name"     binding:"required"`
	Email    string `json:"email"    binding:"required"`
	Password string `json:"password" binding:"required"`
}

// loginInput defines the expected JSON body for login.
type loginInput struct {
	Username string `json:"username"`
	Email    string `json:"email"    binding:"required"`
	Password string `json:"password" binding:"required"`
}

// userResponse is the safe user object returned in every auth response.
type userResponse struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Role     string `json:"role"`
}

func (h *AuthHandler) signToken(user *models.User) (string, error) {
	claims := jwt.MapClaims{
		"id":   user.ID,
		"role": user.Role,
		"exp":  time.Now().Add(24 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(h.JWTSecret))
}

func toUserResponse(u *models.User) userResponse {
	return userResponse{
		ID:       u.ID,
		Username: u.Username,
		Name:     u.Name,
		Email:    u.Email,
		Role:     u.Role,
	}
}

// Register handles POST /api/auth/signup
func (h *AuthHandler) Register(c *gin.Context) {
	var input registerInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	// If email already exists, return a token to let the frontend redirect (mirrors old Node.js behaviour).
	var existing models.User
	if err := h.DB.Where("email = ?", input.Email).First(&existing).Error; err == nil {
		token, err := h.signToken(&existing)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to generate token"})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"token":   token,
			"user":    toUserResponse(&existing),
			"message": "User already exists, redirecting to home",
		})
		return
	}

	// Check username uniqueness.
	var existingByUsername models.User
	if err := h.DB.Where("username = ?", input.Username).First(&existingByUsername).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Username already exists"})
		return
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(input.Password), 10)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to hash password"})
		return
	}

	user := models.User{
		Username: input.Username,
		Name:     input.Name,
		Email:    input.Email,
		Password: string(hashed),
	}
	if err := h.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create user"})
		return
	}

	token, err := h.signToken(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"token":   token,
		"user":    toUserResponse(&user),
		"message": "User registered successfully",
	})
}

// Login handles POST /api/auth/login
func (h *AuthHandler) Login(c *gin.Context) {
	var input loginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	var user models.User
	if err := h.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "User not found"})
		return
	}

	// Optional username check — mirrors Node.js behaviour.
	if input.Username != "" && user.Username != input.Username {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Username does not match the email"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid credentials"})
		return
	}

	token, err := h.signToken(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Login failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user":  toUserResponse(&user),
	})
}

// UpdateProfile handles POST /api/auth/update (protected)
func (h *AuthHandler) UpdateProfile(c *gin.Context) {
	var input struct {
		Name     string `json:"name"`
		Username string `json:"username"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	rawID, _ := c.Get("userID")
	// JWT MapClaims stores numbers as float64.
	userID := uint(rawID.(float64))

	var user models.User
	if err := h.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "User Not Found"})
		return
	}

	if input.Name != "" {
		user.Name = input.Name
	}
	if input.Username != "" {
		user.Username = input.Username
	}

	if err := h.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Something went wrong"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Profile Updated!",
		"user":    toUserResponse(&user),
	})
}
