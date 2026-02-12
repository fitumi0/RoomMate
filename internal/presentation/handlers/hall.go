package presentation

import (
	"context"
	"encoding/json"
	"net/http"
	app "roommate/internal/app/services"
	"roommate/internal/domain/entities"
	"time"
)

type HallHandler struct {
	hallService *app.HallService
}

func NewHallHandler(hallService *app.HallService) *HallHandler {
	return &HallHandler{hallService: hallService}
}

func (h *HallHandler) GetAllHalls(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	halls, err := h.hallService.GetAllHalls(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)

		return
	}

	if len(halls) == 0 {
		w.WriteHeader(http.StatusNoContent)

		return
	}

	w.Header().Set("Content-Type", "application/json")

	w.WriteHeader(http.StatusOK)
	byteData, err := json.Marshal(halls)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)

		return
	}

	w.Write(byteData)
}

func (h *HallHandler) CreateHall(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	var req struct {
		Code       string `json:"code"`
		Title      string `json:"title"`
		MaxMembers int    `json:"max_members"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)

		return
	}

	err := h.hallService.CreateHall(ctx, &entities.Hall{
		Code:       req.Code,
		Title:      req.Title,
		MaxMembers: req.MaxMembers,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)

		return
	}

	w.WriteHeader(http.StatusCreated)
}
