import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  InputNumber,
  Tag,
  Spin,
  Typography,
  Image,
} from "antd";
import axiosInstance from "../../lib/axios";

interface Slab {
  id: string;
  promotionId: string;
  minWeight: number;
  maxWeight: number;
  discount: number;
}

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: number;
  imageUrl?: string;
  promotion?: {
    type: "percentage" | "fixed" | "weighted";
    discount: number;
    slabs: Slab[];
  };
};

const ProductCart = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasCreated] = useState<boolean>(false);

  useEffect(() => {
    fetchProducts();
  }, [hasCreated]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/product");
      setProducts(response.data?.data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (productId: string, value: number | null) => {
    // Implement your quantity change logic
    console.log(`Product ${productId} quantity changed to:`, value);
  };

  const calculateWeightedDiscount = (weight: number, slabs: Slab[]) => {
    const applicableSlab = slabs.find(
      (slab) => weight >= slab.minWeight && weight <= slab.maxWeight
    );
    return applicableSlab ? applicableSlab.discount : 0; // Return 0 if no slab matches
  };

  return (
    <div style={{ padding: "24px" }}>
      <Typography.Title level={3}>Available Products</Typography.Title>

      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {products.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={8} lg={6} xl={6}>
              <Card
                hoverable
                cover={
                  <Image
                    alt={product.name}
                    src={
                      "https://www.productcart.com/store/pc/catalog/logo-standard-general.png"
                    }
                    height={200}
                    style={{ objectFit: "cover" }}
                    preview={false}
                  />
                }
                actions={[
                  <div key="quantity" style={{ padding: "8px" }}>
                    <InputNumber
                      min={1}
                      defaultValue={1}
                      onChange={(value) =>
                        handleQuantityChange(product.id, value)
                      }
                      style={{ width: "100%" }}
                    />
                  </div>,
                ]}
              >
                <Card.Meta
                  title={product.name}
                  description={
                    <>
                      <div style={{ margin: "8px 0" }}>
                        <p className="line-through">
                          ৳{product.price.toFixed(2)}
                        </p>

                        <Tag color="green" style={{ fontSize: "1rem" }}>
                          ৳{product.price.toFixed(2)}
                        </Tag>

                        {product.promotion && (
                          <Tag color="green" style={{ fontSize: "1rem" }}>
                            {product.promotion.type === "percentage"
                              ? `${product.promotion.discount}% OFF`
                              : product.promotion.type === "fixed"
                              ? `৳${product.promotion.discount} OFF`
                              : `৳${calculateWeightedDiscount(
                                  product.weight,
                                  product.promotion.slabs
                                )} OFF`}
                          </Tag>
                        )}
                      </div>
                      <Typography.Paragraph type="secondary">
                        {product.description}
                      </Typography.Paragraph>

                      <Typography.Paragraph type="secondary">
                        Weight: {product?.weight}
                      </Typography.Paragraph>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        {!loading && products.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Typography.Text type="secondary">
              No products available
            </Typography.Text>
          </div>
        )}
      </Spin>
    </div>
  );
};

export default ProductCart;
