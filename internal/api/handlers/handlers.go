package handlers

import (
	"net/http"
	"roommate/internal/api/handlers/room"
)

// Handlers groups all handlers
type Handlers struct {
	Room *room.RoomHandler
	// Add new handlers here
}

func NotFoundHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotFound)
}
