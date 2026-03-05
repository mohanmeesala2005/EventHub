package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// Config holds all application configuration loaded from environment variables.
type Config struct {
	Port         string
	DatabaseURL  string
	JWTSecret    string
	GeminiAPIKey string
}

// Load reads the .env file and returns a populated Config struct.
func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, reading from environment directly")
	}

	cfg := &Config{
		Port:         getEnv("PORT", "5000"),
		DatabaseURL:  getEnv("DATABASE_URL", ""),
		JWTSecret:    getEnv("JWT_SECRET", ""),
		GeminiAPIKey: getEnv("GEMINI_API_KEY", ""),
	}

	if cfg.DatabaseURL == "" {
		log.Fatal("DATABASE_URL is required but not set in .env")
	}
	if cfg.JWTSecret == "" {
		log.Fatal("JWT_SECRET is required but not set in .env")
	}

	return cfg
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
