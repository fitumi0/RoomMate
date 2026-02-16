package hall

import (
	app "roommate/internal/app/services/hall"
)

type HallHandler struct {
	hallService *app.HallService
}

func NewHallHandler(hallService *app.HallService) *HallHandler {
	return &HallHandler{hallService: hallService}
}
