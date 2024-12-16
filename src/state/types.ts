export interface Order {
    id: number;
    type: "NORMAL" | "VIP";
    status: "PENDING" | "COMPLETE";
}

export interface Bot {
    id: number;
    status: "IDLE" | "PROCESSING";
    currentOrder?: Order;
    color: string;
    // timer: number;
}

export interface State {
    pendingOrders: Order[];
    completeOrders: Order[];
    bots: Bot[];
    nextOrderId: number;
    nextBotId: number;
}

export type Action = 
| { type: "ADD_ORDER"; payload: { type: Order["type"]} }
| { type: "ADD_BOT" }
| { type: "REMOVE_BOT" }
| { type: "ORDER_COMPLETE"; payload: {botId: number}}
| { type: "BOT_PROCESS_ORDER"; payload: {botId: number; order: Order} };
