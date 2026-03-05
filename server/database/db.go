package database

import (
	"log"

	"github.com/yourusername/eventhub/config"
	"github.com/yourusername/eventhub/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Connect opens a PostgreSQL connection via GORM and auto-migrates all models.
func Connect(cfg *config.Config) *gorm.DB {
	db, err := gorm.Open(postgres.Open(cfg.DatabaseURL), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("Database connected successfully")

	// Auto-migrate all models — creates/updates tables to match struct definitions.
	if err := db.AutoMigrate(
		&models.User{},
		&models.Event{},
		&models.EventRegistration{},
	); err != nil {
		log.Fatalf("Failed to auto-migrate database: %v", err)
	}

	log.Println("Database migration completed")
	return db
}
