package redis

import (
	"context"

	"github.com/redis/go-redis/v9"
)

// TODO: implement

type HallStateRepository struct {
	rdb *redis.Client
}

func NewRedisHallStateRepository(rdb *redis.Client) *HallStateRepository {
	return &HallStateRepository{rdb: rdb}
}

func (r *HallStateRepository) SetState(ctx context.Context /*TODO:*/) error {
	return nil
}
