package room

import (
	"roommate/internal/api/services/room"
)

// RoomHandler handles all room-related HTTP requests
type RoomHandler struct {
	roomService *room.RoomService
}

// NewRoomHandler creates a new room handler
func NewRoomHandler(roomService *room.RoomService) *RoomHandler {
	return &RoomHandler{
		roomService: roomService,
	}
}
