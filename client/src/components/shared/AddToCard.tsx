import React, { useState } from "react";
import {
  Drawer,
  Button,
  InputNumber,
  Typography,
  Divider,
  List,
  Popconfirm,
} from "antd";
import { useCart } from "../../hooks/useCart";

const { Text, Title } = Typography;

const AddToCartDrawer: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const {
    cartOpen,
    setCartOpen,
    cart,
    removeFromCart,
    calculateTotal,
    updateQuantity,
  } = useCart();

  const sampleProduct = {
    id: "c281c440-6500-4dcc-a118-311da6ccee73",
    name: "Rafiur Rahman Protiksss",
    description: "asda",
    price: 20,
    discountedPrice: 5,
  };

  const toggleDrawer = () => {
    setCartOpen(!cartOpen);
  };

  const handleAddToCart = () => {
    const product = {
      id: sampleProduct.id,
      name: sampleProduct.name,
      price: sampleProduct.price,
      discountedPrice: sampleProduct.discountedPrice,
      quantity,
    };
    console.log("productor", product);
    // addToCart(product);
  };

  return (
    <div>
      {/* Drawer Component */}
      <Drawer
        title="Add to Cart"
        placement="right"
        onClose={toggleDrawer}
        open={cartOpen}
        width={400}
      >
        {/* Product Details */}
        <Title level={4}>{sampleProduct.name}</Title>
        <Text>{sampleProduct.description}</Text>
        <Divider />

        {/* Pricing */}
        <div style={{ marginBottom: "16px" }}>
          <Text>
            Price:{" "}
            <strong>
              ৳{sampleProduct.discountedPrice || sampleProduct.price}{" "}
              {sampleProduct.discountedPrice && (
                <Text delete>৳{sampleProduct.price}</Text>
              )}
            </strong>
          </Text>
        </div>

        {/* Quantity Selector */}
        <div style={{ marginBottom: "16px" }}>
          <Text>Quantity:</Text>
          <InputNumber
            min={1}
            value={quantity}
            onChange={(value) => setQuantity(value || 1)}
            style={{ marginLeft: "8px", width: "100px" }}
          />
        </div>

        <Divider />

        {/* Add to Cart Button */}
        <Button
          type="primary"
          onClick={handleAddToCart}
          style={{ width: "100%" }}
        >
          Add to Cart
        </Button>
      </Drawer>

      {/* Cart Drawer */}
      <Drawer
        title="Your Cart"
        placement="right"
        onClose={toggleDrawer}
        open={cartOpen}
        width={400}
      >
        <List
          dataSource={cart}
          renderItem={(item) => (
            <List.Item
              actions={[
                <InputNumber
                  min={1}
                  value={item.quantity}
                  onChange={(value) => updateQuantity(item.id, value || 1)}
                  style={{ width: "80px" }}
                />,
                <Popconfirm
                  title="Are you sure you want to remove this product?"
                  onConfirm={() => removeFromCart(item.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger type="text">
                    Remove
                  </Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={item.name}
                description={`Price: ৳${item.discountedPrice || item.price}`}
              />
              <div>
                Total: ৳
                {(item.discountedPrice || item.price) *
                  (item.quantity as number)}
              </div>
            </List.Item>
          )}
        />

        <Divider />

        {/* Total Price */}
        <div style={{ textAlign: "right", marginBottom: "16px" }}>
          <Title level={5}>Total: ৳{calculateTotal().toFixed(2)}</Title>
        </div>

        {/* Checkout Button */}
        <Button type="primary" style={{ width: "100%" }}>
          Checkout
        </Button>
      </Drawer>
    </div>
  );
};

export default AddToCartDrawer;
