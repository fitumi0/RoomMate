package main

import (
	"fmt"
	"log"
	"net/http"
	"roommate/internal/api/routes"
	"roommate/internal/config"
	"roommate/internal/core/factory"
	"roommate/internal/core/middleware"
	"roommate/internal/models"
	"roommate/internal/router"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/rs/cors"
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
	minioClient, minioError := initMinio(cfg)
	if minioError != nil {
		log.Fatal(minioError)
	}

	router := router.NewRouter()
	cors.Default().Handler(router)

	router.Use(
		middleware.LoggingMiddleware,
		// add new middleware here
	)

	// Initialize all components using factory
	appFactory := factory.NewAppFactory(db, minioClient)
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
	if err := server.ListenAndServeTLS(cfg.Server.CertFile, cfg.Server.KeyFile); err != nil {
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

func initMinio(cfg *config.Config) (*minio.Client, error) {
	minioClient, err := minio.New(cfg.Minio.Endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(cfg.Minio.AccessKey, cfg.Minio.SecretKey, ""),
		Secure: cfg.Minio.UseSSL,
	})

	if err != nil {
		return nil, err
	}

	return minioClient, nil
}

func autoMigrate() {
	err := db.AutoMigrate(&models.Room{}, &models.User{})
	if err != nil {
		log.Fatal("Migration failed: ", err)
	}
}
