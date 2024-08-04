export declare enum MessageType {
    USER = "user",
    SYSTEM = "system"
}
export declare enum SystemMessageType {
    INFO = "info",
    WARNING = "warning",
    ERROR = "error"
}
export interface BaseMessage {
    id: string;
    timestamp: Date;
    type: MessageType.SYSTEM | MessageType.USER;
}
export interface SystemMessage extends BaseMessage {
    type: MessageType.SYSTEM;
    systemType: SystemMessageType;
    content: string;
}
export interface UserMessage extends BaseMessage {
    type: MessageType.USER;
    userId: string;
    content: string;
}
//# sourceMappingURL=Messages.d.ts.map