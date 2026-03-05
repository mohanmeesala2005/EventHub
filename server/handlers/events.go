package handlers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/yourusername/eventhub/models"
	"gorm.io/gorm"
)

type EventHandler struct {
	DB *gorm.DB
}

// ─── Helpers ────────────────────────────────────────────────────────────────

// saveUploadedImage saves a multipart file to ./uploads/ and returns its relative path.
func saveUploadedImage(c *gin.Context) (string, error) {
	file, header, err := c.Request.FormFile("image")
	if err != nil {
		return "", nil // no image uploaded — not an error
	}
	defer file.Close()

	if err := os.MkdirAll("uploads", os.ModePerm); err != nil {
		return "", err
	}
	filename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), header.Filename)
	dstPath := filepath.Join("uploads", filename)

	dst, err := os.Create(dstPath)
	if err != nil {
		return "", err
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		return "", err
	}
	return dstPath, nil
}

// getUserID extracts the authenticated user's ID from the Gin context (set by AuthMiddleware).
func getUserID(c *gin.Context) uint {
	raw, _ := c.Get("userID")
	return uint(raw.(float64))
}

// ─── Event Handlers ──────────────────────────────────────────────────────────

// CreateEvent handles POST /api/events/create (protected, multipart/form-data)
func (h *EventHandler) CreateEvent(c *gin.Context) {
	imagePath, err := saveUploadedImage(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to save image"})
		return
	}

	dateStr := c.PostForm("date")
	var date time.Time
	if dateStr != "" {
		date, err = time.Parse(time.RFC3339, dateStr)
		if err != nil {
			// Try common date format as fallback.
			date, err = time.Parse("2006-01-02", dateStr)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid date format"})
				return
			}
		}
	}

	costStr := c.PostForm("cost")
	cost, _ := strconv.ParseFloat(costStr, 64)

	event := models.Event{
		Title:          c.PostForm("title"),
		Description:    c.PostForm("description"),
		Date:           date,
		Cost:           cost,
		CreatedBy:      c.PostForm("createdBy"),
		CreatedByName:  c.PostForm("createdByName"),
		CreatedByEmail: c.PostForm("createdByEmail"),
		Image:          imagePath,
	}

	if err := h.DB.Create(&event).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, event)
}

// GetAllEvents handles POST /api/events/getevent (public)
func (h *EventHandler) GetAllEvents(c *gin.Context) {
	var events []models.Event
	if err := h.DB.Order("date asc").Find(&events).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch events", "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, events)
}

// DeleteEvent handles DELETE /api/events/:id (protected)
func (h *EventHandler) DeleteEvent(c *gin.Context) {
	id := c.Param("id")

	var event models.Event
	if err := h.DB.First(&event, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Event not found"})
		return
	}

	// Delete associated image file in a goroutine (non-blocking).
	if event.Image != "" {
		go func(imgPath string) {
			if err := os.Remove(imgPath); err != nil {
				fmt.Printf("Failed to delete image %s: %v\n", imgPath, err)
			}
		}(event.Image)
	}

	if err := h.DB.Delete(&event).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Something went wrong"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Event deleted successfully"})
}

// UpdateEvent handles PUT /api/events/:id (protected, mult	ipart/form-data)
func (h *EventHandler) UpdateEvent(c *gin.Context) {
	id := c.Param("id")

	var event models.Event
	if err := h.DB.First(&event, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Event not found"})
		return
	}

	// Replace image if a new one was uploaded.
	newImagePath, err := saveUploadedImage(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to save image"})
		return
	}
	if newImagePath != "" {
		// Delete old image non-blocking.
		if event.Image != "" {
			go func(old string) { os.Remove(old) }(event.Image)
		}
		event.Image = newImagePath
	}

	dateStr := c.PostForm("date")
	if dateStr != "" {
		parsed, err := time.Parse(time.RFC3339, dateStr)
		if err != nil {
			parsed, err = time.Parse("2006-01-02", dateStr)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid date format"})
				return
			}
		}
		event.Date = parsed
	}

	event.Title = c.PostForm("title")
	event.Description = c.PostForm("description")

	costStr := c.PostForm("cost")
	if costStr != "" {
		cost, _ := strconv.ParseFloat(costStr, 64)
		event.Cost = cost
	}

	if err := h.DB.Save(&event).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Something went wrong"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Event updated successfully", "event": event})
}

// ─── Registration Handlers ───────────────────────────────────────────────────

// RegisterForEvent handles POST /api/events/register (protected)
func (h *EventHandler) RegisterForEvent(c *gin.Context) {
	var input struct {
		EventID uint   `json:"eventId" binding:"required"`
		Name    string `json:"name"`
		Email   string `json:"email"`
		Phone   string `json:"phone"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	userID := getUserID(c)
	registration := models.EventRegistration{
		EventID: input.EventID,
		UserID:  userID,
		Name:    input.Name,
		Email:   input.Email,
		Phone:   input.Phone,
	}

	if err := h.DB.Create(&registration).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Registration Failed", "error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Registered Successfully"})
}

// GetEventRegistrations handles GET /api/events/registrations/:eventId (public)
func (h *EventHandler) GetEventRegistrations(c *gin.Context) {
	eventID := c.Param("eventId")

	var registrations []models.EventRegistration
	if err := h.DB.Where("event_id = ?", eventID).Find(&registrations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch registrations"})
		return
	}
	c.JSON(http.StatusOK, registrations)
}

// GetUserRegistrations handles GET /api/events/registrations (protected)
func (h *EventHandler) GetUserRegistrations(c *gin.Context) {
	userID := getUserID(c)

	var registrations []models.EventRegistration
	if err := h.DB.Preload("Event").
		Where("user_id = ?", userID).
		Order("created_at desc").
		Find(&registrations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch user registrations", "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, registrations)
}

// ─── Admin Handlers ──────────────────────────────────────────────────────────

// eventWithStats extends Event with a registration count.
type eventWithStats struct {
	models.Event
	RegistrationCount int64 `json:"registrationCount"`
}

// GetAllEventsWithStats handles GET /api/events/admin/events-with-stats (admin)
func (h *EventHandler) GetAllEventsWithStats(c *gin.Context) {
	var events []models.Event
	if err := h.DB.Order("date asc").Find(&events).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch events with stats", "error": err.Error()})
		return
	}

	result := make([]eventWithStats, 0, len(events))
	for _, ev := range events {
		var count int64
		h.DB.Model(&models.EventRegistration{}).Where("event_id = ?", ev.ID).Count(&count)
		result = append(result, eventWithStats{Event: ev, RegistrationCount: count})
	}
	c.JSON(http.StatusOK, result)
}

// GetAllRegistrations handles GET /api/events/admin/all-registrations (admin)
func (h *EventHandler) GetAllRegistrations(c *gin.Context) {
	var registrations []models.EventRegistration
	if err := h.DB.Preload("Event").Preload("User").
		Order("created_at desc").
		Find(&registrations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch all registrations", "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, registrations)
}
