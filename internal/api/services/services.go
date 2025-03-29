package services

import "roommate/internal/api/services/room"

// Services groups all services
type Services struct {
	Room *room.RoomService
	// Add more services here
}
