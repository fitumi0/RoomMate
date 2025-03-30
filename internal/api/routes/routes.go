package routes

import (
	"net/http"
	"roommate/internal/api/handlers"
	"roommate/internal/api/payload"
	"roommate/internal/router"
)

type HandlerMap map[string]http.HandlerFunc

// Route represents a single route configuration
type Route struct {
	Path     string
	Handlers HandlerMap
}

// RegisterRoutes registers all application routes
func RegisterRoutes(router router.Router, handlers *handlers.Handlers) {
	routes := []Route{
		{
			Path: "/api/room",
			Handlers: HandlerMap{
				payload.METHOD_POST: handlers.Room.CreateRoom,
				payload.METHOD_GET:  handlers.Room.GetRoom,
			},
		},
		// Add more routes here as needed
	}

	// Register all routes
	for _, route := range routes {
		router.HandleFunc(route.Path, func(w http.ResponseWriter, r *http.Request) {
			if handler, exists := route.Handlers[r.Method]; exists {
				handler(w, r)
			} else {
				http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			}
		})
	}
}
