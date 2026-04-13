package handlers

import (
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/yourusername/eventhub/models"
	"github.com/yourusername/eventhub/services"
)

type EventHandler struct {
	EventService *services.EventService
}

// ─── Helpers ────────────────────────────────────────────────────────────────

// saveUploadedImage saves a multipart file to ./uploads/ and returns its relative path.
func saveUploadedImage(file multipart.File, header *multipart.FileHeader) (string, error) {
	if file == nil || header == nil {
		return "", nil
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
	return filepath.ToSlash(dstPath), nil
}

// getUserID extracts the authenticated user's ID from the Gin context (set by AuthMiddleware).
func getUserID(c *gin.Context) uint {
	raw, _ := c.Get("userID")
	return uint(raw.(float64))
}

// ─── Event Handlers ──────────────────────────────────────────────────────────

// CreateEvent handles POST /api/events/create (protected, multipart/form-data)
func (h *EventHandler) CreateEvent(c *gin.Context) {
	file, header, err := c.Request.FormFile("image")
	if err != nil && err != http.ErrMissingFile {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to read image upload"})
		return
	}

	imagePath, err := saveUploadedImage(file, header)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to save image"})
		return
	}

	dateStr := c.PostForm("date")
	var date time.Time
	if dateStr != "" {
		date, err = time.Parse(time.RFC3339, dateStr)
		if err != nil {
			date, err = time.Parse("2006-01-02", dateStr)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid date format"})
				return
			}
		}
	}

	costStr := c.PostForm("cost")
	cost, _ := strconv.ParseFloat(costStr, 64)

	userID := getUserID(c)
	event := models.Event{
		Title:       c.PostForm("title"),
		Description: c.PostForm("description"),
		Date:        date,
		Cost:        cost,
		CreatedByID: &userID,
		Image:       imagePath,
	}

	if err := h.EventService.CreateEvent(&event); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, event)
}

// GetAllEvents handles POST /api/events/getevent (public)
func (h *EventHandler) GetAllEvents(c *gin.Context) {
	events, err := h.EventService.GetAllEvents()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch events", "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, events)
}

// DeleteEvent handles DELETE /api/events/:id (protected)
func (h *EventHandler) DeleteEvent(c *gin.Context) {
	id := c.Param("id")

	event, err := h.EventService.GetEventByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Event not found"})
		return
	}

	if event.Image != "" {
		go func(imgPath string) {
			if err := os.Remove(imgPath); err != nil {
				fmt.Printf("Failed to delete image %s: %v\n", imgPath, err)
			}
		}(event.Image)
	}

	if err := h.EventService.DeleteEvent(event); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Something went wrong"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Event deleted successfully"})
}

// UpdateEvent handles PUT /api/events/:id (protected, multipart/form-data)
func (h *EventHandler) UpdateEvent(c *gin.Context) {
	id := c.Param("id")

	event, err := h.EventService.GetEventByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Event not found"})
		return
	}

	file, header, err := c.Request.FormFile("image")
	if err != nil && err != http.ErrMissingFile {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to read image upload"})
		return
	}

	newImagePath, err := saveUploadedImage(file, header)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to save image"})
		return
	}

	if newImagePath != "" {
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

	if err := h.EventService.UpdateEvent(event); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Something went wrong"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Event updated successfully", "event": event})
}

// ─── Registration Handlers ───────────────────────────────────────────────────

// RegisterForEvent handles POST /api/events/register (protected)
func (h *EventHandler) RegisterForEvent(c *gin.Context) {
	var input struct {
		EventID   uint   `json:"eventId" binding:"required"`
		Name      string `json:"name"`
		Email     string `json:"email"`
		Phone     string `json:"phone"`
		PaymentID string `json:"paymentId"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	userID := getUserID(c)
	registration := models.EventRegistration{
		EventID:   input.EventID,
		UserID:    userID,
		Name:      input.Name,
		Email:     input.Email,
		Phone:     input.Phone,
		PaymentID: input.PaymentID,
	}

	if err := h.EventService.RegisterForEvent(&registration); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Registration Failed", "error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Registered Successfully"})
}

// GetEventRegistrations handles GET /api/events/registrations/:eventId (public)
func (h *EventHandler) GetEventRegistrations(c *gin.Context) {
	eventID := c.Param("eventId")

	registrations, err := h.EventService.GetEventRegistrations(eventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch registrations"})
		return
	}
	c.JSON(http.StatusOK, registrations)
}

// GetUserRegistrations handles GET /api/events/registrations (protected)
func (h *EventHandler) GetUserRegistrations(c *gin.Context) {
	userID := getUserID(c)

	registrations, err := h.EventService.GetUserRegistrations(userID)
	if err != nil {
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
	result, err := h.EventService.GetAllEventsWithStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch events with stats", "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

// GetAllRegistrations handles GET /api/events/admin/all-registrations (admin)
func (h *EventHandler) GetAllRegistrations(c *gin.Context) {
	registrations, err := h.EventService.GetAllRegistrations()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch all registrations", "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, registrations)
}
