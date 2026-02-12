package entities

import (
	"strings"
	"time"

	"roommate/internal/domain"
)

type UserStatus string

const (
	UserStatusActive  UserStatus = "active"
	UserStatusUnknown UserStatus = "unknown"
	UserStatusBlocked UserStatus = "blocked"
)

type User struct {
	ID           int
	Username     string
	PasswordHash string
	DisplayName  string
	Status       UserStatus
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

func (u *User) Validate() error {
	if u == nil {
		return domain.ErrorEmptyStructure
	}

	if len(strings.TrimSpace(u.Username)) < 3 { // TODO: мб изменить на регулярку
		return domain.ErrorIncorrectUsername
	}

	if strings.TrimSpace(u.PasswordHash) == "" {
		return domain.ErrorIncorrectPassword
	}

	return nil
}

func (u *User) EffectiveStatus() UserStatus {
	if u.Status == "" {
		return UserStatusUnknown
	}

	return u.Status
}
