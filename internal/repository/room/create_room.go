package room

import "roommate/internal/models"

// CreateRoom creates a new room
func (r *RoomRepository) CreateRoom(room *models.Room) error {
	// TODO: implement
	return r.db.Create(room).Error
}
