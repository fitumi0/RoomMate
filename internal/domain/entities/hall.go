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

type Hall struct {
	ID          int            `json:"id"`
	Code        string         `json:"code,omitempty"`
	Title       string         `json:"title,omitempty"`
	OwnerUserID int            `json:"owner_user_id,omitempty"`
	Status      HallStatus     `json:"status,omitempty"`
	Visibility  HallVisibility `json:"visibility,omitempty"`
	MaxMembers  int            `json:"max_members,omitempty"`
	SyncVersion int64          `json:"sync_version,omitempty"`
	CreatedAt   time.Time      `json:"created_at,omitempty"`
	UpdatedAt   time.Time      `json:"updated_at,omitempty"`
}

func (h *Hall) Validate() error {
	if h == nil {
		return domain.ErrorEmptyStructure
	}

	title := strings.TrimSpace(h.Title)

	if len(title) < 3 { // TODO: мб изменить на регулярку
		return domain.ErrorIncorrectHallTitle
	}

	if h.Code != "" && len(strings.TrimSpace(h.Code)) < 4 {
		return domain.ErrorIncorrectHallCode
	}

	if h.MaxMembers < 0 {
		return domain.ErrorIncorrectHallCapacity
	}

	// Пока так, ибо пользователю будет мало что доступно к заполнению

	// if h.Status != "" && h.Status != HallStatusOpen && h.Status != HallStatusLive && h.Status != HallStatusEnded {
	// 	return domain.ErrorIncorrectHallStatus
	// }

	// if h.Visibility != "" && h.Visibility != HallVisibilityPrivate && h.Visibility != HallVisibilityPublic {
	// 	return domain.ErrorIncorrectHallVisibility
	// }

	// if h.SyncVersion < 0 {
	// 	return domain.ErrorIncorrectSyncVersion
	// }

	// if h.OwnerUserID < 0 {
	// 	return domain.ErrorIncorrectIdentifier
	// }

	return nil
}

func (h *Hall) EffectiveTitle() string {
	return strings.TrimSpace(h.Title)
}

func (h *Hall) EffectiveMaxMembers() int {
	return h.MaxMembers
}
