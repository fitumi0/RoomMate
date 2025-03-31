package room

import (
	"roommate/internal/models"
)

func (s *RoomService) GetPublicRooms() (*[]models.Room, error) {
	return s.roomRepository.GetPublicRooms()
}
