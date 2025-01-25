import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, Space, message } from "antd";
import axiosInstance from "../../lib/axios";
import { AxiosError } from "axios";
import moment from "moment";
import { toast } from "sonner";

interface Promotion {
  id: string;
  title: string;
  type: string;
  discount: number;
  startDate: string;
  endDate: string;
  productIds: string[];
  isEnabled?: boolean;
  slabs?: { minWeight: number; maxWeight: number; discount: number }[];
}

interface PromotionListProps {
  onEdit: (promotion: Promotion) => void; // Callback for editing
  hasCreated: boolean; // Trigger for re-fetching data
}

const PromotionList: React.FC<PromotionListProps> = ({
  onEdit,
  hasCreated,
}) => {
  const [loading, setLoading] = useState(false);
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    fetchPromotions();
  }, [hasCreated]);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/promotion");
      setPromotions(response?.data?.data || []);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.log(
        axiosError?.response?.data?.message || "Failed to fetch promotions"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/promotion/${id}`);
      toast.success("Promotion deleted successfully!");
      fetchPromotions();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      message.error(
        axiosError?.response?.data?.message || "Failed to delete promotion"
      );
    }
  };

  const handleUpdateStatus = async (id: string, enable: boolean) => {
    try {
      await axiosInstance.patch(`/promotion/status/${id}`, { enable });
      toast.success("Promotion status updated successfully!");
      fetchPromotions();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      message.error(
        axiosError?.response?.data?.message || "Failed to update status"
      );
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => type.charAt(0).toUpperCase() + type.slice(1),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (discount: number, record: Promotion) =>
        record.type === "weighted" ? "Weighted (Slabs)" : `${discount}%`,
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date: string) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date: string) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Promotion) => (
        <Space>
          <Button type="primary" onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this promotion?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>

          <Popconfirm
            title={
              record?.isEnabled
                ? "Are you sure you want to disable this promotion?"
                : "Are you sure you want to enable this promotion?"
            }
            onConfirm={() => handleUpdateStatus(record.id, !record?.isEnabled)}
            okText="Yes"
            cancelText="No"
          >
            <Button color="purple" variant="solid">
              {record?.isEnabled ? "Disable" : "Enable"}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={promotions}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default PromotionList;
