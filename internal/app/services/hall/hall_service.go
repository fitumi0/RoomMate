package hall

import "github.com/sirupsen/logrus"

type HallService struct {
	hallRepo      HallRepository
	hallStateRepo HallStateRepository
}

func NewHallService(repo HallRepository, hallStateRepo HallStateRepository, l *logrus.Logger) *HallService {
	return &HallService{hallRepo: repo, hallStateRepo: hallStateRepo}
}
