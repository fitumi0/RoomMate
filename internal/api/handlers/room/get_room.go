package room

import (
	"encoding/json"
	"net/http"
	"roommate/internal/api/payload/room"
	"roommate/internal/models"

	"github.com/gorilla/schema"
)

// GetRoom returns a room by id
func (h *RoomHandler) GetRoom(w http.ResponseWriter, r *http.Request) {
	var request room.GetRoomRequest
	if err := schema.NewDecoder().Decode(&request, r.URL.Query()); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	if err := request.Validate(); err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	roomModel := &models.Room{
		ID: request.ID,
	}

	room, err := h.roomService.GetRoom(roomModel)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(room)
}
