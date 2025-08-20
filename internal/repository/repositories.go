package repository

import (
	"roommate/internal/repository/processing"
	"roommate/internal/repository/room"
	"roommate/internal/repository/storage"
)

// Repositories groups all repositories
type Repositories struct {
	Room       *room.PgRoomRepository
	Processing *processing.ProcessingRepository
	Storage    *storage.StorageRepository
	// Add new repositories here
}
