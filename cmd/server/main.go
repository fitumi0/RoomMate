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
	redis_client "github.com/redis/go-redis/v9"
	"github.com/sirupsen/logrus"

	"go.elastic.co/ecslogrus"
	pg "gorm.io/driver/postgres"
	"gorm.io/gorm"

	"roommate/cmd"
	"roommate/internal/infrastructure/postgres"
	"roommate/internal/infrastructure/redis"

	hall_app "roommate/internal/app/services/hall"
	hall_handler "roommate/internal/presentation/handlers/hall"

	user_app "roommate/internal/app/services/user"
	user_handler "roommate/internal/presentation/handlers/user"
)

func main() {
	hostname, _ := os.Hostname()

	envPort := os.Getenv(cmd.SERVER_PORT)

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

	dsn := &cmd.DSN{
		Host:     os.Getenv(cmd.DB_HOST),
		Port:     os.Getenv(cmd.DB_PORT),
		User:     os.Getenv(cmd.DB_USER),
		Password: os.Getenv(cmd.DB_PASSWORD),
		DBName:   os.Getenv(cmd.DB_NAME),
	}

	db, err := gorm.Open(pg.Open(dsn.String()), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	rdb := redis_client.NewClient(&redis_client.Options{
		Addr:     fmt.Sprintf("%s:%s", os.Getenv(cmd.REDIS_HOST), os.Getenv(cmd.REDIS_PORT)),
		Password: os.Getenv(cmd.REDIS_PASSWORD),
		DB:       0, // use default DB
	})
	defer rdb.Close()

	userRepository := postgres.NewPostgresUserRepository(db)
	userService := user_app.NewUserService(userRepository)

	hallRepository := postgres.NewPostgresHallRepository(db)
	hallStateRepository := redis.NewRedisHallStateRepository(rdb)
	hallService := hall_app.NewHallService(hallRepository, hallStateRepository, log)

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

	r.Get("/user", user_handler.NewUserHandler(userService).GetUser)
	r.Post("/user", user_handler.NewUserHandler(userService).Register)
	r.Post("/hall", hall_handler.NewHallHandler(hallService, log).CreateHall)
	r.Get("/lobby", hall_handler.NewHallHandler(hallService, log).GetHalls) // TODO: add pagination

	apiRouter := chi.NewRouter()
	apiRouter.Mount("/api", r)
	apiRouter.Get("/ping", func(w http.ResponseWriter, r *http.Request) {
		log.WithTime(time.Now()).Info("ping called")
		w.Write([]byte("pong from " + hostname))
	})

	log.Info("Server listening on:", addr)
	http.ListenAndServe(addr, apiRouter)
}
