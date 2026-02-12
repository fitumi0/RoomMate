package entities

import (
	"roommate/internal/domain"
	"time"
)

type HallMemberRole string

const (
	HallMemberRoleHost   HallMemberRole = "host"
	HallMemberRoleCohost HallMemberRole = "cohost" // Подойдет как для 2-3 хоста и много зрителей, так и для "все хосты"
	HallMemberRoleViewer HallMemberRole = "viewer"
)

type HallMember struct {
	HallID     int
	UserID     int
	Role       HallMemberRole
	JoinedAt   time.Time
	LeftAt     *time.Time
	IsOnline   bool
	LastSeenAt *time.Time
}

func (m *HallMember) Validate() error {
	if m == nil {
		return domain.ErrorEmptyStructure
	}

	if m.HallID <= 0 || m.UserID <= 0 {
		return domain.ErrorIncorrectIdentifier
	}

	if m.Role != HallMemberRoleHost && m.Role != HallMemberRoleCohost && m.Role != HallMemberRoleViewer {
		return domain.ErrorIncorrectMemberRole
	}

	return nil
}

func (m *HallMember) CanControlPlayback() bool {
	return m.Role == HallMemberRoleHost || m.Role == HallMemberRoleCohost
}
