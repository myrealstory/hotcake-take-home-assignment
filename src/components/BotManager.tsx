import { Bot, Order } from "../state/types";
import { FaRobot } from "react-icons/fa";

interface BotManagerProps {
    bots: Bot[];
    pendingOrders: Order[];
    onAddBot: ()=> void;
    onRemoveBot: ()=> void;
}

export const BotManager: React.FC<BotManagerProps> = ({bots, pendingOrders, onAddBot, onRemoveBot}) => {

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Bot Manager</h2>
            <div className="grid grid-cols-2 gap-4 mb-4 w-full">
                <button 
                    className={`px-4 py-2 ${pendingOrders.length > 0 ? "bg-color-9 text-white":"bg-black/20 text-black/60 cursor-auto"} rounded`} 
                    onClick={onAddBot}
                    disabled={pendingOrders.length === 0}
                >
                    Add Bot
                </button>
                <button 
                    className={`px-4 py-2 ${bots.length > 0 ? "bg-color-16 text-white":"bg-black/20 text-black/60 cursor-auto"}  rounded`} 
                    onClick={onRemoveBot}
                    disabled={bots.length === 0}
                >
                    Remove Bot
                </button>
            </div>
            <div className="flex flex-col items-center my-4">
                <h3 className="text-xl font-bold">Bot List</h3>
                <ul className="mt-2">
                    {bots.map((bot) => (
                        <li key={bot.id} className="flex items-center space-x-4">
                            <FaRobot className={`text-base`} style={{color: bot.color}}/>
                            <span>{bot.id}</span>
                            <span> - </span>
                            <span>{bot.status}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}