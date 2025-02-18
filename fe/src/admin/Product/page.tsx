/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Popover,
  Skeleton,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import Product from "../../interface/Product";
import { Link, useNavigate } from "react-router-dom";
import {
  MoreOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
// import useGetAll from "../hooks/useGetAll";
import useDelete from "../hooks/useDelete";
import { useEffect, useState } from "react";
import AdminProductAdd from "./Add/page";
import dayjs from "dayjs";
import { Category } from "../../interface/Category";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const AdminProductList = () => {
  const navigate = useNavigate();
  // const { data, isLoading } = useGetAll<Product>(url, key);
  const [dataTable, setDataTable] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [curentPages, setCurentPages] = useState(1);
  const pageSize = 10;
  const url = `http://localhost:3000/api/products?_page=${curentPages}&_limit=${pageSize}&_embed=id_cate`;
  const key = "products";

  const { data: dataPage, isLoading } = useQuery({
    queryKey: ["dataPage", curentPages],
    queryFn: async () => {
      const response = await axios.get(url);
      return response.data;
    },
  });

  useEffect(() => {
    if (dataPage) {
      console.log({ dataPage });
      setTotalPages(dataPage.totalPages);
      setCurentPages(dataPage.page);
      setDataTable(dataPage.products);
    }
  }, [dataPage]);

  // console.log("curentPages", curentPages);
  // console.log("totalPages", totalPages);

  const urlDelete = "http://localhost:3000/api/products/status/";
  const { mutate } = useDelete(urlDelete, key);

  const handleSearchVariant = (id: string) => {
    navigate(`/admin/${id}/variant`);
  };

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
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (_: any, item: Product) => {
        return (
          <p
            onClick={() => handleSearchVariant(item._id.toString())}
            style={{ cursor: "pointer" }}
          >
            {item.name.toString()}
          </p>
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
      render: (object: Category) => {
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
  interface SearchValues {
    searchKey: string;
  }
  // Filter
  // Hàm fetch API
  const fetchProducts = async (key: string) => {
    const res = await fetch(
      `http://localhost:3000/api/products/search?key=${key}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      throw new Error("Error fetching products");
    }
    return res.json(); // Trả về dữ liệu từ API
  };
  ///
  const handleFinish = async (values: SearchValues) => {
    if (!values || typeof values.searchKey !== "string") {
      console.error("Invalid input value");
      return [];
    }

    const searchKey = values.searchKey.toLowerCase();

    try {
      const newData = await fetchProducts(searchKey); // Chờ dữ liệu trả về
      // console.log("new data:", newData);
      setDataTable(newData?.data); // Cập nhật state với dữ liệu thực tế
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };

  // console.log("dataTable", dataTable);
  const [formSearch] = Form.useForm();
  const handleRefresh = () => {
    setDataTable(dataPage?.products);
    formSearch.resetFields();
  };

  const handlePageChange = (page: number) => {
    setCurentPages(page);
  };
  return (
    <div>
      <h1 style={{ margin: "0 0 5px 0" }}>DANH MỤC SẢN PHẨM</h1>

      <Flex gap={0} style={{ marginBottom: "30px" }} justify="space-between">
        <Form
          form={formSearch}
          name="searchForm"
          layout="inline"
          onFinish={handleFinish}
        >
          <Tooltip title="Nhập tên danh mục" placement="right">
            <Form.Item label={null} name="searchKey" style={{ width: "400px" }}>
              <Input placeholder="Tìm kiếm z..." prefix={<SearchOutlined />} />
            </Form.Item>
          </Tooltip>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Tìm kiếm
            </Button>
          </Form.Item>
          <Tooltip title="Làm mới" placement="rightBottom">
            <ReloadOutlined
              style={{ cursor: "pointer" }}
              onClick={handleRefresh}
            />
          </Tooltip>
        </Form>
      </Flex>
      <Skeleton loading={isLoading}>
        <Button
          type="primary"
          style={{ marginBottom: "4px" }}
          onClick={showModal}
        >
          Thêm mới sản phẩm
        </Button>

        <Table
          dataSource={
            dataTable.length !== null ? dataTable : dataPage?.products
          }
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
