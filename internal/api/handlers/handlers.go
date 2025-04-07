package handlers

import (
	"net/http"
	"roommate/internal/api/handlers/processing"
	"roommate/internal/api/handlers/room"
	"roommate/internal/api/handlers/storage"
)

// Handlers groups all handlers
type Handlers struct {
	Room       *room.RoomHandler
	Processing *processing.ProcessingHandler
	Storage    *storage.StorageHandler
	// Add new handlers here
}

func NotFoundHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotFound)
}
