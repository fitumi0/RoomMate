package postgres

import (
	"context"

	"gorm.io/gorm"

	"roommate/internal/domain/entities"
	pgentities "roommate/internal/infrastructure/postgres/entities"
)

type HallRepository struct {
	db *gorm.DB
}

func NewPostgresHallRepository(db *gorm.DB) *HallRepository {
	return &HallRepository{db: db}
}

func (r *HallRepository) CreateHall(ctx context.Context, hall *entities.Hall) error {
	pgHall := &pgentities.PgHall{}
	return r.db.WithContext(ctx).Create(pgHall).Error
}

func (r *HallRepository) GetHall(ctx context.Context, name string) (*entities.Hall, error) {
	var pgHall pgentities.PgHall
	err := r.db.WithContext(ctx).Where("name = ?", name).First(&pgHall).Error
	return &entities.Hall{}, err
}

func (r *HallRepository) GetAllHalls(ctx context.Context) ([]*entities.Hall, error) {
	var pgHalls []pgentities.PgHall

	err := r.db.WithContext(ctx).Find(&pgHalls).Error
	halls := make([]*entities.Hall, len(pgHalls))
	for i, pgHall := range pgHalls {
		halls[i] = &entities.Hall{
			ID: pgHall.ID,
		}
	}

	return halls, err
}
