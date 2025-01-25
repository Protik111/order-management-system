import { useState } from "react";
import Header from "../components/shared/Header";
import ProductModal from "../components/product/ProductModal";
import ProductList from "../components/product/ProductList";

const Product: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [productData, setProductData] = useState<any>(null); // For editing product
  const [hasCreated, setHasCreated] = useState<boolean>(false);

  const showModal = () => {
    setIsModalOpen(true);
    setIsEdit(false); // Ensure it's in create mode
    setProductData(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (product: any) => {
    setIsModalOpen(true);
    setIsEdit(true);
    setProductData(product); // Pass the product data for editing
  };

  const handleSuccess = () => {
    setHasCreated(!hasCreated); // Trigger product list refresh
  };

  return (
    <div className="py-10">
      <Header />
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

      <ProductList hasCreated={hasCreated} onEdit={handleEdit} />

      <ProductModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        isEdit={isEdit}
        productData={productData}
      />
    </div>
  );
};

export default Product;
