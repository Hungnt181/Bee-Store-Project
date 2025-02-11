import { Button, Flex, Form, Input, Table, Tooltip } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { Category, IParamsUrl } from '../../../interface/Category';
import { ColumnsType } from 'antd/es/table';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { getColumnsCategories } from '../constants';
import { useGetAllCategories } from '../queryHooks';
import ModalAddCate from './ModalAddCate';
import useCateStore from '../stores';
import ModalViewCate from './ModalViewCate';
import dayjs from 'dayjs';
import { useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from '../../../constants/querykeys';

const AdminCategory: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setCateDetail, setActionMode, actionMode, resetCateStore, setIsValuesChange } = useCateStore();
  const { data: listCategories, isLoading: loadingTable } = useGetAllCategories(searchValue);
  const handleAction = useCallback((record: Category, editStatus: boolean) => {
    setActionMode(true);
    setCateDetail({
      ...record,
      createdAt: dayjs(record.createdAt).format("DD/MM/YYYY HH:mm:ss"),
      updatedAt: dayjs(record.updatedAt).format("DD/MM/YYYY HH:mm:ss"),
    });
    setIsValuesChange(editStatus);
  }, [setActionMode, setCateDetail, setIsValuesChange])
  const columns: ColumnsType<Category> = useMemo(() => {
    return getColumnsCategories({
      onAction: handleAction
    });
  }, [handleAction]);
  const handleFinish = useCallback((values: IParamsUrl) => {
    setSearchValue(values.searchKey);
  }, [])
  const handleRefresh = useCallback(() => {
    setSearchValue("");
    queryClient.invalidateQueries({
      queryKey: [REACT_QUERY_KEYS.GET_ALL_CATEGORIES, ""]
    })
  }, [queryClient])

  return (
    <div>
      <h1>DANH MỤC LOẠI SẢN PHẨM</h1>
      <Flex gap={0} style={{ marginBottom: "30px" }} justify='space-between'>
        <Form
          name='searchForm'
          layout='inline'
          onFinish={handleFinish}
        >
          <Form.Item label={null} name="searchKey" style={{ width: "400px" }}>
            <Tooltip title="Nhập tên danh mục" placement='right'>
              <Input placeholder='Tìm kiếm danh mục...' value={searchValue} prefix={<SearchOutlined />} />
            </Tooltip>
          </Form.Item>
          <Form.Item label={null}>
            <Button type='primary' htmlType='submit'>Tìm kiếm</Button>
          </Form.Item>
          <Tooltip title="Làm mới" placement='rightBottom'>
            <ReloadOutlined style={{ cursor: "pointer" }} onClick={handleRefresh} />
          </Tooltip>
        </Form>
        <Button type={"primary"} style={{ width: "100px" }} onClick={() => setIsModalOpen(true)} icon={<PlusOutlined />}>
          Thêm mới
        </Button>
      </Flex>
      <ModalAddCate open={isModalOpen} onClose={() => setIsModalOpen(!isModalOpen)} />
      <Table
        loading={loadingTable}
        dataSource={listCategories || []}
        columns={columns}
        rowKey={"_id"}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content', y: 55 * 6 }}
      // virtual
      />
      <ModalViewCate open={actionMode} onClose={resetCateStore} />
    </div>
  )
}

export default AdminCategory