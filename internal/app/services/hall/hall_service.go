package hall

type HallService struct {
	repo HallRepository
}

func NewHallService(repo HallRepository) *HallService {
	return &HallService{repo: repo}
}
