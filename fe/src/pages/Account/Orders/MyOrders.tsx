import OrderTable from "./_components/OrderTable";

export default function MyOrders() {
  return (
    <div className="border border-gray-200 py-8 px-6">
      <h1 className="uppercase font-bold text-2xl select-none">Đơn hàng</h1>
      <div className="mt-4">
        <OrderTable />
      </div>
    </div>
  );
}
