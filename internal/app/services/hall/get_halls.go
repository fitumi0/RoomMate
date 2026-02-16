package hall

import (
	"context"
	"roommate/internal/domain/entities"
)

func (s *HallService) GetHalls(ctx context.Context) ([]*entities.Hall, error) {
	return s.repo.GetHalls(ctx)
}
