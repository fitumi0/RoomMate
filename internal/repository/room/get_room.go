package room

import "roommate/internal/models"

// CreateRoom creates a new room
func (r *RoomRepository) GetRoom(room *models.Room) (*models.Room, error) {
	result := r.db.First(room)
	if result.Error != nil {
		return nil, result.Error
	}

	return room, nil
}
