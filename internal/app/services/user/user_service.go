package app

import (
	"context"
	"errors"
	"roommate/internal/app"
	"roommate/internal/domain/entities"
)

type UserService struct {
	repo UserRepository
}

func NewUserService(repo UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) RegisterUser(ctx context.Context, username string, password string) error {
	user := &entities.User{
		Username:     username,
		PasswordHash: HashPassword(ctx, password, "salt"),
	}

	if err := user.Validate(); err != nil {
		// todo: add logger
		return app.ErrorUserValidation
	}

	exists, err := s.repo.UserExists(ctx, username)
	if err != nil {
		// todo: add logger
		return err
	}

	if exists {
		// todo: add logger
		return app.ErrorUserExists
	}

	if errRepo := s.repo.RegisterUser(ctx, user); errRepo != nil {
		// TODO: add logger
		return errors.New(app.ErrorUserCreate.Error() + ": " + errRepo.Error())
	}

	return nil
}

func (s *UserService) UserExists(ctx context.Context, username string) (bool, error) {
	return s.repo.UserExists(ctx, username)
}

func HashPassword(ctx context.Context, password string, salt string) string {
	return password
}
