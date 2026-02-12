package app

import (
	"context"
	"roommate/internal/app"
	"roommate/internal/domain/entities"
)

type HallService struct {
	repo HallRepository
}

func NewHallService(repo HallRepository) *HallService {
	return &HallService{repo: repo}
}

func (s *HallService) CreateHall(ctx context.Context, hall *entities.Hall) error {
	if err := hall.Validate(); err != nil {
		return err
	}

	if hall.MaxMembers <= 0 { // По сути если < 0 то отлетит валидация, но пусть будет
		hall.MaxMembers = app.DefaultMaxMembers
	}

	return s.repo.CreateHall(ctx, hall)
}

func (s *HallService) GetHall(ctx context.Context, name string) (*entities.Hall, error) {
	return s.repo.GetHall(ctx, name)
}

func (s *HallService) GetAllHalls(ctx context.Context) ([]*entities.Hall, error) {
	return s.repo.GetAllHalls(ctx)
}
