package repository

import "roommate/internal/repository/room"

// Repositories groups all repositories
type Repositories struct {
	Room *room.RoomRepository
	// Add new repositories here
}
