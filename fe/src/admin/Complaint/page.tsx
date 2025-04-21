import { useQuery } from "@tanstack/react-query";
import { Button, Pagination, Skeleton, Table, Tooltip, Typography } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Complaint } from "../../interface/Complaint";
import { TableProps } from "antd/lib";
const { Text } = Typography;
const ComplaintPage = () => {
  // const { data, isLoading } = useGetAll<Product>(url, key);
  const [dataTable, setDataTable] = useState<Complaint[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [curentPages, setCurentPages] = useState(1);
  const pageSize = 10;
  const url = `http://localhost:3000/api/complaint?_page=${curentPages}&_limit=${pageSize}`;

  const { data: dataPage, isLoading } = useQuery({
    queryKey: ["dataPage", curentPages],
    queryFn: async () => {
      const response = await axios.get(url);
      return response.data;
    },
  });
  useEffect(() => {
    if (dataPage) {
      setTotalPages(dataPage.totalPages);
      setCurentPages(dataPage.page);
      setDataTable(dataPage.complaints);
    }
  }, [dataPage]);

  const columns: TableProps<Complaint>["columns"] = [
    {
      title: "Tên khách hàng",
      dataIndex: "name",
      key: "name",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 300,
    },

    {
      title: "Nội dung khiếu nại",
      dataIndex: "description",
      key: "description",
      width: 300,
      render: (text: string) => {
        const shortText = text.length > 200 ? text.slice(0, 200) + "..." : text;
        return <Tooltip title={text}>{shortText}</Tooltip>;
      },
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "id_order",
      key: "id_order",
      width: 150,
      render: (text: string) => {
        return <Text copyable>{text}</Text>;
      },
    },
    {
      title: "Mã khách hàng",
      dataIndex: "id_user",
      key: "id_user",
      width: 150,
      render: (text: string) => {
        return <Text copyable>{text}</Text>;
      },
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_: unknown, item: Complaint) => {
        return (
          <div>
            <Link to={`/admin/order/${item?.id_order}`}>
              <Button type="primary">Chi tiết đơn hàng</Button>
            </Link>
          </div>
        );
      },
    },
  ];
  // Thay đổi trang
  const handlePageChange = (page: number) => {
    setCurentPages(page);
  };

  return (
    <Skeleton loading={isLoading}>
      <h1 className="mb-1.5 text-2xl font-medium">DANH SÁCH KHIẾU NẠI </h1>
      <Table
        dataSource={dataTable}
        columns={columns}
        pagination={false}
        scroll={{ y: 55 * 8 }}
      />
      <Pagination
        current={curentPages}
        total={totalPages * pageSize}
        pageSize={pageSize}
        onChange={handlePageChange}
        style={{ marginTop: 20, textAlign: "center" }}
      ></Pagination>
    </Skeleton>
  );
};

export default ComplaintPage;
