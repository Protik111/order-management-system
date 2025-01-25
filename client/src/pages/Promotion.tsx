import { useState } from "react";
import Header from "../components/shared/Header";
import PromotionModal from "../components/promotion/PromotionModal";
import PromotionList from "../components/promotion/PromotionList";

const Promotion: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [promotionData, setPromotionData] = useState<any>(null);
  const [hasCreated, setHasCreated] = useState<boolean>(false);

  const showModal = () => {
    setIsModalOpen(true);
    setIsEdit(false); // Create mode
    setPromotionData(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditPromotion = (promotion: any) => {
    setIsModalOpen(true);
    setIsEdit(true); // Edit mode
    setPromotionData(promotion); // Pass the promotion data to the modal
  };

  const refreshData = () => {
    // Trigger PromotionList to refresh
    setHasCreated(!hasCreated);
  };

  return (
    <div className="py-10">
      <Header />
      <div className="px-6 py-10 lg:py-12 xl:py-15">
        <div className="flex items-center justify-between">
          <h1 className="text-xl">Promotion</h1>
          <button
            type="button"
            className="btn-dark-full text-regular max-w-max"
            onClick={showModal}
          >
            Create Promotion
          </button>
        </div>
        <hr className="mt-2 bg-[lightGray] h-[2px]" />
      </div>

      <PromotionList onEdit={handleEditPromotion} hasCreated={hasCreated} />

      <PromotionModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEdit={isEdit}
        productData={promotionData}
        refreshData={refreshData}
      />
    </div>
  );
};

export default Promotion;
