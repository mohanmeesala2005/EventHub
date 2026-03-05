package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/yourusername/eventhub/config"
	"github.com/yourusername/eventhub/database"
	"github.com/yourusername/eventhub/routes"
)

func main() {
	// 1. Load environment variables from .env
	cfg := config.Load()

	// 2. Connect to PostgreSQL and auto-migrate models
	db := database.Connect(cfg)

	// 3. Initialize Gin router with Logger and Recovery middleware
	r := gin.Default()

	// 4. Apply CORS middleware — allows requests from localhost and Vercel
	allowedOrigins := []string{
		"http://localhost:3000",
		"http://localhost:5173",
		// Some dev setups use 127.0.0.1 instead of localhost — include it to avoid CORS issues.
		"http://127.0.0.1:5173",
	}
	// Add the Vercel frontend URL from env if set (e.g. https://your-app.vercel.app)
	if cfg.FrontendURL != "" {
		allowedOrigins = append(allowedOrigins, cfg.FrontendURL)
	}
	r.Use(cors.New(cors.Config{
		AllowOrigins: allowedOrigins,
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		// Allow common request headers including Origin and Accept for preflight requests
		AllowHeaders:     []string{"Origin", "Accept", "Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// 5. Register all application routes
	routes.Register(r, db, cfg)

	// 6. Start the server
	log.Printf("Server starting on port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
