package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// Config holds all application configuration
type Config struct {
	DB     DatabaseConfig
	Minio  MinioConfig
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

type MinioConfig struct {
	Endpoint  string
	AccessKey string
	SecretKey string
	UseSSL    bool
}

// ServerConfig holds server settings
type ServerConfig struct {
	Port     string
	CertFile string
	KeyFile  string
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
		Minio: MinioConfig{
			Endpoint:  getEnv("MINIO_ENDPOINT"),
			AccessKey: getEnv("MINIO_ACCESS_KEY"),
			SecretKey: getEnv("MINIO_SECRET_KEY"),
			UseSSL:    getEnv("MINIO_USE_SSL") == "true",
		},
		Server: ServerConfig{
			Port:     getEnv("SERVER_PORT"),
			CertFile: getEnv("CERT_FILE_PATH"),
			KeyFile:  getEnv("KEY_FILE_PATH"),
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
