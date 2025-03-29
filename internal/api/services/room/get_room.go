package room

import (
	"roommate/internal/api/payload/room"
	"roommate/internal/models"
)

// TODO: implement
func (s *RoomService) GetRoom(room *models.Room, response *room.GetRoomResponse) (*models.Room, error) {
	return s.roomRepository.GetRoom(room)
}
