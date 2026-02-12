package lib

type DSN struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
}

func (dsn *DSN) String() string {
	return "host=" + dsn.Host + " port=" + dsn.Port + " user=" + dsn.User + " dbname=" + dsn.DBName + " password=" + dsn.Password
}
