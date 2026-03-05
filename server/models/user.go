package models

import "gorm.io/gorm"

// User represents an application user stored in PostgreSQL.
type User struct {
	gorm.Model
	Name     string `gorm:"not null"          json:"name"`
	Username string `gorm:"not null;uniqueIndex" json:"username"`
	Email    string `gorm:"not null;uniqueIndex" json:"email"`
	Password string `gorm:"not null"          json:"-"` // never sent in JSON responses
	Role     string `gorm:"default:user"      json:"role"`
}
