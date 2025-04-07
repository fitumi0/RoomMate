package services

import (
	"roommate/internal/services/processing"
	"roommate/internal/services/room"
	"roommate/internal/services/storage"
)

// Services groups all services
type Services struct {
	Room       *room.RoomService
	Processing *processing.ProcessingService
	Storage    *storage.StorageService
	// Add more services here
}
