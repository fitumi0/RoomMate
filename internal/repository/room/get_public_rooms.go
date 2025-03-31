package room

import "roommate/internal/models"

// GetPublicRooms gets public rooms
func (r *RoomRepository) GetPublicRooms() (*[]models.Room, error) {
	return models.GetPublicRooms(r.db)
}
