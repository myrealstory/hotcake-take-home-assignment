import { Order } from "../state/types";

interface Props {
    title: string;
    orders: Order[];
}

export const OrderList: React.FC<Props> = ({title, orders}) => {
    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold">{title}</h2>
            <ul className="mt-2">
                {orders.map((order) => (
                    <li key={order.id} className="flex items-center space-x-4">
                        <span>{order.id}</span>
                        <span> - </span>
                        <span>{order.type}</span>
                        <span> - </span>
                        <span>{order.status}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}