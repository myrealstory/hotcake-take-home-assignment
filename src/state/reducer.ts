import { State, Action } from "./types";

export const initialState: State = {
    pendingOrders: [],
    completeOrders: [],
    bots: [],
    nextOrderId: 1,
    nextBotId: 1,
};

const randomColor = ():string => {
    const colors = [
        '#FF5733', '#33FF57', '#5733FF', '#33A1FF', '#FFC133',
        '#FF33A1', '#A133FF', '#33FFEB', '#FF3380', '#3380FF',
        '#E6FF33', '#FF5733', '#33FF57', '#5733FF', '#33A1FF',
        '#FFC133', '#FF33A1', '#A133FF', '#33FFEB', '#FF3380'
    ];

    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

export const reducer = (state:State, action: Action): State => {
    switch(action.type){
        // 創建 一個新訂單物件，帶有唯一的id，type(normal or vip), 以及status 預設為pending
        // 將新訂單插入 pendingOrders 中， 
        // 如果是 VIP訂單，插入到所有普通訂單前面，但保持VIP訂單之間的順序
        // 如果是普通訂單，插入隊列最後。
            // 訂單隊列的順序符合要求： VIP 訂單在前， NORMAL 訂單在後
            // 每個訂單的 id 是唯一的，並且不需要重複計算順序，保持邏輯簡潔
        case "ADD_ORDER": {
            const newOrder = {
                id: state.nextOrderId,
                type: action.payload.type,
                status: "PENDING" as const,
            };
            const vipOrders = state.pendingOrders.filter(order => order.type === "VIP");
            const normalOrders = state.pendingOrders.filter( order => order.type === "NORMAL");
            return {
                ...state,
                pendingOrders:
                    action.payload.type === "VIP"
                    ? [...vipOrders, newOrder, ...normalOrders]
                    : [...vipOrders, ...normalOrders, newOrder],
                nextOrderId: state.nextOrderId + 1,
            }
        }
        // 當新增一個BOT時：
            // 創建一個新BOT，設定初始狀態為IDLE
            //  將新BOT添加到 bots 陣列
            //  更新 nextBotId 確保下次新增的 Bot 有唯一的id
                //   確保 Bot 的數量可以動態增加，每個新增的 bot 都有唯一的id，並初始處於IDLE狀態
        case "ADD_BOT": {

            const newBot = { id: state.nextBotId, status: "IDLE" as const, color: randomColor() };
            return {
                ... state,
                bots: [...state.bots, newBot],
                nextBotId: state.nextBotId + 1,
            }
        }
        // 當刪除一個 bot 時：
         //  獲取最新的 bot （陣列的最後一個）
         //  如果該 bot 正在處理訂單，將其訂單返回到 pendingOrders 陣列最前面
         //  移除該 bot （去掉陣列中的最後一個元素）
         // currentOrder 會在 BOT_PROCESS_ORDER 和 ORDER_COMPLETE 時更新
        case "REMOVE_BOT": {
            const botRemove = state.bots[state.bots.length - 1];
            const pendingOrders = botRemove?.currentOrder ?
                [...state.pendingOrders, botRemove.currentOrder] : state.pendingOrders;
            return {
                ...state,
                pendingOrders,
                bots: state.bots.slice(0, -1),
            }
        }
        //當一個 Bot 開始處理訂單時：
          // 從 pendingOrders 中取出第一個訂單
          // 將該訂單設置為 bot 的 currentOrder， 並將 bot 狀態更新為 processing
          // pendingOrders 中的訂單狀態 和 bot 的狀態能保持同步
          // bot 在處理訂單時的行為獨立，不影響其他 bot
        case "BOT_PROCESS_ORDER": {
            const { botId, order} = action.payload;
            return {
                ...state,
                pendingOrders: state.pendingOrders.filter(o => o.id !== order.id),
                bots: state.bots.map(bot =>
                    bot.id === botId ? 
                    {...bot, status: "PROCESSING", currentOrder: order} : bot
                )
            }
        }
        // 當 bot 完成一個訂單時：
        // 將該訂單從 currentOrder 添加到 completeOrders 
        // 將該 bot 的狀態重置為 IDLE，並清空 currentOrder
          // 已完成的訂單正確地移到 completeOrders， 不會遺漏
          // bot 的狀態能正確重置， 為處理新的訂單做好準備
        case "ORDER_COMPLETE": {
            const {botId} = action.payload;
            const bot = state.bots.find(bots => bots.id === botId);
            return {
                ...state,
                completeOrders: bot?.currentOrder
                    ? [...state.completeOrders, {...bot.currentOrder, status: "COMPLETE"}]
                    : state.completeOrders,
                bots: state.bots.map(bot =>
                    bot.id === botId ? {...bot, status: "IDLE", currentOrder: undefined} : bot
                )
            }
        }
        default: 
            return state;
    }
}