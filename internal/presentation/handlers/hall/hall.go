package hall

import (
	app "roommate/internal/app/services/hall"

	"github.com/sirupsen/logrus"
)

type HallHandler struct {
	hallService *app.HallService
	logger      *logrus.Logger
}

func NewHallHandler(hallService *app.HallService, l *logrus.Logger) *HallHandler {
	return &HallHandler{hallService: hallService, logger: l}
}
