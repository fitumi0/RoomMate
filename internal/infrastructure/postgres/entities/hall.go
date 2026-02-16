package entities

import (
	"strings"
	"time"

	"roommate/internal/domain"
)

type HallStatus string

const (
	HallStatusOpen  HallStatus = "open"
	HallStatusLive  HallStatus = "live"
	HallStatusEnded HallStatus = "ended"
)

type HallVisibility string

const (
	HallVisibilityPrivate HallVisibility = "private"
	HallVisibilityPublic  HallVisibility = "public"
)

// HallType enum
const (
	HallAnonymous = iota
	HallUser
	HallSystem
)

type PgHall struct {
	ID         int            `gorm:"column:id;primaryKey;autoIncrement"`
	Type       uint8          `gorm:"column:type"`
	Code       string         `gorm:"column:code"`
	Title      string         `gorm:"column:title"`
	OwnerID    int64          `gorm:"column:owner_id"`
	TTL        uint64         `gorm:"column:ttl"`
	Status     HallStatus     `gorm:"column:status"`
	Visibility HallVisibility `gorm:"column:visibility"`
	MaxMembers uint16         `gorm:"column:max_members"`
	CreatedAt  time.Time      `gorm:"column:created_at"`
	UpdatedAt  time.Time      `gorm:"column:updated_at"`
}

func (h *PgHall) TableName() string {
	return "halls"
}

func (h *PgHall) Validate() error {
	if h == nil {
		return domain.ErrorEmptyStructure
	}

	title := strings.TrimSpace(h.Title)

	if len(title) < 3 {
		return domain.ErrorIncorrectHallTitle
	}

	if h.Code != "" && len(strings.TrimSpace(h.Code)) < 4 {
		return domain.ErrorIncorrectHallCode
	}

	return nil
}

func (h *PgHall) EffectiveTitle() string {
	return strings.TrimSpace(h.Title)
}

func (h *PgHall) EffectiveMaxMembers() uint16 {
	return h.MaxMembers
}
