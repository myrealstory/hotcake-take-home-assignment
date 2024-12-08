import { Order } from "../state/types";

interface Props {
    title: string;
    orders: Order[];
}

export const OrderList: React.FC<Props> = ({title, orders}) => {
    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold">{title}</h2>
            <ul className="mt-2 border-black/20 border border-solid w-full min-w-[210px] h-[20rem] p-4 rounded-xl bg-white">
                {orders.map((order) => (
                    <li key={order.id} className="flex items-center space-x-1">
                        <span>{order.id}</span>
                        <span>-</span>
                        <span>{order.type}</span>
                        <span>-</span>
                        <span>{order.status}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}