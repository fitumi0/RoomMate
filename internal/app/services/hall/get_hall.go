package hall

import (
	"context"
	"roommate/internal/domain/entities"
)

func (s *HallService) GetHall(ctx context.Context, name string) (*entities.Hall, error) {
	return s.hallRepo.GetHall(ctx, name)
}
