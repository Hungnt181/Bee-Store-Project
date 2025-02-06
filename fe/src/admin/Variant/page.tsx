/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Image,
  Modal,
  Popconfirm,
  Popover,
  Skeleton,
  Space,
  Table,
  Tag,
} from "antd";
import { Link, useParams } from "react-router-dom";
import "../../assets/Css/Admin/Product/page.css";
import Variant from "../../interface/Variant";
import { MoreOutlined } from "@ant-design/icons";
import useGetDetail from "../hooks/useGetDetail";
import useDelete from "../hooks/useDelete";
import { useState } from "react";
import AdminVariantAdd from "./Add/page";

const AdminVariantList = () => {
  const { id } = useParams();

  const safeId = id || "";
  const url = `http://localhost:3000/api/variants/product/${id}`;
  const key = "variants";
  const { data, isLoading } = useGetDetail<Variant>(url, key, safeId);

  const urlDelete = "http://localhost:3000/api/variants/status/";
  const { mutate } = useDelete(urlDelete, key);

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (text: string) => {
        return <Image src={text} width={50} height={50}></Image>;
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "id_product",
      key: "id_product",
      render: (object: any) => {
        return <h3>{object.name}</h3>;
      },
    },
    {
      title: "Kích cỡ",
      dataIndex: "id_size",
      key: "id_size",
      render: (object: any) => {
        return <p>{object.name}</p>;
      },
    },
    {
      title: "Màu sắc",
      dataIndex: "id_color",
      key: "id_color",
      render: (object: any) => {
        return (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={{ minWidth: "40px" }}>{object?.name}</p>
              <div
                style={{
                  marginLeft: "5px",
                  backgroundColor: object?.hexcode,
                  width: "20px",
                  height: "20px",
                  border:
                    object?.hexcode == "#ffffff" ? "1px solid gray" : "none",
                }}
              ></div>
            </div>
          </>
        );
      },
    },
    {
      title: "Giới thiệu",
      dataIndex: "id_product",
      key: "id_product",
      ellipsis: true,
      render: (object: any) => {
        return <p>{object.about}</p>;
      },
    },
    {
      title: "Mô tả",
      dataIndex: "id_product",
      key: "id_product",
      ellipsis: true,
      render: (object: any) => {
        return <p>{object.description}</p>;
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_: any, item: Variant) => {
        if (item.status) {
          if (item.quantity < 1) {
            return (
              <div>
                <Tag color="green">Mở bán</Tag>
                <Tag color="red">Hết hàng</Tag>
              </div>
            );
          }
          return <Tag color="green">Mở bán</Tag>;
        }
        if (!item.status) {
          if (item.quantity < 1) {
            return (
              <div>
                <Tag color="red">Dừng bán</Tag>
                <Tag color="red">Hết hàng</Tag>
              </div>
            );
          }
          return <Tag color="red">Dừng bán</Tag>;
        }
      },
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_: any, item: Variant) => {
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [modalId, setModalId] = useState<object | null>(null);
  const showModal = () => {
    setIsModalOpen(true);
    // setModalId(id);
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
        <Button type="primary" onClick={showModal}>
          Thêm biển thể mới
        </Button>
        <Table
          dataSource={data}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title="Basic Modal"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <AdminVariantAdd />
        </Modal>
      </Skeleton>
    </div>
  );
};

export default AdminVariantList;
