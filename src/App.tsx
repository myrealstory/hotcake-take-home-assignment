import { useEffect, useReducer } from "react";
import "./App.css";
import { initialState, reducer } from "./state/reducer";
import { BotManager } from "./components/BotManager";
import { OrderList } from "./components/OrderList";


function App() {
 const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(()=>{
    state.bots.forEach((bot) => {
      if(bot.status === 'IDLE' && state.pendingOrders.length > 0){
        const orderToProcess = state.pendingOrders[0];
        dispatch({ type: "BOT_PROCESS_ORDER", payload: { botId: bot.id, order: orderToProcess } });

        setTimeout(()=> {
          dispatch({ type: "ORDER_COMPLETE", payload: { botId: bot.id } }); 
        },10000);
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
      <div className="flex gap-8">
        <OrderList title={"Pending Orders"} orders={state.pendingOrders}/>
        <OrderList title={"Complete Orders"} orders={state.completeOrders}/>
      </div>
    </div>
  );
}

export default App;
