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

const AdminCategory: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setCateDetail, setActionMode, actionMode, resetCateStore } = useCateStore();
  const { data: listCategories, isLoading: loadingTable } = useGetAllCategories();
  const handleAction = useCallback(( record: Category) => {
    setActionMode(true);
    setCateDetail(record); 
  }, [setActionMode, setCateDetail])
  const columns: ColumnsType<Category> = useMemo(() => {
    return getColumnsCategories({
      onAction: handleAction
    });
  }, [handleAction]);

  return (
    <div>
      <h2>DANH MỤC LOẠI SẢN PHẨM</h2>
      <Flex vertical gap={20} >
        <Button type={"primary"} style={{ width: "100px" }} onClick={() => setIsModalOpen(true)} icon={<PlusOutlined />}>
          Thêm mới
        </Button>
        <ModalAddCate open={isModalOpen} onClose={() => setIsModalOpen(!isModalOpen)} />
        <Table
          loading={loadingTable}
          dataSource={listCategories}
          columns={columns}
          rowKey={"id"}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content', y: 55 * 7 }}
        />
        <ModalViewCate open={actionMode} onClose={resetCateStore}/>
      </Flex>
    </div>
  )
}

export default AdminCategory