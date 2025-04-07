package room

import (
	"encoding/json"
	"net/http"
	"roommate/internal/api/payload/room"
	"roommate/internal/models"
)

// CreateRoom creates a new room
func (h *RoomHandler) CreateRoom(w http.ResponseWriter, r *http.Request) {
	var request room.CreateRoomRequest

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	if err := request.Validate(); err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	roomModel := &models.Room{
		Title:       request.Title,
		Description: request.Description,
		Public:      request.Public,
	}

	roomID, errCreate := h.roomService.CreateRoom(roomModel)
	if errCreate != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response := room.CreateRoomResponse{ID: roomID}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
