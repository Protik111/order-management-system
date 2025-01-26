import { useState } from "react";
import Header from "../components/shared/Header";
import ProductCart from "../components/order/ProductCart";

const Order: React.FC = () => {
  // const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toggleItems, setToggleItems] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const [productData, setProductData] = useState<any>(null);
  // const [hasCreated, setHasCreated] = useState<boolean>(false);

  const handleToggleItems = () => {
    setToggleItems(!toggleItems);
  };

  return (
    <div className="py-10">
      <Header />
      <div className="px-6 py-10 lg:py-12 xl:py-15">
        <div className="flex items-center justify-between">
          <h1 className="text-xl">Order</h1>
          <button
            type="button"
            className="btn-dark-full text-regular max-w-max"
            onClick={handleToggleItems}
          >
            {toggleItems ? "See orders" : "See items"}
          </button>
        </div>
        <hr className="mt-2 bg-[lightGray] h-[2px]" />
      </div>

      {toggleItems ? (
        <ProductCart></ProductCart>
      ) : (
        // <ProductList hasCreated={hasCreated} />
        <></>
      )}
    </div>
  );
};

export default Order;
