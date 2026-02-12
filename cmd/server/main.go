package main

import (
	"flag"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/elastic/go-elasticsearch/v9"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/sirupsen/logrus"
	"go.elastic.co/ecslogrus"
	pg "gorm.io/driver/postgres"
	"gorm.io/gorm"

	app "roommate/internal/app/services"
	postgres "roommate/internal/infrastructure/postgres"
	presentation "roommate/internal/presentation/handlers"
	"roommate/lib"
)

func main() {
	hostname, _ := os.Hostname()

	envPort := os.Getenv(lib.SERVER_PORT)

	intEnvPort, _ := strconv.ParseInt(envPort, 10, 64)

	host := flag.String("host", "0.0.0.0", "Host to listen on")
	port := flag.Int("port", int(intEnvPort), "Port to listen on")
	flag.Parse()

	addr := fmt.Sprintf("%s:%d", *host, *port)

	es, _ := elasticsearch.NewDefaultClient()

	log := logrus.New()
	log.SetFormatter(&ecslogrus.Formatter{})

	log.Println(es.Info())

	r := chi.NewRouter()

	dsn := &lib.DSN{
		Host:     os.Getenv(lib.DB_HOST),
		Port:     os.Getenv(lib.DB_PORT),
		User:     os.Getenv(lib.DB_USER),
		Password: os.Getenv(lib.DB_PASSWORD),
		DBName:   os.Getenv(lib.DB_NAME),
	}

	db, err := gorm.Open(pg.Open(dsn.String()), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	// db.AutoMigrate(
	// 	&postgres.User{},
	// 	&postgres.{},
	// )

	userRepository := postgres.NewPostgresUserRepository(db)
	userService := app.NewUserService(userRepository)

	hallRepository := postgres.NewPostgresHallRepository(db)
	hallService := app.NewHallService(hallRepository)

	r.Use(middleware.Logger)
	r.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	r.Get("/user", presentation.NewUserHandler(userService).GetUser)
	r.Post("/user", presentation.NewUserHandler(userService).Register)
	r.Post("/hall", presentation.NewHallHandler(hallService).CreateHall)
	r.Get("/lobby", presentation.NewHallHandler(hallService).GetAllHalls) // TODO: add pagination

	apiRouter := chi.NewRouter()
	apiRouter.Mount("/api", r)
	apiRouter.Get("/ping", func(w http.ResponseWriter, r *http.Request) {
		log.WithTime(time.Now()).Info("ping called")
		w.Write([]byte("pong from " + hostname))
	})

	log.Info("Server listening on:", addr)
	http.ListenAndServe(addr, apiRouter)
}
