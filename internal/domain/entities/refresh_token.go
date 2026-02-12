package entities

import (
	"time"

	"roommate/internal/domain"
)

type RefreshToken struct {
	ID        int
	UserID    int
	TokenHash string
	ExpiresAt time.Time
	RevokedAt *time.Time
	CreatedAt time.Time
}

func (t *RefreshToken) Validate() error {
	if t == nil {
		return domain.ErrorEmptyStructure
	}

	// TODO: implement

	if t.ExpiresAt.IsZero() {
		return domain.ErrorIncorrectTokenExpiry
	}

	return nil
}
