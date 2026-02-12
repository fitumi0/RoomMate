package entities

import (
	"strings"
	"time"

	"roommate/internal/domain"
)

type HallStatus string

type HallVisibility string

const (
	HallStatusOpen  HallStatus = "open"
	HallStatusLive  HallStatus = "live"
	HallStatusEnded HallStatus = "ended"
)

const (
	HallVisibilityPrivate HallVisibility = "private"
	HallVisibilityPublic  HallVisibility = "public"
)

type PgHall struct {
	ID          int            `gorm:"column:id;primaryKey;autoIncrement"`
	Code        string         `gorm:"column:code"`
	Title       string         `gorm:"column:title"`
	OwnerUserID int            `gorm:"column:owner_user_id"`
	Status      HallStatus     `gorm:"column:status"`
	Visibility  HallVisibility `gorm:"column:visibility"`
	MaxMembers  int            `gorm:"column:max_members"`
	SyncVersion int64          `gorm:"column:sync_version"`
	CreatedAt   time.Time      `gorm:"column:created_at"`
	UpdatedAt   time.Time      `gorm:"column:updated_at"`
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

	if h.Status != "" && h.Status != HallStatusOpen && h.Status != HallStatusLive && h.Status != HallStatusEnded {
		return domain.ErrorIncorrectHallStatus
	}

	if h.Visibility != "" && h.Visibility != HallVisibilityPrivate && h.Visibility != HallVisibilityPublic {
		return domain.ErrorIncorrectHallVisibility
	}

	if h.MaxMembers < 0 {
		return domain.ErrorIncorrectHallCapacity
	}

	if h.SyncVersion < 0 {
		return domain.ErrorIncorrectSyncVersion
	}

	if h.OwnerUserID < 0 {
		return domain.ErrorIncorrectIdentifier
	}

	return nil
}

func (h *PgHall) EffectiveTitle() string {
	return strings.TrimSpace(h.Title)
}

func (h *PgHall) EffectiveMaxMembers() int {
	return h.MaxMembers
}
