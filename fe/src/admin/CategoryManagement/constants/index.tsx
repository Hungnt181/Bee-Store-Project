import { Category } from "../../../interface/Category";
import { ColumnsType } from "antd/es/table";
import { Button, Dropdown, MenuProps, Space, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { MoreOutlined } from "@ant-design/icons";

const items: MenuProps['items'] = [
    {
      key: 'EDIT',
      label: (
        <a target="_blank" href="">
          Chỉnh sửa
        </a>
      ),
    },
    {
      key: 'DELETE',
      label: (
        <a target="_blank" href="">
          Xóa
        </a>
      ),
      disabled: true,
    },
  ];

export const getColumnsCategories = ({onAction}: {onAction: (record: Category) => void}): ColumnsType<Category> => {
  return [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 80,
      render: (_value: unknown, _record: Category, index: number) => {
        return <div>{index + 1}</div>
      }
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      width: 250,
      render: (value: string) => {
        return <Tooltip title={value}>
          <span>{value}</span>
        </Tooltip>
      }
    },
    {
      title: "Trạng thái danh mục",
      dataIndex: "status",
      key: "status",
      width: 250,
      render: (_status: boolean, item: Category) => {
        return item.status ? (
          <Tag color="green">
            Đang hoạt động
          </Tag>
        ) : (
          <Tag color="red">
            Dừng hoạt động
          </Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      render: (value: string) => {
        return <Tooltip title={dayjs(value).format("DD/MM/YYYY HH:mm:ss")}>
          <span>{dayjs(value).format("DD/MM/YYYY")}</span>
        </Tooltip>
      },
    },
    {
      title: "Ngày sửa cuối",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 200,
      render: (value: string) => {
        return <Tooltip title={dayjs(value).format("DD/MM/YYYY HH:mm:ss")}>
          <span>{dayjs(value).format("DD/MM/YYYY")}</span>
        </Tooltip>
      },
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      align: "right",
      fixed: 'right',
      render: (_: unknown, item: Category) => {
        return (
          <Space>
            <Button type={"primary"} onClick={() => onAction(item)}>Chi tiết</Button>
            <Dropdown menu={{ items }} placement="bottomLeft">
              <MoreOutlined style={{cursor: "pointer"}}/>
            </Dropdown>
          </Space>
        );
      },
    },
  ]
}
