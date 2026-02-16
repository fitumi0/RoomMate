package user

import (
	"context"
	"encoding/json"
	"net/http"
	"roommate/internal/presentation"
)

// TODO: fix
func (h *UserHandler) Register(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), presentation.DefaultContextTimeout)
	defer cancel()

	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)

		return
	}

	err := h.userService.RegisterUser(ctx, req.Username, req.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)

		return
	}

	w.WriteHeader(http.StatusCreated)
}
