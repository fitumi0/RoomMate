package room

import (
	"roommate/internal/models"
)

func (s *RoomService) GetRoom(room *models.Room) (*models.Room, error) {
	return s.roomRepository.GetRoom(room)
}
