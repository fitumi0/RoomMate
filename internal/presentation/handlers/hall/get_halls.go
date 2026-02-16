package hall

import (
	"context"
	"encoding/json"
	"net/http"
	"time"
)

func (h *HallHandler) GetHalls(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	halls, err := h.hallService.GetHalls(ctx)
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
