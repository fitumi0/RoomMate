package hall

import "github.com/sirupsen/logrus"

type HallService struct {
	repo HallRepository
}

func NewHallService(repo HallRepository, l *logrus.Logger) *HallService {
	return &HallService{repo: repo}
}
