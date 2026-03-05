package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// AdminMiddleware runs after AuthMiddleware and enforces that the caller has the "admin" role.
func AdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("userRole")
		if !exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "No token provided"})
			return
		}
		if role != "admin" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"message": "Access denied. Admin privileges required."})
			return
		}
		c.Next()
	}
}
