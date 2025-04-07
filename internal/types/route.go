package types

import "net/http"

type HandlerMap map[string]struct {
	Handler      http.HandlerFunc
	RequiresAuth bool
}

// Route represents a single route configuration
type Route struct {
	Path     string
	Handlers HandlerMap
}
