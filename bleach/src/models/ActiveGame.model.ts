export enum UserMode {
    DM = 'dm',
    PLAYER = 'player'
}

export interface ActiveGame {
    username: string
    userCount: number
}
