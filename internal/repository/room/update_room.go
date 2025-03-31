package room

import "roommate/internal/models"

// UpdateRoom updates a room
func (r *RoomRepository) UpdateRoom(room *models.Room) error {
	if err := room.Update(r.db); err != nil {
		return err
	}

	return nil
}
