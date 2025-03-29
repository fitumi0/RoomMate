package room

import (
	"roommate/internal/api/payload/room"
	"roommate/internal/models"
)

// TODO: implement
func (s *RoomService) CreateRoom(room *models.Room, response *room.CreateRoomResponse) error {
	return s.roomRepository.CreateRoom(room)
}
