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

	// 4. Apply CORS middleware — allows requests from the React dev server
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Authorization", "Content-Type"},
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
