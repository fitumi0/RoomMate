package room

import (
	"roommate/internal/repository/room"
)

type RoomService struct {
	roomRepository *room.RoomRepository
}

func NewRoomService(roomRepository *room.RoomRepository) *RoomService {
	return &RoomService{roomRepository: roomRepository}
}
