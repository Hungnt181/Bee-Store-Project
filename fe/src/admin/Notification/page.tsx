import { useQuery } from "@tanstack/react-query";
import { Button, List, Pagination, Skeleton, Typography } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Notification } from "../../interface/Notification";
import dayjs from "dayjs";
import { ObjectId } from "mongoose";

const NotificationPage = () => {
  const navigate = useNavigate();
  // const { data, isLoading } = useGetAll<Product>(url, key);
  const [dataTable, setDataTable] = useState<Notification[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [curentPages, setCurentPages] = useState(1);
  const [filterType, setFilterType] = useState<"all" | "unread">("all");
  const pageSize = 10;
  const url = `http://localhost:3000/api/notifications?_page=${curentPages}&_limit=${pageSize}&_filter=${filterType}`;

  const { data: dataPage, isLoading } = useQuery({
    queryKey: ["dataPage", curentPages, filterType],
    queryFn: async () => {
      const response = await axios.get(url);
      return response.data;
    },
  });

  useEffect(() => {
    if (dataPage) {
      setTotalPages(dataPage.totalPages);
      setCurentPages(dataPage.page);
      setDataTable(dataPage.notifications);
    }
  }, [dataPage]);

  const handleMarkAsRead = async (id: ObjectId) => {
    try {
      await axios.patch(`http://localhost:3000/api/notifications/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async (_id: ObjectId, id_order: string) => {
    handleMarkAsRead(_id);
    navigate(`/admin/order/${id_order}`);
  };

  return (
    <Skeleton loading={isLoading}>
      <div className="p-4 bg-white shadow-lg rounded-2xl w-[50%] h-[650px] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Thông báo</h2>
        </div>

        {/* Bộ lọc */}
        <div className="flex items-center gap-4 mb-4">
          <Button
            type={filterType === "all" ? "primary" : "default"}
            className={`rounded-full px-4 py-1 ${
              filterType === "all" ? "bg-blue-100 text-blue-600" : ""
            }`}
            onClick={() => setFilterType("all")}
          >
            Tất cả
          </Button>
          <Button
            type={filterType === "unread" ? "primary" : "default"}
            className={`rounded-full px-4 py-1 ${
              filterType === "unread" ? "bg-blue-100 text-blue-600" : ""
            }`}
            onClick={() => setFilterType("unread")}
          >
            Chưa đọc
          </Button>
        </div>

        <List
          itemLayout="horizontal"
          dataSource={dataTable}
          renderItem={(item) => (
            <div>
              <List.Item
                className="rounded-xl p-2 cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => {
                  handleClick(item?._id as unknown as ObjectId, item?.id_order);
                }}
              >
                <List.Item.Meta
                  // avatar={<Avatar src={item?.avatar} />}
                  title={
                    <div className="flex justify-between w-full pl-2  ">
                      <Typography.Text
                        className={`font-medium text-[16px]
                                  ${
                                    item?.isRead
                                      ? "!text-gray-500 !text-[16px]"
                                      : "text-black !text-[16px]"
                                  }`}
                      >
                        {item?.message}
                      </Typography.Text>
                    </div>
                  }
                  description={
                    <Typography.Text className="text-[12px] text-gray-700 pl-2">
                      {dayjs(item?.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                    </Typography.Text>
                  }
                />
                {!item?.isRead && (
                  <div className="w-3 h-3 bg-blue-700 rounded-full mr-2"></div>
                )}
              </List.Item>
            </div>
          )}
        />

        <div className="flex justify-end mt-4">
          <Pagination
            current={curentPages}
            pageSize={pageSize}
            total={totalPages * pageSize}
            onChange={(page) => setCurentPages(page)}
          />
        </div>
      </div>
    </Skeleton>
  );
};

export default NotificationPage;
