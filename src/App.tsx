import { useEffect, useState } from "react";
import "./App.css";

interface Order {
  id: number;
  type: "NORMAL" | "VIP";
  status: "PENDING" | "COMPLETE";
}

interface Bot {
  id: number;
  status: "IDLE" | "PROCESSING";
  currentOrder?: Order;
}

function App() {
  // Order 的狀態
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [completeOrders, setCompleteOrders] = useState<Order[]>([]);
  const [nextOrderId, setNextOrderId] = useState(1);

  // Bot 的狀態
  const [bots, setBots] = useState<Bot[]>([]);
  const [nextBotId, setNextBotId] = useState(1);

  useEffect(()=>{
    bots.forEach((bot) => {
      if(bot.status === 'IDLE' && pendingOrders.length > 0){
        const orderToProcess = pendingOrders[0];
        setPendingOrders((prev) => prev.slice(1));
        setBots((prev)=>
          prev.map((b)=>
            b.id === bot.id ? 
            {...b, status: 'PROCESSING', currentOrder: orderToProcess} : b  
          )  
        );

        setTimeout(()=> {
          setCompleteOrders((prev)=> [... prev, {... orderToProcess, status: 'COMPLETE'}]);
          setBots((prev)=>
            prev.map((b)=>
              b.id === bot.id ? 
              {...b, status: 'IDLE', currentOrder: undefined} : b  
            )  
          );
        },10000);
      }
    });
  },[bots, pendingOrders, completeOrders]);

  const handleAddOrder = (type: Order["type"]) => {
    const newOrder: Order = {
      id: nextOrderId,
      type,
      status: "PENDING",
    };
    setPendingOrders((prev) => {
      const vipOrder = prev.filter((order) => order.type === "VIP");
      const normalOrder = prev.filter((order) => order.type === "NORMAL");
      return type === "VIP"
        ? [...vipOrder, newOrder, ...normalOrder]
        : [...vipOrder, ...normalOrder, newOrder];
    });
    setNextOrderId(nextOrderId + 1);
  };

  const handleAddBot = () => {
    const newBot: Bot = { id: nextBotId, status: "IDLE" };
    setBots((prev) => [...prev, newBot]);
    setNextBotId(nextBotId + 1);
  };

  const handleRemoveBot = () => {
    setBots((prev) => {
      const botToRemove = prev[prev.length - 1];
      if (botToRemove && botToRemove.currentOrder) {
        setPendingOrders((prevOrders) => [
          botToRemove.currentOrder!,
          ...prevOrders,
        ]);
      }
      return prev.slice(0, -1);
    });
  };

  return (
    <div className="box-content max-w-[1440px] w-full ">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => handleAddOrder("NORMAL")}
        >
          New Normal Order
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={() => handleAddOrder("VIP")}
        >
          New VIP Order
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleAddBot}
        >
          + Bot
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleRemoveBot}
        >
          - Bot
        </button>
      </div>
      <div className="flex items-center">
        {/* Pending Area */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-2">Pending Orders</h2>
          <ul className="bg-white p-4 shadow rounded h-[300px] ">
            {pendingOrders.map((order) => (
              <li key={order.id} className="border-b py-2 list-none">
                Order #{order.id} ({order.type})
              </li>
            ))}
          </ul>
        </div>
        <div className="relative w-[40px] border-solid border-2 border-black/40 h-1">
        </div>
        {/* Complete Area */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-2">Complete Orders</h2>
          <ul className="bg-white p-4 shadow rounded h-[300px]">
            {completeOrders.map((order) => (
              <li key={order.id} className="border-b py-2 list-none">
                Order #{order.id} ({order.type})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
