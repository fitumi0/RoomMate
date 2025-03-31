package room

import (
	"roommate/internal/models"
)

func (s *RoomService) UpdateRoom(room *models.Room) error {
	return s.roomRepository.UpdateRoom(room)
}
