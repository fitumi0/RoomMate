package factory

import (
	"roommate/internal/api/handlers"
	processinghandler "roommate/internal/api/handlers/processing"
	roomhandler "roommate/internal/api/handlers/room"
	storagehandler "roommate/internal/api/handlers/storage"
	"roommate/internal/repository"
	processingrepository "roommate/internal/repository/processing"
	roomrepository "roommate/internal/repository/room"
	storagerepository "roommate/internal/repository/storage"
	"roommate/internal/services"
	processingservice "roommate/internal/services/processing"
	roomservice "roommate/internal/services/room"
	storageservice "roommate/internal/services/storage"

	"github.com/minio/minio-go/v7"
	"gorm.io/gorm"
)

// AppFactory handles initialization of all application components
type AppFactory struct {
	db          *gorm.DB
	minioClient *minio.Client
}

// NewAppFactory creates a new factory instance
func NewAppFactory(db *gorm.DB, minioClient *minio.Client) *AppFactory {
	return &AppFactory{
		db:          db,
		minioClient: minioClient,
	}
}

// InitRepositories initializes all repositories
func (f *AppFactory) InitRepositories() *repository.Repositories {
	return &repository.Repositories{
		Room:       roomrepository.NewRoomRepository(f.db),
		Processing: processingrepository.NewProcessingRepository(f.db),
		Storage:    storagerepository.NewStorageRepository(f.db, f.minioClient),
		// Add new repositories here
	}
}

// InitServices initializes all services
func (f *AppFactory) InitServices(repos *repository.Repositories) *services.Services {
	return &services.Services{
		Room:       roomservice.NewRoomService(repos.Room),
		Processing: processingservice.NewProcessingService(repos.Processing, repos.Storage),
		Storage:    storageservice.NewStorageService(repos.Storage),
		// Add new services here
	}
}

// InitHandlers initializes all handlers
func (f *AppFactory) InitHandlers(services *services.Services) *handlers.Handlers {
	return &handlers.Handlers{
		Room:       roomhandler.NewRoomHandler(services.Room),
		Processing: processinghandler.NewProcessingHandler(services.Processing, services.Storage),
		Storage:    storagehandler.NewStorageHandler(services.Storage),
		// Add new handlers here
	}
}
