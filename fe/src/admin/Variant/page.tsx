/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Image,
  message,
  Popconfirm,
  Skeleton,
  Space,
  Table,
  Tag,
} from "antd";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "../../assets/Css/Admin/Product/page.css";
import Variant from "../../interface/Variant";

const AdminVariantList = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  console.log("id: " + id);
  console.log("Type of id:", typeof id);
  const { data, isLoading } = useQuery({
    queryKey: ["variants", id],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/variants/product/${id}`
        );
        console.log(data);

        return data.variants.map((item: Variant) => ({
          ...item,
          key: item._id,
        }));
      } catch (error) {
        return console.log(error);
      }
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      await axios.patch(`http://localhost:3000/api/products/status/${id}`);
    },
    onSuccess: () => {
      message.success("Cập nhật trạng thái sản phẩm thành công");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (text: string, _: any) => {
        return <Image src={text} width={50} height={50}></Image>;
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "id_product",
      key: "id_product",
      render: (object: any, _: any) => {
        return <h3>{object.name}</h3>;
      },
    },
    {
      title: "Kích cỡ",
      dataIndex: "id_size",
      key: "id_size",
      render: (object: any, _: any) => {
        return <h3>{object.name}</h3>;
      },
    },
    {
      title: "Màu sắc",
      dataIndex: "id_color",
      key: "id_color",
      render: (object: any, _: any) => {
        return <h3>{object.name}</h3>;
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
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (_: any, item: Variant) => {
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
              <Button danger style={{ minWidth: "80px" }}>
                {item.status ? "Ẩn" : "Mở bán"}
              </Button>
            </Popconfirm>

            <Link to={`/variant/${item._id}/edit`}>
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

export default AdminVariantList;
