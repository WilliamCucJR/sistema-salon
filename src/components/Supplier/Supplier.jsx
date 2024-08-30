import { useState } from "react";
import CatalogueTable from "../CatalogueTable";
import CatalogueModal from "../CatalogueModal/CatalogueModal";

export default function Supplier({ isSidebarVisible }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reload, setReload] = useState(false);

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleReload = () => {
    console.log("handleReload");
    setReload(!reload);
  };

  const catalogueType = "suppliers";

  return (
    <div>
      <h1>Proveedores</h1>
      <CatalogueTable
        openModal={openModal}
        isSidebarVisible={isSidebarVisible}
        catalogueType={catalogueType}
        reload={reload}
      />
      <CatalogueModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        selectedItem={selectedItem}
        catalogueType={catalogueType}
        onFormSubmit={handleReload}
      />
    </div>
  );
}