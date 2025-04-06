package routes

import (
	"net/http"
	httphandlers "roommate/internal/api/handlers"
	"roommate/internal/api/payload"
	"roommate/internal/router"
	"roommate/internal/types"

	httpSwagger "github.com/swaggo/http-swagger"
)

// RegisterRoutes registers all application routes
func RegisterRoutes(router router.Router, handlers *httphandlers.Handlers) {
	var routes []types.Route

	root := types.Route{
		Path: "/",
		Handlers: types.HandlerMap{
			payload.METHOD_GET: {Handler: handlers.Processing.Root},
		},
	}

	swaggerRoutes := []types.Route{
		{
			Path: "/swagger/",
			Handlers: types.HandlerMap{
				payload.METHOD_GET: {Handler: httpSwagger.WrapHandler},
			},
		},
		{
			Path: "/swagger.json",
			Handlers: types.HandlerMap{
				payload.METHOD_GET: {Handler: func(w http.ResponseWriter, r *http.Request) {
					http.ServeFile(w, r, "./swagger.json")
				},
				},
			},
		},
	}

	authRoutes := []types.Route{
		{Path: "/api/login"},
		{Path: "/api/register"},
		{Path: "/api/revoke"},
	}

	roomRoutes := []types.Route{
		{
			Path: "/api/rooms",
			Handlers: types.HandlerMap{
				payload.METHOD_POST:  {Handler: handlers.Room.CreateRoom},
				payload.METHOD_GET:   {Handler: handlers.Room.GetRoom},
				payload.METHOD_PATCH: {Handler: handlers.Room.UpdateRoom},
			},
		},
		{
			Path: "/api/rooms/public",
			Handlers: types.HandlerMap{
				payload.METHOD_GET: {Handler: handlers.Room.GetPublicRooms},
			},
		},
	}

	processingRoutes := []types.Route{
		{
			Path: "/api/processing/transcode-and-upload-video",
			Handlers: types.HandlerMap{
				payload.METHOD_POST: {Handler: handlers.Processing.TranscodeAndUploadVideo},
			},
		},
	}

	videoRoutes := []types.Route{}

	routes = append(routes, swaggerRoutes...)
	routes = append(routes, authRoutes...)
	routes = append(routes, roomRoutes...)
	routes = append(routes, processingRoutes...)
	routes = append(routes, videoRoutes...)
	routes = append(routes, root)

	// TODO: will be implemented correctly
	// go func() {
	// 	swaggerJSON, err := docs.GenerateSwagger(routes)
	// 	if err != nil {
	// 		panic(err)
	// 	}

	// 	err = os.WriteFile("swagger.json", swaggerJSON, 0644)
	// 	if err != nil {
	// 		panic(err)
	// 	}
	// }()

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

				if w.Header().Get("Content-Type") == "" {
					w.Header().Set("Content-Type", "application/json")
				}
			} else {
				http.Error(w, "Method not implemented", http.StatusNotImplemented)
			}
		})
	}
}
