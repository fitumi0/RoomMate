package domain

type Entity interface {
	Validate() error
}
