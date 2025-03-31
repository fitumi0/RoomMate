package room

import "roommate/internal/models"

// CreateRoom creates a new room
func (r *RoomRepository) CreateRoom(room *models.Room) (uint64, error) {
	return room.Create(r.db)
}
