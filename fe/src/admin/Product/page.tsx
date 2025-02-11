/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Modal,
  Popconfirm,
  Popover,
  Skeleton,
  Space,
  Table,
  Tag,
} from "antd";
import {Product} from "../../interface/Product";
import { Link, useNavigate } from "react-router-dom";
import { MoreOutlined } from "@ant-design/icons";
import useGetAll from "../hooks/useGetAll";
import useDelete from "../hooks/useDelete";
import { useState } from "react";
import AdminProductAdd from "./Add/page";
import dayjs from "dayjs";
const AdminProductList = () => {
  //   const queryClient = useQueryClient();
  const navigate = useNavigate();
  // const { data, isLoading } = useQuery({
  //   queryKey: ["products"],
  //   queryFn: async () => {
  //     try {
  //       const { data } = await axios.get(
  //         `http://localhost:3000/api/products?_embed=id_cate`
  //       );
  //       return data.products.map((item: Product) => ({
  //         ...item,
  //         key: item._id,
  //       }));
  //     } catch (error) {
  //       return console.log(error);
  //     }
  //   },
  // });

  const url = `http://localhost:3000/api/products?_embed=id_cate`;
  const key = "products";

  const { data, isLoading } = useGetAll<Product>(url, key);

  // const { mutate } = useMutation({
  //   mutationFn: async (id: object) => {
  //     await axios.patch(`http://localhost:3000/api/products/status/${id}`);
  //   },
  //   onSuccess: () => {
  //     message.success("Cập nhật trạng thái sản phẩm thành công");
  //     queryClient.invalidateQueries({
  //       queryKey: ["products"],
  //     });
  //   },
  // });
  const urlDelete = "http://localhost:3000/api/products/status/";
  const { mutate } = useDelete(urlDelete, key);

  const handleSearchVariant = (id: any) => {
    navigate(`/admin/${id}/variant`);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, item: any, index: number) => {
        return index + 1;
      },
    },
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_: any, item: Product) => {
        return item.status ? (
          <Tag color="green">Mở bán</Tag>
        ) : (
          <Tag color="red">Dừng bán</Tag>
        );
      },
    },
    {
      title: "Danh mục",
      dataIndex: "id_cate",
      key: "id_cate",
      render: (object: any) => {
        return <p>{object.name}</p>;
      },
    },
    {
      title: "Ngày sửa cuối",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value: Date) => {
        return dayjs(value).format("DD/MM/YYYY HH:mm:ss");
      },
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_: any, item: Product) => {
        const content = (
          <div>
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
                  {item.status ? "Dừng bán" : "Mở bán"}
                </Button>
              </Popconfirm>

              <Link to={`/admin/product/${item._id}/edit`}>
                <Button type="primary">Sửa</Button>
              </Link>
            </Space>
          </div>
        );
        return (
          <Space>
            <Link to={`/admin/${item._id}/variant`}>
              <Button type="primary">Xem chi tiết</Button>
            </Link>

            <Popover content={content} title="Chức năng" trigger="click">
              <Button>
                <MoreOutlined />
              </Button>
            </Popover>
          </Space>
        );
      },
    },
  ];

  // add new product

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <Skeleton loading={isLoading}>
        <Button
          type="primary"
          style={{ marginBottom: "4px" }}
          onClick={showModal}
        >
          Thêm mới sản phẩm
        </Button>

        <Table
          dataSource={data}
          columns={columns}
          pagination={{ pageSize: 6 }}
        />

        <Modal
          title="Thêm mới sản phẩm"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <AdminProductAdd />
        </Modal>
      </Skeleton>
    </div>
  );
};

export default AdminProductList;
