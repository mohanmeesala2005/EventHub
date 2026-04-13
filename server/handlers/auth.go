package handlers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/yourusername/eventhub/models"
	"github.com/yourusername/eventhub/services"
	"gorm.io/gorm"
)

type AuthHandler struct {
	AuthService *services.AuthService
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

	existing, err := h.AuthService.FindByEmail(input.Email)
	if err == nil {
		token, err := h.AuthService.GenerateToken(existing)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to generate token"})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"token":   token,
			"user":    toUserResponse(existing),
			"message": "User already exists, redirecting to home",
		})
		return
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to check existing user"})
		return
	}

	_, err = h.AuthService.FindByUsername(input.Username)
	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Username already exists"})
		return
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to check username"})
		return
	}

	hashed, err := h.AuthService.HashPassword(input.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to hash password"})
		return
	}

	user := models.User{
		Username: input.Username,
		Name:     input.Name,
		Email:    input.Email,
		Password: hashed,
	}
	if err := h.AuthService.CreateUser(&user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create user"})
		return
	}

	token, err := h.AuthService.GenerateToken(&user)
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

	user, err := h.AuthService.FindByEmail(input.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"message": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to load user"})
		return
	}

	if input.Username != "" && user.Username != input.Username {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Username does not match the email"})
		return
	}

	if err := h.AuthService.ComparePassword(user.Password, input.Password); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid credentials"})
		return
	}

	token, err := h.AuthService.GenerateToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Login failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user":  toUserResponse(user),
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
	userID := uint(rawID.(float64))

	user, err := h.AuthService.UpdateProfile(userID, input.Name, input.Username)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"message": "User Not Found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Something went wrong"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Profile Updated!",
		"user":    toUserResponse(user),
	})
}
