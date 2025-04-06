package types

type Resolution struct {
	Width  int
	Height int
}

type VideoInfo struct {
	Width           int
	Height          int
	DurationSeconds float64
	BitrateKbit     int
}
