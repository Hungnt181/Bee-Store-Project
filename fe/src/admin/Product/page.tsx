/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Popconfirm, Skeleton, Space, Table, Tag } from "antd";
import axios from "axios";
import Product from "../../interface/Product";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/Css/Admin/Product/page.css";

const AdminProductList = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/products?_embed=id_cate`
        );
        return data.products.map((item: Product) => ({
          ...item,
          key: item._id,
        }));
      } catch (error) {
        return console.log(error);
      }
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (id: object) => {
      await axios.patch(`http://localhost:3000/api/products/status/${id}`);
    },
    onSuccess: () => {
      message.success("Cập nhật trạng thái sản phẩm thành công");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  const handleSearchVariant = (id: any) => {
    navigate(`/admin/${id}/variant`);
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (_: any, item: any) => {
        return (
          <h3
            onClick={() => handleSearchVariant(item._id)}
            style={{ cursor: "pointer" }}
          >
            {item.name}
          </h3>
        );
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Giới thiệu",
      dataIndex: "about",
      key: "about",
      ellipsis: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_: any, item: Product) => {
        return item.status ? (
          <Tag color="green" className="status-tag">
            Mở bán
          </Tag>
        ) : (
          <Tag color="red" className="status-tag">
            Ẩn
          </Tag>
        );
      },
    },
    {
      title: "Danh mục",
      dataIndex: "id_cate",
      key: "id_cate",
      render: (object: any) => {
        return <h3>{object.name}</h3>;
      },
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (_: any, item: Product) => {
        return (
          <Space>
            <Popconfirm
              title="Update status of product"
              description="Bạn muốn cập nhật trạng thái sản phẩm không ?"
              onConfirm={() => {
                mutate(item._id);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button danger style={{ minWidth: "60px", padding: "5px" }}>
                {item.status ? "Ẩn" : "Mở bán"}
              </Button>
            </Popconfirm>

            <Link to={`/admin/product/${item._id}/edit`}>
              <Button type="primary">Sửa</Button>
            </Link>
          </Space>
        );
      },
    },
  ];
  return (
    <div>
      <Skeleton loading={isLoading}>
        <Table
          dataSource={data}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Skeleton>
    </div>
  );
};

export default AdminProductList;
