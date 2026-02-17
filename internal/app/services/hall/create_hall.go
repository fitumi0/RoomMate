package hall

import (
	"context"
	"roommate/internal/domain/entities"
)

func (s *HallService) CreateHall(ctx context.Context, hall *entities.Hall) error {
	if err := hall.Validate(); err != nil {
		return err
	}

	return s.repo.CreateHall(ctx, hall)
}
