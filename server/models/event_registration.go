package models

import "gorm.io/gorm"

// EventRegistration records a user's registration for an event.
type EventRegistration struct {
	gorm.Model
	EventID uint    `gorm:"not null"             json:"eventId"`
	UserID  uint    `gorm:"not null"             json:"userId"`
	Name    string  `json:"name"`
	Email   string  `json:"email"`
	Phone   string  `json:"phone"`
	Cost    float64 `json:"cost"`

	// Preloadable associations — omitted from JSON if empty.
	Event Event `gorm:"foreignKey:EventID" json:"event,omitempty"`
	User  User  `gorm:"foreignKey:UserID"  json:"user,omitempty"`
}
