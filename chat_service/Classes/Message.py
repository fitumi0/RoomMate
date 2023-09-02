import datetime

class Message:
    def __init__(self, sender, text) -> None:
        self.sender = sender
        self.text = text
        self.timestamp = datetime.datetime.now().timestamp() * 1000

    def get(self):
        return {
            "sender": self.sender,
            "timestamp": self.timestamp,
            "message": self.text 
        }