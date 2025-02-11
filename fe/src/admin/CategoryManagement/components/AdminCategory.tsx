import { Button, Flex, Table } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import { Category } from '../../../interface/Category';
import { ColumnsType } from 'antd/es/table';
import { PlusOutlined } from '@ant-design/icons';
import { getColumnsCategories } from '../constants';
import { useGetAllCategories } from '../queryHooks';
import ModalAddCate from './ModalAddCate';
import useCateStore from '../stores';
import ModalViewCate from './ModalViewCate';
import dayjs from 'dayjs';

const AdminCategory: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setCateDetail, setActionMode, actionMode, resetCateStore, setIsValuesChange } = useCateStore();
  const { data: listCategories, isLoading: loadingTable } = useGetAllCategories();
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

  return (
    <div>
      <h1>DANH MỤC LOẠI SẢN PHẨM</h1>
      <Flex vertical gap={20} >
        <Button type={"primary"} style={{ width: "100px" }} onClick={() => setIsModalOpen(true)} icon={<PlusOutlined />}>
          Thêm mới
        </Button>
        <ModalAddCate open={isModalOpen} onClose={() => setIsModalOpen(!isModalOpen)} />
        <Table
          loading={loadingTable}
          dataSource={listCategories}
          columns={columns}
          rowKey={"_id"}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content', y: 55 * 8 }}
          // virtual
        />
        <ModalViewCate open={actionMode} onClose={resetCateStore} />
      </Flex>
    </div>
  )
}

export default AdminCategory