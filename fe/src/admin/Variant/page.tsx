/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  Image,
  Modal,
  Popconfirm,
  Popover,
  Skeleton,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { Link, useParams } from "react-router-dom";
import "../../assets/Css/Admin/Product/page.css";
import { Variant } from "../../interface/Variant";
import { MoreOutlined } from "@ant-design/icons";
import useGetDetail from "../hooks/useGetDetail";
import useDelete from "../hooks/useDelete";
import { useState } from "react";
import AdminVariantAdd from "./Add/page";
import "../../assets/Css/Admin/Product/page.css";
import "../../assets/Css/Admin/variant/page.css";
import useGetDetailNotArray from "../hooks/useGetDetailNotArray";
import dayjs from "dayjs";
import Size from "../../interface/Size";

const AdminVariantList = () => {
  const { id } = useParams();
  const safeId = id || "";
  const url = `http://localhost:3000/api/variants/product/${id}`;
  const key = "variants";
  const { data, isLoading } = useGetDetail<Variant>(url, key, safeId);

  const urlDtPro = `http://localhost:3000/api/products/${id}`;
  const keyDtPro = "ProductDetail";
  const ProDtId = String(id);
  const { data: DataDtPro } = useGetDetailNotArray(urlDtPro, keyDtPro, ProDtId);
  // console.log("DataDtPro", DataDtPro);

  const urlDelete = "http://localhost:3000/api/variants/status/";
  const { mutate } = useDelete(urlDelete, key);

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => {
        return index + 1;
      },
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (text: string) => {
        return <Image src={text[0]} width={50} height={50}></Image>;
      },
    },
    {
      title: "Kích cỡ",
      dataIndex: "id_size",
      key: "id_size",
      render: (object: Size) => {
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
                title="Cập nhật trạng thái"
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

              <Link to={`/admin/variant/${item._id}/edit`}>
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
        <Card
          title="Thông tin sản phẩm"
          style={{ width: 600 }}
          className="card_inf_product"
        >
          <div className="inf_product_div">
            <p className="title_p">Tên sản phẩm:</p>{" "}
            <p style={{ color: "red" }} className="content_p">
              {DataDtPro?.name}
            </p>
          </div>
          <div className="inf_product_div">
            <p className="title_p">Giới thiệu :</p>
            <Tooltip
              title={DataDtPro?.about}
              placement="bottom"
              overlayStyle={{
                maxWidth: "500px",
                whiteSpace: "normal",
                wordWrap: "break-word",
              }}
            >
              <p className="content_p">{DataDtPro?.about}</p>
            </Tooltip>
          </div>
          <div className="inf_product_div">
            <p className="title_p">Mô tả :</p>
            <Tooltip
              title={DataDtPro?.description}
              placement="bottom"
              overlayStyle={{
                maxWidth: "500px",
                whiteSpace: "normal",
                wordWrap: "break-word",
              }}
            >
              <p className="content_p">{DataDtPro?.description}</p>
            </Tooltip>
          </div>
          <div className="inf_product_div">
            <p className="title_p">Giá:</p>
            <p className="content_p">{DataDtPro?.price}</p>
          </div>
          <div className="inf_product_div">
            <p className="title_p">Danh mục :</p>
            <p className="content_p">{DataDtPro?.id_cate?.name}</p>
          </div>
          <div className="inf_product_div">
            <p className="title_p">Trạng thái :</p>
            <p className="content_p">
              {DataDtPro?.status ? (
                <Tag color="green">Mở bán</Tag>
              ) : (
                <Tag color="red">Dừng bán</Tag>
              )}
            </p>
          </div>
          <div className="inf_product_div">
            <p className="title_p">Ngày sửa cuối :</p>
            <p className="content_p">
              {dayjs(DataDtPro?.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
            </p>
          </div>
        </Card>

        <div>
          <Button type="primary" onClick={showModal}>
            Thêm biển thể mới
          </Button>

          <h3 className="mt-4">Thông tin biến thể</h3>

          <Table
            dataSource={data}
            columns={columns}
            pagination={{ pageSize: 5 }}
            scroll={{ y: 55 * 3 }}
          />
        </div>
        <Modal
          title="Thêm mới biến thể"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <AdminVariantAdd dataDtPro={DataDtPro} />
        </Modal>
      </Skeleton>
    </div>
  );
};

export default AdminVariantList;
