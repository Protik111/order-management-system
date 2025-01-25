import React from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import UserData from "../UserData";

const Header: React.FC = () => {
  const token = Cookies.get("user-cred");

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
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
