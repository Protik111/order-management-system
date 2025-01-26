import React, { useEffect, useState } from "react";
import { Table } from "antd";
import axiosInstance from "../../lib/axios";
import { AxiosError } from "axios";
import moment from "moment";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  subTotal: number;
  discount: number;
  createdAt: string;
  updatedAt: string;
  products: {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    discount: number;
    weight: number;
    subTotal: number;
    product: {
      id: string;
      name: string;
      description: string;
      price: number;
      weight: number;
      isEnabled: boolean;
      createdAt: string;
      updatedAt: string;
    };
    promotions: {
      id: string;
      title: string;
      type: string;
      discount: number | null;
      startDate: string;
      endDate: string;
      isEnabled: boolean;
      createdAt: string;
      updatedAt: string;
    }[];
  }[];
}

const OrderList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/order");
      setOrders(response?.data?.data || []);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.log(
        axiosError?.response?.data?.message || "Failed to fetch orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Customer Email",
      dataIndex: "customerEmail",
      key: "customerEmail",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total: number) => `৳${total.toFixed(2)}`,
    },
    {
      title: "Subtotal",
      dataIndex: "subTotal",
      key: "subTotal",
      render: (subTotal: number) => `৳${subTotal.toFixed(2)}`,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (discount: number) => `৳${discount.toFixed(2)}`,
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => moment(date).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      render: (products: Order["products"]) => (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.product.name} (Qty: {product.quantity})
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={orders}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default OrderList;
