package postgres

import (
	"context"
	"roommate/internal/domain/entities"

	"gorm.io/gorm"
)

type User struct {
	ID           int    `gorm:"column:id;primaryKey"`
	Username     string `gorm:"column:username;unique"`
	PasswordHash string `gorm:"column:password_hash;not null"`
}

type UserRepository struct {
	db *gorm.DB
}

func NewPostgresUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) RegisterUser(ctx context.Context, user *entities.User) error {
	pgUser := &User{
		Username:     user.Username,
		PasswordHash: user.PasswordHash,
	}
	return r.db.WithContext(ctx).Create(pgUser).Error
}

func (r *UserRepository) UserExists(ctx context.Context, username string) (bool, error) {
	var pgUser User

	err := r.db.WithContext(ctx).Where("username = ?", username).First(&pgUser).Error
	if err == gorm.ErrRecordNotFound {
		err = nil // FIXME:
	}

	return pgUser.ID != 0, err
}
