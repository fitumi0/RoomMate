package room

import (
	"roommate/internal/models"
)

func (s *RoomService) CreateRoom(room *models.Room) (uint64, error) {
	return s.roomRepository.CreateRoom(room)
}
