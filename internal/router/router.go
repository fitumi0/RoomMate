package router

import (
	"net/http"
)

// Router defines an interface for handling HTTP routes and middleware.
type Router interface {
	// Handle registers a new route with a pattern and handler.
	Handle(pattern string, handler http.Handler)

	// HandleFunc registers a new route with a pattern and a handler function.
	HandleFunc(pattern string, handler func(http.ResponseWriter, *http.Request))

	// ServeHTTP dispatches the request to the handler whose pattern matches the request URL.
	ServeHTTP(w http.ResponseWriter, r *http.Request)

	// Use adds middleware to the router stack.
	Use(middleware ...func(http.Handler) http.Handler)
}

// httpRouter is an implementation of the Router interface.
type httpRouter struct {
	mux         *http.ServeMux
	middlewares []func(http.Handler) http.Handler
}

// NewRouter creates and returns a new httpRouter instance.
func NewRouter() Router {
	return &httpRouter{
		mux:         http.NewServeMux(),
		middlewares: []func(http.Handler) http.Handler{},
	}
}

// Handle registers a new route in the httpRouter.
func (r *httpRouter) Handle(pattern string, handler http.Handler) {
	r.mux.Handle(pattern, handler)
}

// Use appends middleware to the httpRouter's middleware stack.
func (r *httpRouter) Use(middleware ...func(http.Handler) http.Handler) {
	r.middlewares = append(r.middlewares, middleware...)
}

// ServeHTTP processes the request using the registered middleware and routes.
func (r *httpRouter) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	var handler http.Handler = r.mux

	// Apply middleware in reverse order.
	for i := len(r.middlewares) - 1; i >= 0; i-- {
		handler = r.middlewares[i](handler)
	}

	// Serve the request.
	handler.ServeHTTP(w, req)
}

func (r *httpRouter) HandleFunc(pattern string, handler func(http.ResponseWriter, *http.Request)) {
	r.Handle(pattern, http.HandlerFunc(handler))
}
