package room

import "roommate/internal/models"

// GetRoom gets a room
func (r *PgRoomRepository) GetRoom(room *models.Room) (*models.Room, error) {
	return room.Get(r.db)
}
