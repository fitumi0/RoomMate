package routes

import (
	"net/http"
	httphandlers "roommate/internal/api/handlers"
	"roommate/internal/api/payload"
	"roommate/internal/router"
)

type HandlerMap map[string]struct {
	Handler      http.HandlerFunc
	RequiresAuth bool
}

// Route represents a single route configuration
type Route struct {
	Path     string
	Handlers HandlerMap
}

// RegisterRoutes registers all application routes
func RegisterRoutes(router router.Router, handlers *httphandlers.Handlers) {
	routes := []Route{
		{
			Path: "/api/room",
			Handlers: HandlerMap{
				payload.METHOD_POST: {
					Handler: handlers.Room.CreateRoom,
				},
				payload.METHOD_GET: {
					Handler: handlers.Room.GetRoom,
				},
			},
		},
		{
			Path: "/api/public-rooms",
			Handlers: HandlerMap{
				payload.METHOD_GET: {
					Handler:      handlers.Room.GetPublicRooms,
					RequiresAuth: true,
				},
			},
		},
		// Add more routes here as needed
	}

	// Register all routes
	for _, route := range routes {
		router.HandleFunc(route.Path, func(w http.ResponseWriter, r *http.Request) {
			if handlerEntry, exists := route.Handlers[r.Method]; exists {
				if handlerEntry.RequiresAuth {
					// TODO: implement auth
					httphandlers.NotFoundHandler(w, r)
					return
				}
				handlerEntry.Handler(w, r)
			} else {
				http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			}
		})
	}
}
