package room

import (
	"context"
	"encoding/json"
	"roommate/internal/models"
	"strconv"
)

// Create creates a new room
func (r *RedisRoomRepository) Create(room *models.Room) (uint64, error) {
	ctx := context.Background()
	data, errMarshal := json.Marshal(room)

	if errMarshal != nil {
		// TODO: add logger
		return 0, errMarshal
	}

	status := r.rdb.Set(ctx, "room:"+strconv.FormatUint(room.ID, 10), data, room.TTL)

	if status.Err() != nil {
		// TODO: add logger
		return 0, status.Err()
	}

	return room.ID, nil
}
