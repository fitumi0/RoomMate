package hall

import (
	"context"
	"encoding/json"
	"net/http"
	"roommate/internal/domain/entities"
	"time"
)

func (h *HallHandler) CreateHall(w http.ResponseWriter, r *http.Request) {
	l := h.logger

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	var req struct {
		Code       string `json:"code"`
		Title      string `json:"title"`
		MaxMembers uint16 `json:"max_members"`
	}

	// TODO: validate

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		l.WithField("Request", "CreateHall").Error(err.Error()) // TODO: надо что то получше будет выдумать
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
