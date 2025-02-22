import { Category } from "../../../interface/Category";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { Button, Dropdown, MenuProps, Space, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { MoreOutlined } from "@ant-design/icons";

export const getColumnsCategories = (
  current: TablePaginationConfig["current"],
  pageSize: TablePaginationConfig["pageSize"],
  { onAction }: { onAction: (record: Category, edit: boolean) => void },
): ColumnsType<Category> => {
  return [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 80,
      render: (_value: unknown, _record: Category, index: number) => {
        const stt = (current && pageSize) ? (current - 1) * pageSize + index + 1 : "";
        return <Tooltip title={stt}>
          <div>{stt}</div>
        </Tooltip>
      }
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      width: 250,
      fixed: "left",
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
      width: 280,
      render: (_status: boolean, item: Category) => {
        return item.status ? (
          <Tooltip title={"Đang hoạt động"}>
            <Tag color="green">
              Đang hoạt động
            </Tag>
          </Tooltip>
        ) : (
          <Tooltip title={"Dừng hoạt động"}>
          <Tag color="red">
            Dừng hoạt động
          </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 320,
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
      width: 320,
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
      align: "center",
      fixed: 'right',
      render: (_: unknown, item: Category) => {
        const items: MenuProps['items'] = [
          {
            key: 'EDIT',
            label: (
              <span onClick={() => onAction(item, true)}>
                Chỉnh sửa
              </span>
            ),
          },
          {
            key: 'DELETE',
            label: (
              <span>
                Xóa
              </span>
            ),
            disabled: true,
          },
        ];
        return (
          <Space>
            <Button type={"primary"} onClick={() => onAction(item, false)}>Chi tiết</Button>
            <Dropdown menu={{ items: items }} placement="bottomLeft">
              <MoreOutlined style={{ cursor: "pointer" }} />
            </Dropdown>
          </Space>
        );
      },
    },
  ]
}
