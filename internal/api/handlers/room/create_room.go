package room

import (
	"encoding/json"
	"net/http"
	"roommate/internal/api/payload/room"
	"roommate/internal/models"
)

func (h *RoomHandler) CreateRoom(w http.ResponseWriter, r *http.Request) {
	title := r.URL.Query().Get("title")
	description := r.URL.Query().Get("description")

	request := &room.CreateRoomRequest{
		Title:       title,
		Description: description,
	}

	response := &room.CreateRoomResponse{}

	h.roomService.CreateRoom(&models.Room{
		Title:       request.Title,
		Description: request.Description,
	}, response)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
