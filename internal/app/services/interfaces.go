package app

import (
	"context"

	"roommate/internal/domain/entities"
)

type UserRepository interface {
	UserExists(ctx context.Context, username string) (bool, error)
	RegisterUser(ctx context.Context, user *entities.User) error
}

type HallRepository interface {
	CreateHall(ctx context.Context, hall *entities.Hall) error
	GetHall(ctx context.Context, name string) (*entities.Hall, error)
	GetAllHalls(ctx context.Context) ([]*entities.Hall, error)
}

type HallMemberRepository interface{}

type HallPlaybackStateRepository interface{}

type RefreshTokenRepository interface{}
