package processing

import (
	"net/http"
	"os"
)

// TODO: Root for test purposes only. will be removed later
func (h *ProcessingHandler) Root(w http.ResponseWriter, r *http.Request) {
	form := os.Getenv("UPLOAD_FORM")

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Write([]byte(form))
}
