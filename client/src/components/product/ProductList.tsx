import React, { useEffect, useState } from "react";
import { Table, Spin, Button, Popconfirm } from "antd";
import axiosInstance from "../../lib/axios";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: number;
}

interface ProductListProps {
  hasCreated: boolean;
}

const ProductList = ({ hasCreated }: ProductListProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchProducts();
  }, [hasCreated]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/product");
      setProducts(response.data?.data);
    } catch (error) {
      console.log("Failed to load products. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/product/${id}`);
      toast.success("Product deleted successfully.");
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.log("Failed to delete product. Please try again.", error);
    }
  };

  const handleUpdate = (product: Product) => {
    // Logic to open a modal or navigate to the update page with pre-filled values
    console.log(`Updating product: ${product.name}`);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `৳${price.toFixed(2)}`,
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
      render: (weight: number) => `${weight} gm`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: string, record: Product) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            onClick={() => handleUpdate(record)}
            className="bg-blue-500 text-white"
          >
            Update
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="px-4 py-6">
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={products}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      )}
    </div>
  );
};

export default ProductList;
