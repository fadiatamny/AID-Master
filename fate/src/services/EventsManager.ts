interface Action {
    component: string
    handler: Function
}

class Event {
    public type: EventType
    public actions: Action[]

    constructor(type: EventType) {
        this.type = type
        this.actions = []
    }

    private _exists(component: string) {
        return this.actions.find((e) => e.component === component)
    }

    public add(component: string, handler: Function) {
        if (this._exists(component)) {
            return
        }
        this.actions.push({ component, handler })
    }

    public remove(component: string) {
        this.actions = this.actions.filter((a) => a.component !== component)
    }

    public trigger(event: unknown) {
        this.actions.map((a) => a.handler(event))
    }
}

export default class EventsManager {
    private static _instance: EventsManager

    public static get instance() {
        if (!EventsManager._instance) {
            EventsManager._instance = new EventsManager()
        }
        return EventsManager._instance
    }

    private _events: Record<string, Event> = {}

    public on(type: EventType, component: string, handler: Function) {
        if (!this._events[type]) {
            this._events[type] = new Event(type)
        }

        this._events[type].add(component, handler)
    }

    public off(type: EventType, component: string) {
        if (!this._events[type]) {
            return
        }

        this._events[type].remove(component)
    }

    public trigger(type: EventType, event: unknown) {
        if (!this._events[type]) {
            return
        }
        this._events[type].trigger(event)
    }
}

export type EventType = PlatformEvent | SocketEvent

export enum SocketEvent {
    HI = 'hi',
    HELLO = 'hello',
    CONNECTED = 'connected',
    MESSAGE = 'message',
    CONNECT = 'connect',
    ROOMCREATED = 'roomcreated',
    CREATEROOM = 'createroom',
    ROOMJOINED = 'roomjoined',
    DMCHANGED = 'dmchanged',
    PLAYERDATA = 'playerdata',
    SCENARIO = 'scenario',
    SCENARIOGUIDE = 'scenatioguide',
    ERROR = 'error',
    JOINROOM = 'joinroom',
    SENDMESSAGE = 'sendmessage',
    LEAVEROOM = 'leaveroom',
    SENDSENARIO = 'sendSenario',
    MESSAGESENT = 'messagesent',
    SENARIOSENT = 'senariosent',
    ROOMLEAVED = 'roomleaved',
    SEND_MESSAGE = 'send_message',
    SEND_SCENARIO = 'send_scenario'
}

export enum PlatformEvent {}
