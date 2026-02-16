package hall

import (
	"context"

	"roommate/internal/domain/entities"
)

type HallRepository interface {
	CreateHall(ctx context.Context, hall *entities.Hall) error
	GetHall(ctx context.Context, name string) (*entities.Hall, error)
	GetHalls(ctx context.Context) ([]*entities.Hall, error)
}
