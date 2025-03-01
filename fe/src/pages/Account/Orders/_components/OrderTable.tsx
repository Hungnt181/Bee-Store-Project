import { ColumnsType } from "antd/es/table";
import { Table } from "antd/lib";
import { Pagination, Space } from "antd";
import { fakeOrders } from "./fakeDataOrder";
import { DataType, orderColumns } from "./Columns";
export default function OrderTable() {
  const columns: ColumnsType<DataType> = orderColumns() || [];
  return (
    <>
      <Table
        rowKey="_id"
        bordered={true}
        columns={columns}
        dataSource={fakeOrders}
        pagination={false}
      />
      <Space className="-ml-5 mt-4 flex w-full justify-end">
        <Pagination
          pageSize={5}
          showSizeChanger={false}
          total={fakeOrders.length}
          current={1}
        />
      </Space>
    </>
  );
}
