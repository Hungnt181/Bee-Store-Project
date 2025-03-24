/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Select, DatePicker, Button, Space, Card, Table, Image } from "antd";
import axios from "axios";
import moment from "moment";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const AdminDashboardPage = () => {
  //  Thống kê doanh số + số đơn
  const { RangePicker } = DatePicker;
  const [date, setDate] = useState<moment.Moment>(moment());
  const [range, setRange] = useState<moment.Moment[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartType, setChartType] = useState("bar"); // line chart type
  const [type, setType] = useState("monthly");

  // Thống kê sản phẩm bán chạy
  const [date2, setDate2] = useState<moment.Moment>(moment());
  const [year, setYear] = useState<moment.Moment>(moment());
  const [range2, setRange2] = useState<moment.Moment[]>([]);
  const [type2, setType2] = useState("monthly");
  const [products, setProducts] = useState([]);

  const fetchData = async () => {
    try {
      const params: {
        type2: string;
        date?: string;
        month?: string;
        year?: string;
        from?: string;
        to?: string;
      } = { type2 };
      if (type2 === "daily" && date2) {
        params.date = date.format("YYYY-MM-DD");
      } else if (type2 === "monthly" && date2) {
        params.month = date2.format("YYYY-MM");
      } else if (type2 === "yearly" && year) {
        params.year = date2.format("YYYY");
      } else if (type2 === "range2" && range2.length === 2) {
        params.from = range2[0].format("YYYY-MM-DD");
        params.to = range2[1].format("YYYY-MM-DD");
      }

      const res = await axios.get(
        "http://localhost:3000/api/statistics/best-selling-products?",
        {
          params,
        }
      );
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const columns = [
    {
      title: "Ảnh",
      dataIndex: "variantImage",
      key: "variantImage",
      render: (text: string) => {
        return <Image src={text[0]} width={50} height={50}></Image>;
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Màu sắc",
      dataIndex: "colorName",
      key: "colorName",
    },
    {
      title: "Kích cỡ",
      dataIndex: "sizeName",
      key: "sizeName",
    },
    {
      title: "Số lượng",
      dataIndex: "totalSold",
      key: "totalSold",
    },
  ];
  // Lấy data
  const handleFetchData = async () => {
    const params: {
      type: string;
      date?: string;
      month?: string;
      from?: string;
      to?: string;
    } = { type };

    if (type === "daily" && date) {
      params.date = date.format("YYYY-MM-DD");
    } else if (type === "monthly" && date) {
      params.month = date.format("YYYY-MM");
    } else if (type === "range" && range.length === 2) {
      params.from = range[0].format("YYYY-MM-DD");
      params.to = range[1].format("YYYY-MM-DD");
    }

    try {
      const res = await axios.get(
        "http://localhost:3000/api/statistics/revenue/",
        { params }
      );
      const data = res.data.map((item: any) => ({
        date: item._id,
        revenue: item.totalRevenue,
        orders: item.orderCount,
      }));
      setChartData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (type === "monthly" && date) {
      handleFetchData();
    }
    if (type2 === "monthly" && date) {
      fetchData();
    }
  }, []);

  return (
    <div>
      <div className="flex">
        <Card title="Thống kê doanh thu" className="w-full">
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Space wrap>
              <Select
                value={type}
                onChange={setType}
                style={{ width: 180 }}
                options={[
                  { label: "Theo ngày", value: "daily" },
                  { label: "Theo tháng", value: "monthly" },
                  { label: "Theo khoảng thời gian", value: "range" },
                ]}
              />

              {type === "range" ? (
                <RangePicker
                  onChange={(dates) =>
                    setRange(dates as unknown as moment.Moment[])
                  }
                />
              ) : (
                <DatePicker
                  picker={type === "monthly" ? "month" : "date"}
                  onChange={(date) => setDate(date)}
                />
              )}

              <Select
                value={chartType}
                onChange={setChartType}
                style={{ width: 150 }}
                options={[
                  { label: "Bar Chart", value: "bar" },
                  { label: "Line Chart", value: "line" },
                ]}
              />

              <Button type="primary" onClick={handleFetchData}>
                Xem thống kê
              </Button>
            </Space>

            {chartData.length > 0 && (
              <ResponsiveContainer width="100%" height={400}>
                {chartType === "bar" ? (
                  <BarChart data={chartData} className="p-1">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                      tickFormatter={(value) =>
                        Number(value).toLocaleString("vi-VN")
                      }
                    />
                    <Tooltip
                      formatter={(value: any, name: string) => {
                        if (name.includes("Doanh thu")) {
                          return `${Number(value).toLocaleString("vi-VN")} VNĐ`;
                        }
                        return value;
                      }}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#1890ff"
                      name="Doanh thu (VNĐ)"
                    />

                    <Bar dataKey="orders" fill="#1890ff" name="Tổng số đơn " />
                  </BarChart>
                ) : (
                  <LineChart data={chartData} className="p-1">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                      tickFormatter={(value) =>
                        Number(value).toLocaleString("vi-VN")
                      }
                    />
                    <Tooltip
                      formatter={(value: any, name: string) => {
                        if (name.includes("Doanh thu")) {
                          return `${Number(value).toLocaleString("vi-VN")} VNĐ`;
                        }
                        return value;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#1890ff"
                      name="Doanh thu (VNĐ)"
                    />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="#1890ff"
                      name="Tổng số đơn"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            )}
          </Space>
        </Card>
      </div>
      <div className="mt-4">
        <Card title="Thống kê sản phẩm bán chạy " className="w-full">
          <div className="p-4 bg-white shadow rounded-xl">
            <div className="flex gap-4 mb-4">
              <Select
                value={type2}
                onChange={setType2}
                style={{ width: 180 }}
                options={[
                  { label: "Theo ngày", value: "daily" },
                  { label: "Theo tháng", value: "monthly" },
                  { label: "Theo năm", value: "yearly" },
                  { label: "Theo khoảng thời gian", value: "range2" },
                ]}
              />

              {type2 === "range2" ? (
                <RangePicker
                  onChange={(dates) =>
                    setRange2(dates as unknown as moment.Moment[])
                  }
                />
              ) : (
                <DatePicker
                  picker={
                    type2 === "monthly"
                      ? "month"
                      : type2 === "yearly"
                      ? "year"
                      : "date"
                  }
                  onChange={(date2) => setDate2(date2)}
                />
              )}

              <Button type="primary" onClick={fetchData}>
                Thống kê
              </Button>
            </div>

            <Table
              dataSource={products}
              columns={columns}
              rowKey="_id"
              pagination={false}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
