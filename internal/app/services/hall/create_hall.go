package hall

import (
	"context"
	"roommate/internal/app"
	"roommate/internal/domain/entities"
)

func (s *HallService) CreateHall(ctx context.Context, hall *entities.Hall) error {
	if err := hall.Validate(); err != nil {
		return err
	}

	if hall.MaxMembers <= 0 { // По сути если < 0 то отлетит валидация, но пусть будет
		hall.MaxMembers = app.DefaultMaxMembers
	}

	return s.repo.CreateHall(ctx, hall)
}
