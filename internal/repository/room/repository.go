package room

import (
	"gorm.io/gorm"
)

// RoomRepository is a repository for the room model
type RoomRepository struct {
	db *gorm.DB
}

// NewRoomRepository creates a new room repository
func NewRoomRepository(db *gorm.DB) *RoomRepository {
	return &RoomRepository{db: db}
}

// Get all rooms

// Get room by id

// Delete room
