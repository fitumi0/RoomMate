package room

import (
	"roommate/internal/models"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type RoomRepository interface {
	Create(room *models.Room) (uint64, error)
	// GetAll() ([]Room, error)
	// GetByID(id uint64) (*Room, error)
	Update(room *models.Room) error
	Delete(room *models.Room) error
	Restore(room *models.Room) error
}

// PgRoomRepository is a postgres repository
type PgRoomRepository struct {
	db *gorm.DB
}

// RedisRoomRepository is a redis repository
type RedisRoomRepository struct {
	rdb *redis.Client
}

// NewRoomRepository creates a new room repository
func NewRedisRoomRepository(rdb *redis.Client) *RedisRoomRepository {
	return &RedisRoomRepository{rdb: rdb}
}

func NewPgRoomRepository(db *gorm.DB) *PgRoomRepository {
	return &PgRoomRepository{db: db}
}
