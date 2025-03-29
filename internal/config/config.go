package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// Config holds all application configuration
type Config struct {
	DB     DatabaseConfig
	Server ServerConfig
}

// DatabaseConfig holds database connection settings
type DatabaseConfig struct {
	User     string
	Password string
	Name     string
	Host     string
	Port     string
}

// ServerConfig holds server settings
type ServerConfig struct {
	Port string
}

// NewConfig creates a new configuration with values from .env file
func NewConfig() (*Config, error) {
	// TODO: REMOVE HARDCODED PATH
	if err := godotenv.Load("../../.env"); err != nil {
		return nil, fmt.Errorf("failed to load .env file: %w", err)
	}

	config := &Config{
		DB: DatabaseConfig{
			User:     getEnv("DB_USER"),
			Password: getEnv("DB_PASSWORD"),
			Name:     getEnv("DB_NAME"),
			Host:     getEnv("DB_HOST"),
			Port:     getEnv("DB_PORT"),
		},
		Server: ServerConfig{
			Port: getEnv("SERVER_PORT"),
		},
	}

	return config, nil
}

// getEnv returns environment variable value or panics if not set
func getEnv(key string) string {
	value := os.Getenv(key)
	if value == "" {
		panic(fmt.Sprintf("required environment variable %s is not set", key))
	}
	return value
}
