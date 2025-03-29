package main

import (
	"fmt"
	"log"
	"net/http"
	"roommate/internal/api/factory"
	"roommate/internal/api/routes"
	"roommate/internal/config"
	"roommate/internal/models"
	"roommate/internal/router"
	"roommate/pkg/middleware"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func main() {
	cfg, configError := config.NewConfig()
	if configError != nil {
		log.Fatal(configError)
	}

	initDB(cfg)

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
		Addr:    ":" + cfg.Server.Port,
		Handler: router,
	}

	log.Printf("Server started on localhost:%s", cfg.Server.Port)
	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

func initDB(cfg *config.Config) {
	var err error
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		cfg.DB.Host, cfg.DB.User, cfg.DB.Password, cfg.DB.Name, cfg.DB.Port)
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
