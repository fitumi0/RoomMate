package main

import (
	"fmt"
	"log"
	"net/http"
	"roommate/internal/api/factory"
	"roommate/internal/api/routes"
	"roommate/internal/models"
	"roommate/internal/router"
	"roommate/pkg/middleware"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

// temporary creds. move to env vars
const (
	dbUser     = "postgres"
	dbPassword = "postgres"
	dbName     = "roommate"
	dbHost     = "localhost"
	dbPort     = "5432"
)

func main() {
	initDB()

	router := router.NewRouter()

	router.Use(
		middleware.LoggingMiddleware,
		// add new middleware here
	)

	// Initialize all components using factory
	appFactory := factory.NewAppFactory(db)
	repos := appFactory.InitRepositories()
	services := appFactory.InitServices(repos)
	handlers := appFactory.InitHandlers(services)

	// Register all routes
	routes.RegisterRoutes(router, handlers)

	server := &http.Server{
		Addr:    ":8080",
		Handler: router,
	}

	log.Println("Server started on localhost:8080")
	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

func initDB() {
	var err error
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable", dbHost, dbUser, dbPassword, dbName, dbPort)
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	autoMigrate()
}

func autoMigrate() {
	err := db.AutoMigrate(&models.Room{}, &models.User{})
	if err != nil {
		log.Fatal("Migration failed: ", err)
	}
}
