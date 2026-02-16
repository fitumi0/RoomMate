package app

import (
	"context"

	"roommate/internal/domain/entities"
)

type UserRepository interface {
	UserExists(ctx context.Context, username string) (bool, error)
	RegisterUser(ctx context.Context, user *entities.User) error
}
