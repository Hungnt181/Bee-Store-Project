import OrderTable from "./_components/OrderTable";

export default function MyOrders() {
  return (
    <div className="bg-white p-3">
      <h1 className="uppercase font-bold text-2xl select-none text-gray-800">
        Đơn hàng
      </h1>
      <div className="mt-6">
        <OrderTable />
      </div>
    </div>
  );
}
