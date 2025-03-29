package routes

import (
	"net/http"
	"roommate/internal/api/handlers"
	"roommate/internal/api/payload"
	"roommate/internal/router"
)

// Route represents a single route configuration
type Route struct {
	Method  string
	Path    string
	Handler http.HandlerFunc
}

// RegisterRoutes registers all application routes
func RegisterRoutes(router router.Router, handlers *handlers.Handlers) {
	routes := []Route{
		// TODO: Think about how to handle single route with multiple methods
		// e.g. [GET]:  /api/room - handlers.Room.GetRoom
		//      [POST]: /api/room - handlers.Room.CreateRoom
		{Method: payload.METHOD_POST, Path: "/api/room", Handler: handlers.Room.CreateRoom},
		{Method: payload.METHOD_GET, Path: "/api/get-room", Handler: handlers.Room.GetRoom},
		// User routes
		// Add more routes here as needed
	}

	// Register all routes
	for _, route := range routes {
		router.HandleFunc(route.Path, func(w http.ResponseWriter, r *http.Request) {
			if r.Method != route.Method {
				http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
				return
			}
			route.Handler(w, r)
		})
	}
}
