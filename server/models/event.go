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
	CreatedByID    *uint     `json:"createdBy,omitempty"`
	Creator        User      `gorm:"foreignKey:CreatedByID" json:"createdByUser,omitempty"`
	CreatedByName  string    `gorm:"-" json:"createdByName,omitempty"`
	CreatedByEmail string    `gorm:"-" json:"createdByEmail,omitempty"`
	Image          string    `json:"image"` // relative path or URL
}
