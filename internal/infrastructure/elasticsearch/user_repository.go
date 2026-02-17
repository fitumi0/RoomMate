package user

import "github.com/elastic/go-elasticsearch/v9"

// TODO: изучить эластик и реализовать

type UserRepository struct {
	es *elasticsearch.Client
}

func NewElasticsearchUserRepository(es *elasticsearch.Client) *UserRepository {
	return &UserRepository{es: es}
}
