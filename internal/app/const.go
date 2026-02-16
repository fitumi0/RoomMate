package app

import "time"

const (
	DefaultMaxMembers       = 8
	DefaultTemporaryHallTTL = 12 * time.Hour // Время жизни временного зала (как правило - неавторизованный)
)
