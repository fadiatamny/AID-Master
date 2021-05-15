# Game Service

This is a game service written in Node.TS with usage of Socket.IO.

The service is responsible for handling messages between participants in game sessions and handling game session dumps.

### The events and emits

#### Ons are: 
- createRoom | username: string | creates a room - returns roomCreated
- joinRoom | id: string, username: string | joins a room - emits joinedRoom if successful or error if not
- sendMessage | id: string, username: string, message: string, target?: string | sends a messsage in the room id - emits message
- sendSenario | id: string, username: string, scenario: string | sends senario in room id and generates prediction - emits both scenario and scenarioGuide

#### Emits are : 
- connected | { message: string } | someone joined the room
- roomCreated | id: string, mode: UserMode | created a room with this id
- roomJoined | username: string, , mode: UserMode | username joined the room
- message | username: string, message: string, target: string | a message sent by username, if target is not undefined then there is a target
- scenario | username: string, message: string | a new scenario has been sent
- scenarioGuide | username: string, data: string, theme: string | scenario guide generated from the model
- error | username: string, error: {message: '', error?: Object} | error occured