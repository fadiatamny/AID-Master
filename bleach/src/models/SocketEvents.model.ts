enum EventsSocketRecieves {
    HI = 'hi',
    CONNECTED = 'connected',
    CREATE_ROOM = 'create_room',
    JOIN_ROOM = 'join_room',
    SEND_MESSAGE = 'send_message',
    SEND_SCENARIO = 'send_scenario',
    LEAVE_ROOM = 'leave_room',
    NEW_PLAYER_REGISTER = 'new_player_register'
}

enum EventsSocketSends {
    HELLO = 'hello',
    ROOM_CREATED = 'room_created',
    DM_CHANGED = 'dm_changed',
    PLAYER_DATA = 'player_data',
    ROOM_JOINED = 'room_joined',
    MESSAGE = 'message',
    SCENARIO = 'scenario',
    SCENARIO_GUIDE = 'scenario_guide',
    ERROR = 'error',
    PLAYER_LEFT = 'player_left',
    PLAYER_JOINED = 'player_joined',
    NEW_PLAYER = 'new_player'
}

export const SocketEvents = { ...EventsSocketSends, ...EventsSocketRecieves }
