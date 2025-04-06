package room

import (
	"encoding/json"
	"net/http"
	"roommate/internal/api/payload/room"
	"roommate/internal/models"
)

// UpdateRoom updates a room
func (h *RoomHandler) UpdateRoom(w http.ResponseWriter, r *http.Request) {
	var request room.UpdateRoomRequest

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	if err := request.Validate(); err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	roomModel := &models.Room{
		ID:          request.ID,
		Title:       request.Title,
		Description: request.Description,
	}

	if errUpdate := h.roomService.UpdateRoom(roomModel); errUpdate != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	// TODO, Q: need to return the updated room?
	json.NewEncoder(w)
}
