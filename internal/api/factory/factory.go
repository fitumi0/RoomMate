package factory

import (
	"roommate/internal/api/handlers"
	roomhandler "roommate/internal/api/handlers/room"
	"roommate/internal/api/services"
	roomservice "roommate/internal/api/services/room"
	"roommate/internal/repository"
	roomrepository "roommate/internal/repository/room"

	"gorm.io/gorm"
)

// AppFactory handles initialization of all application components
type AppFactory struct {
	db *gorm.DB
}

// NewAppFactory creates a new factory instance
func NewAppFactory(db *gorm.DB) *AppFactory {
	return &AppFactory{db: db}
}

// InitRepositories initializes all repositories
func (f *AppFactory) InitRepositories() *repository.Repositories {
	return &repository.Repositories{
		Room: roomrepository.NewRoomRepository(f.db),
		// Add new repositories here
	}
}

// InitServices initializes all services
func (f *AppFactory) InitServices(repos *repository.Repositories) *services.Services {
	return &services.Services{
		Room: roomservice.NewRoomService(repos.Room),
		// Add new services here
	}
}

// InitHandlers initializes all handlers
func (f *AppFactory) InitHandlers(services *services.Services) *handlers.Handlers {
	return &handlers.Handlers{
		Room: roomhandler.NewRoomHandler(services.Room),
		// Add new handlers here
	}
}
