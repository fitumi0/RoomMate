package user

import (
	"context"
	"net/http"
	"time"
)

func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
	_, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	w.WriteHeader(http.StatusNoContent)
}
