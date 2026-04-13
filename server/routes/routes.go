package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/yourusername/eventhub/config"
	"github.com/yourusername/eventhub/handlers"
	"github.com/yourusername/eventhub/middleware"
	"github.com/yourusername/eventhub/services"
	"gorm.io/gorm"
)

// Register wires all routes onto the given Gin engine.
func Register(r *gin.Engine, db *gorm.DB, cfg *config.Config) {
	// Instantiate service layers.
	authService := services.NewAuthService(db, cfg.JWTSecret)
	eventService := services.NewEventService(db)

	// Instantiate handlers.
	authH := &handlers.AuthHandler{AuthService: authService}
	eventH := &handlers.EventHandler{EventService: eventService}
	chatbotH := &handlers.ChatbotHandler{GeminiAPIKey: cfg.GeminiAPIKey}

	// Middleware factories.
	auth := middleware.AuthMiddleware(cfg.JWTSecret)
	admin := middleware.AdminMiddleware()

	// ── Health check ──────────────────────────────────────────────────────────
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// ── Welcome ───────────────────────────────────────────────────────────────
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Welcome to the homepage!",
			"status":  "success",
		})
	})

	// ── Static file serving ───────────────────────────────────────────────────
	// Serves uploaded images at /uploads/<filename>
	r.Static("/uploads", "./uploads")

	// ── Auth routes (/api/auth) ───────────────────────────────────────────────
	authGroup := r.Group("/api/auth")
	{
		authGroup.POST("/signup", authH.Register)
		authGroup.POST("/login", authH.Login)
		authGroup.POST("/update", auth, authH.UpdateProfile)
	}

	// ── Event routes (/api/events) ────────────────────────────────────────────
	eventGroup := r.Group("/api/events")
	{
		// Public
		eventGroup.POST("/getevent", eventH.GetAllEvents)
		eventGroup.GET("/registrations/:eventId", eventH.GetEventRegistrations)

		// Protected
		eventGroup.POST("/create", auth, admin, eventH.CreateEvent)
		eventGroup.DELETE("/:id", auth, eventH.DeleteEvent)
		eventGroup.PUT("/:id", auth, eventH.UpdateEvent)
		eventGroup.POST("/register", auth, eventH.RegisterForEvent)
		eventGroup.GET("/registrations", auth, eventH.GetUserRegistrations)

		// Admin only
		eventGroup.GET("/admin/events-with-stats", auth, admin, eventH.GetAllEventsWithStats)
		eventGroup.GET("/admin/all-registrations", auth, admin, eventH.GetAllRegistrations)
	}

	// ── Chatbot routes (/api/chatbot) ─────────────────────────────────────────
	chatbotGroup := r.Group("/api/chatbot")
	{
		chatbotGroup.POST("/ask", chatbotH.ChatbotAsk)
	}
}
