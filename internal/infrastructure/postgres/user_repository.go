package postgres

import (
	"context"
	"roommate/internal/domain/entities"
	pgentities "roommate/internal/infrastructure/postgres/entities"

	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewPostgresUserRepository(db *gorm.DB) *UserRepository {
	if err := db.AutoMigrate(&pgentities.PgUser{}); err != nil {
		panic(err)
	}

	return &UserRepository{db: db}
}

func (r *UserRepository) RegisterUser(ctx context.Context, user *entities.User) error {
	pgUser := &pgentities.PgUser{
		Username:     user.Username,
		PasswordHash: user.PasswordHash,
	}
	return r.db.WithContext(ctx).Create(pgUser).Error
}

func (r *UserRepository) UserExists(ctx context.Context, username string) (bool, error) {
	var pgUser pgentities.PgUser

	err := r.db.WithContext(ctx).Where("username = ?", username).First(&pgUser).Error
	if err == gorm.ErrRecordNotFound {
		err = nil // FIXME:
	}

	return pgUser.ID != 0, err
}
