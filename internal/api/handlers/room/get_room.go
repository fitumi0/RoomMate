package room

import (
	"encoding/json"
	"net/http"
	"roommate/internal/api/payload/room"
	"roommate/internal/models"
	"strconv"
)

func (h *RoomHandler) GetRoom(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	idUint, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	request := &room.GetRoomRequest{
		ID: idUint,
	}

	response := &room.GetRoomResponse{}

	room, err := h.roomService.GetRoom(&models.Room{
		ID: request.ID,
	}, response)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(room)
}
