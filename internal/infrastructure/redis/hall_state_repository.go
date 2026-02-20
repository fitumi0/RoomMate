package redis

import (
	"context"
	"fmt"
	"roommate/internal/infrastructure"

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
	key := fmt.Sprintf(infrastructure.RedisHashStateKeyPattern, hallID)
	value := map[string]interface{}{}

	return r.rdb.HSet(ctx, key, value).Err()
}
