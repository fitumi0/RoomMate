rooms = {}


def join_room(user_id, room_id):
    if room_id not in rooms:
        rooms[room_id] = [user_id]
        return
    
    rooms[room_id].append(user_id)

def leave_room(user_id, room_id):
    room = rooms.get(room_id)
    if room is None:
        return
    
    if user_id not in room:
        return
    
    room.remove(user_id)
    
def close_room(room_id):
    del rooms[room_id]
    
    
def get_room_clients(room_id):
    if room_id not in rooms:
        return []
    
    return rooms[room_id]
    
    
def change_room_admin(new_admin_id, room_id):
    """
    Swaps the position of the first element (admin by default) in a room list with the element at the given index.
    Parameters:
        new_admin_id (int): The ID of the new admin.
        room_id (int): The ID of the room.
    Returns:
        None
    """
    
    if room_id not in rooms:
        return
    
    if new_admin_id not in rooms[room_id]:
        return

    room = rooms[room_id]
    new_admin_index = room.index(new_admin_id)
   
    room[0], room[new_admin_index] = room[new_admin_index], room[0]

    
    
if __name__ == "__main__":
    join_room("test", "test_room")
    join_room("test1", "test_room")
    join_room("test4", "test_room")
    join_room("test123", "test_room")
    join_room("test50", "test_room")

    print(rooms)
    
    change_room_admin("test50", "test_room")
    
    print(rooms)
    
    