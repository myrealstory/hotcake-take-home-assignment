import { useEffect, useReducer, useState } from "react";
import "./App.css";
import { initialState, reducer } from "./state/reducer";
import { BotManager } from "./components/BotManager";
import { OrderList } from "./components/OrderList";
import { FaRobot } from "react-icons/fa";


function App() {
 const [state, dispatch] = useReducer(reducer, initialState);
 const [botPosition, setBotPosition]= useState<{ [key: number] : number}>({});

  useEffect(()=>{
    // 檢查所有的bot狀態我選用Foreach 主要是它不會回傳值，只是單純的執行
    // 當然也可以用 for of， 但如果未來需要中斷迴圈和其他的條件會截斷bot，才會考慮用 for of 或 filter
    // 如果bot的狀態是IDLE 且 pendingOrders 陣列中有訂單
    // 取出第一個訂單，並將其指派給該bot
    // 設定bot的位置為0
    // 設定一個interval，每秒更新bot的位置，直到bot移動到100
    state.bots.forEach((bot) => {
      if(bot.status === 'IDLE' && state.pendingOrders.length > 0){
        const orderToProcess = state.pendingOrders[0];
        dispatch({ type: "BOT_PROCESS_ORDER", payload: { botId: bot.id, order: orderToProcess } });

        if(botPosition[bot.id] === undefined){
          setBotPosition((prev) => {
            return {...prev, [bot.id]: 0};
          });
        }

        let currentPosition = 0;
        const interval = setInterval(() => {
          setBotPosition((prev) => {
            const newPosition = prev[bot.id] + 10;
            return {... prev, [bot.id]: newPosition};
          });

          currentPosition += 10;
          if(currentPosition >= 100){
            clearInterval(interval);
            setBotPosition((prev) => ({ ... prev, [bot.id]: 0}));
            dispatch({ type: "ORDER_COMPLETE", payload: { botId: bot.id } });
          }
        },1000);
      }
    });
  },[state.bots, state.pendingOrders, state.completeOrders]);

  return (
    <div className="box-content max-w-[1440px] w-full ">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => dispatch({ type: "ADD_ORDER", payload: { type: "NORMAL" } })}
        >
          New Normal Order
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={() => dispatch({ type: "ADD_ORDER", payload: { type: "VIP" } })}
        >
          New VIP Order
        </button>
      </div>
      <BotManager 
        bots={state.bots} 
        pendingOrders={state.pendingOrders}
        onAddBot={() => dispatch({ type: "ADD_BOT" })} 
        onRemoveBot={() => dispatch({ type: "REMOVE_BOT" })}
      />
      <div className="flex items-center">
        <OrderList title={"Pending Orders"} orders={state.pendingOrders}/>
        <div className="relative">
          {state.bots.map((bot) => bot.status !== "IDLE" ? (
            <FaRobot 
              className="text-2xl absolute -top-[10px] -z-10 bg-white"
              style={{transform:`translateX(${botPosition[bot.id]*0.64 || 0}px)`, color: bot.color}}
            />
          ): null)}
          {/* <FaRobot 
              className="text-2xl absolute -top-[10px] -z-10 bg-white"
              style={{transform:`translateX(64px)`, color: "black"}}
            /> */}
          <div className="h-2 w-16 border-4 border-black/70 relative -z-20"></div>
        </div>
        <OrderList title={"Complete Orders"} orders={state.completeOrders}/>
      </div>
    </div>
  );
}

export default App;
