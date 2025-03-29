package handlers

import (
	"roommate/internal/api/handlers/room"
)

// Handlers groups all handlers
type Handlers struct {
	Room *room.RoomHandler
	// Add new handlers here
}
