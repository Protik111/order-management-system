import { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Form,
  Button,
  Select,
  DatePicker,
  InputNumber,
} from "antd";
import { toast } from "sonner";
import { AxiosError } from "axios";
import axiosInstance from "../../lib/axios";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";

interface PromotionModalProps {
  visible: boolean;
  onClose: () => void;
  isEdit: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  productData: any;
  refreshData: () => void;
}

const PromotionModal: React.FC<PromotionModalProps> = ({
  visible,
  onClose,
  isEdit,
  productData,
  refreshData,
}) => {
  const [form] = Form.useForm();
  const [promotionType, setPromotionType] = useState<string>("percentage");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [productList, setProductList] = useState<any[]>([]);

  useEffect(() => {
    // Fetch the product list for product selection
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/product");
        setProductList(response?.data?.data);
      } catch (error) {
        console.log("error", error);
        toast.error("Error fetching products.");
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (isEdit && productData) {
      const parsedStartDate = productData.startDate
        ? moment(productData.startDate, "YYYY-MM-DD HH:mm:ss")
        : null;

      const parsedEndDate = productData.endDate
        ? moment(productData.endDate, "YYYY-MM-DD HH:mm:ss")
        : null;

      form.setFieldsValue({
        title: productData.title,
        type: productData.type,
        discount: productData.discount,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        productIds: productData.productIds,
        slabs: productData.slabs || [],
      });
      setPromotionType(productData.type);
    }
  }, [isEdit, productData]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      try {
        const response = isEdit
          ? await axiosInstance.patch(`/promotion/${productData.id}`, values)
          : await axiosInstance.post("/promotion", values);

        if (response.status === 201 || response.status === 200) {
          toast.success(
            isEdit
              ? "Promotion updated successfully!"
              : "Promotion created successfully!"
          );
          onClose();
          refreshData();
        }
      } catch (apiError) {
        const axiosError = apiError as AxiosError<{ message: string }>;
        toast.error(
          axiosError?.response?.data?.message ??
            "Error creating or updating promotion."
        );
      }
    } catch (error) {
      console.error("Validation Failed:", error);
    }
  };

  const handlePromotionTypeChange = (value: string) => {
    setPromotionType(value);
  };

  return (
    <Modal
      title={isEdit ? "Edit Promotion" : "Create Promotion"}
      visible={visible}
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
          label="Title"
          name="title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input placeholder="Enter promotion title" />
        </Form.Item>
        {!isEdit && !productData && (
          <Form.Item
            label="Type"
            name="type"
            initialValue="percentage"
            rules={[{ required: true, message: "Type is required" }]}
          >
            <Select onChange={handlePromotionTypeChange}>
              <Select.Option value="percentage">Percentage</Select.Option>
              <Select.Option value="fixed">Fixed</Select.Option>
              <Select.Option value="weighted">Weighted</Select.Option>
            </Select>
          </Form.Item>
        )}
        {!isEdit && !productData && (
          <Form.Item
            label="Discount"
            name="discount"
            rules={[{ required: true, message: "Discount is required" }]}
          >
            <InputNumber
              min={0}
              max={100}
              placeholder="Enter discount value"
              style={{ width: "100%" }}
            />
          </Form.Item>
        )}
        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true, message: "Start date is required" }]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="End Date"
          name="endDate"
          rules={[{ required: true, message: "End date is required" }]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            style={{ width: "100%" }}
          />
        </Form.Item>
        {!isEdit && !productData && (
          <Form.Item
            label="Products"
            name="productIds"
            rules={[
              { required: true, message: "At least one product is required" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select products"
              style={{ width: "100%" }}
            >
              {productList.map((product) => (
                <Select.Option key={product.id} value={product.id}>
                  {product.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {!isEdit && !productData && promotionType === "weighted" && (
          <Form.List
            name="slabs"
            initialValue={[]}
            rules={[
              {
                validator: async (_, slabs) => {
                  if (!slabs || slabs.length === 0) {
                    return Promise.reject(
                      new Error("At least one slab is required")
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }) => (
                  <div key={key} style={{ marginBottom: 16 }}>
                    <Form.Item
                      label={`Min Weight for Slab ${key + 1}`}
                      name={[name, "minWeight"]}
                      rules={[
                        { required: true, message: "Min weight is required" },
                      ]}
                    >
                      <InputNumber placeholder="Min Weight" />
                    </Form.Item>
                    <Form.Item
                      label={`Max Weight for Slab ${key + 1}`}
                      name={[name, "maxWeight"]}
                      rules={[
                        { required: true, message: "Max weight is required" },
                      ]}
                    >
                      <InputNumber placeholder="Max Weight" />
                    </Form.Item>
                    <Form.Item
                      label={`Discount for Slab ${key + 1}`}
                      name={[name, "discount"]}
                      rules={[
                        { required: true, message: "Discount is required" },
                      ]}
                    >
                      <InputNumber placeholder="Discount" />
                    </Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => remove(name)}
                      icon={<MinusOutlined />}
                    >
                      Remove Slab
                    </Button>
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add Slab
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        )}
      </Form>
    </Modal>
  );
};

export default PromotionModal;
