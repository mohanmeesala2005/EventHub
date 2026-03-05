package models

import (
	"time"

	"gorm.io/gorm"
)

// Event represents an event in the system.
type Event struct {
	gorm.Model
	Title          string    `json:"title"`
	Description    string    `json:"description"`
	Cost           float64   `json:"cost"`
	Date           time.Time `json:"date"`
	CreatedBy      string    `json:"createdBy"`
	CreatedByName  string    `json:"createdByName"`
	CreatedByEmail string    `json:"createdByEmail"`
	Image          string    `json:"image"` // relative path or URL
}
