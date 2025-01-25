import { useState } from "react";
import { Modal, Input, Form, Button } from "antd";
import Header from "../components/shared/Header";
import { toast } from "sonner";
import axiosInstance from "../lib/axios";
import { AxiosError } from "axios";
import ProductList from "../components/product/ProductList";

const Product: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [hasCreated, setHasCreated] = useState<boolean>(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const parsedValues = {
        ...values,
        price: Number(values.price),
        weight: Number(values.weight),
      };
      try {
        const response = await axiosInstance.post("/product", parsedValues);

        if (response?.status === 201) {
          // Handle success
          toast.success("Product created successfully!");
          setIsModalOpen(false);
          setHasCreated(!hasCreated);
          form.resetFields();
        }
      } catch (apiError) {
        const axiosError = apiError as AxiosError<{ message: string }>;
        toast.error(
          axiosError?.response?.data?.message ?? "Error creating product."
        );
      }
    } catch (error) {
      console.error("Validation Failed:", error);
    }
  };

  return (
    <div className="py-10">
      <Header />
      <div className="">
        <div className="px-6 py-10 lg:py-12 xl:py-15">
          <div className="flex items-center justify-between">
            <h1 className="text-xl">Product</h1>
            <button
              type="button"
              className="btn-dark-full text-regular max-w-max"
              onClick={showModal}
            >
              Create Order
            </button>
          </div>
          <hr className="mt-2 bg-[lightGray] h-[2px]" />
        </div>

        <ProductList hasCreated={hasCreated} />
      </div>

      <Modal
        title="Create Product Order"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Submit
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Product Name"
            name="name"
            rules={[{ required: true, message: "Product name is required" }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input.TextArea rows={4} placeholder="Enter product description" />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[
              { required: true, message: "Price is required" },
              {
                type: "number",
                message: "Price must be a number",
                transform: (value) => +value,
              },
            ]}
          >
            <Input placeholder="Enter product price" />
          </Form.Item>
          <Form.Item
            label="Weight"
            name="weight"
            rules={[
              { required: true, message: "Weight is required" },
              {
                type: "number",
                message: "Weight must be a number",
                transform: (value) => +value,
              },
            ]}
          >
            <Input placeholder="Enter product weight" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Product;
