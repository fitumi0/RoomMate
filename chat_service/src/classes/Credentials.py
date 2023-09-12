class Credentials:
    def __init__(self, username, password) -> None:
        self.username = username
        self.password = password

    def get(self):
        return {
            "username": self.username,
            "password": self.password
        }