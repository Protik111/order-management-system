import React, { useEffect } from "react";
import { Modal, Input, Form, Button } from "antd";
import { toast } from "sonner";
import axiosInstance from "../../lib/axios";
import { AxiosError } from "axios";

interface ProductModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isEdit?: boolean;
  productData?: {
    id: string;
    name: string;
    description: string;
    price: number;
    weight: number;
  };
}

const ProductModal: React.FC<ProductModalProps> = ({
  isModalOpen,
  onClose,
  onSuccess,
  isEdit = false,
  productData,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEdit && productData) {
      form.setFieldsValue(productData);
    } else {
      form.resetFields();
    }
  }, [isEdit, productData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const parsedValues = {
        ...values,
        price: Number(values.price),
        weight: Number(values.weight),
      };

      try {
        if (isEdit && productData?.id) {
          // Update product API call
          const response = await axiosInstance.patch(
            `/product/${productData.id}`,
            parsedValues
          );

          if (response?.status === 200) {
            toast.success("Product updated successfully!");
            onSuccess();
            onClose();
          }
        } else {
          // Create product API call
          const response = await axiosInstance.post("/product", parsedValues);

          if (response?.status === 201) {
            toast.success("Product created successfully!");
            onSuccess();
            onClose();
          }
        }
      } catch (apiError) {
        const axiosError = apiError as AxiosError<{ message: string }>;
        toast.error(
          axiosError?.response?.data?.message ?? "Error saving product."
        );
      }
    } catch (error) {
      console.error("Validation Failed:", error);
    }
  };

  return (
    <Modal
      title={isEdit ? "Update Product Order" : "Create Product Order"}
      open={isModalOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
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
  );
};

export default ProductModal;
