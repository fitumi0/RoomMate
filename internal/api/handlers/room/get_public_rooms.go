package room

import (
	"encoding/json"
	"net/http"
)

// GetPublicRooms returns all public rooms
func (h *RoomHandler) GetPublicRooms(w http.ResponseWriter, r *http.Request) {
	rooms, err := h.roomService.GetPublicRooms()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(rooms)
}
