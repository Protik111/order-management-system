import React from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import UserData from "../UserData";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import { useCart } from "../../hooks/useCart";
import AddToCartDrawer from "./AddToCard";

const Header: React.FC = () => {
  const token = Cookies.get("user-cred");

  const { cart, cartOpen, setCartOpen } = useCart();

  const getTotalItems = (): number => {
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white py-6 shadow-md shadow-black/10 z-[1024] dark:bg-darkRaisin">
      <div className="container lg:flex justify-between md:items-center">
        <div className="brand-logo text-center">
          <Link to="/">
            <h2 className="text-2xl font-bold">Order Management</h2>
          </Link>
        </div>

        <div className="right_nav_controls self-center max-lg:-mt-8">
          <ul className="flex flex-row items-center gap-2 sm:gap-4 md:gap-4 dark:text-white">
            <Link to="/product" className="text-md dark:text-white">
              <li className="ml-auto hover:border border-theme px-4 py-1 rounded-full cursor-pointer">
                <span>Product</span>
              </li>
            </Link>
            <Link to="/promotion" className="text-md dark:text-white">
              <li className="ml-auto hover:border border-theme px-4 py-1 rounded-full cursor-pointer">
                <span>Promotion</span>
              </li>
            </Link>
            <Link to="/order" className="text-md dark:text-white">
              <li className="ml-auto hover:border border-theme px-4 py-1 rounded-full cursor-pointer">
                <span>Order</span>
              </li>
            </Link>

            {token ? (
              <UserData />
            ) : (
              <Link to="/login" className="text-md dark:text-white">
                <li className="ml-auto border border-theme px-4 py-1 rounded-full cursor-pointer">
                  <span>Login</span>
                </li>
              </Link>
            )}

            {token && (
              <Badge
                count={getTotalItems()}
                overflowCount={99}
                style={{
                  backgroundColor: "#f5222d",
                  color: "white",
                  fontSize: "12px",
                  minWidth: "20px",
                  height: "20px",
                  lineHeight: "20px",
                  borderRadius: "50%",
                  textAlign: "center",
                }}
              >
                <ShoppingCartOutlined
                  onClick={() => setCartOpen(true)}
                  style={{ fontSize: "24px", color: "#000", cursor: "pointer" }}
                />
              </Badge>
            )}

            {cartOpen && <AddToCartDrawer />}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
