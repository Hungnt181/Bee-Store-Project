import { Button, Flex, Form, Input, Table, Tooltip } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { Category, IParamsUrl } from "../../../interface/Category";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { getColumnsCategories } from "../constants";
import { useGetAllCategories } from "../queryHooks";
import ModalAddCate from "./ModalAddCate";
import useCateStore from "../stores";
import ModalViewCate from "./ModalViewCate";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";
import { REACT_QUERY_KEYS } from "../../../constants/querykeys";

const AdminCategory: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });
  const {
    setCateDetail,
    setActionMode,
    actionMode,
    resetCateStore,
    setIsValuesChange,
  } = useCateStore();
  const { data: listCategories, isLoading: loadingTable } =
    useGetAllCategories(searchValue);
  const handleAction = useCallback(
    (record: Category, editStatus: boolean) => {
      setActionMode(true);
      setCateDetail({
        ...record,
        createdAt: dayjs(record.createdAt).format("DD/MM/YYYY HH:mm:ss"),
        updatedAt: dayjs(record.updatedAt).format("DD/MM/YYYY HH:mm:ss"),
      });
      setIsValuesChange(editStatus);
    },
    [setActionMode, setCateDetail, setIsValuesChange]
  );
  const columns: ColumnsType<Category> = useMemo(() => {
    return getColumnsCategories(pagination.current, pagination.pageSize, {
      onAction: handleAction,
    });
  }, [handleAction, pagination]);
  const handleFinish = useCallback((values: IParamsUrl) => {
    console.log(values);

    setSearchValue(values.searchKey);
  }, []);
  const handleRefresh = useCallback(() => {
    setSearchValue("");
    queryClient.invalidateQueries({
      queryKey: [REACT_QUERY_KEYS.GET_ALL_CATEGORIES, ""],
    });
  }, [queryClient]);

  return (
    <div>
      <h1>DANH MỤC LOẠI SẢN PHẨM</h1>
      <Flex gap={0} style={{ marginBottom: "30px" }} justify="space-between">
        <Form name="searchForm" layout="inline" onFinish={handleFinish}>
          <Tooltip title="Nhập tên danh mục" placement="right">
            <Form.Item label={null} name="searchKey" style={{ width: "400px" }}>
              <Input
                placeholder="Tìm kiếm danh mục..."
                prefix={<SearchOutlined />}
              />
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
        <Button
          type={"primary"}
          style={{ width: "100px" }}
          onClick={() => setIsModalOpen(true)}
          icon={<PlusOutlined />}
        >
          Thêm mới
        </Button>
      </Flex>
      <ModalAddCate
        open={isModalOpen}
        onClose={() => setIsModalOpen(!isModalOpen)}
      />
      <Table
        loading={loadingTable}
        dataSource={listCategories || []}
        columns={columns}
        rowKey={"_id"}
        pagination={pagination}
        onChange={(page) => setPagination(page)}
        scroll={{ x: "max-content", y: 55 * 8 }}
        // virtual
      />
      <ModalViewCate open={actionMode} onClose={resetCateStore} />
    </div>
  );
};

export default AdminCategory;
