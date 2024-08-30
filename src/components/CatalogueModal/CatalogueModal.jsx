import { Modal } from "semantic-ui-react";
import SupplierForm from "../Supplier/SupplierForm";
import EmployeeForm from "../Employee/EmployeeForm";
import "./CatalogueModal.css";

export default function CatalogueModal({
  isModalOpen,
  closeModal,
  selectedItem,
  catalogueType,
  onFormSubmit,
}) {

    let catalogueForm = '';

    if (catalogueType == 'suppliers') {
        catalogueForm = <SupplierForm selectedItem={selectedItem} closeModal={closeModal} onFormSubmit={onFormSubmit} catalogueType={catalogueType} />;
    }else if(catalogueType == 'employees'){
        catalogueForm = <EmployeeForm selectedItem={selectedItem} closeModal={closeModal} onFormSubmit={onFormSubmit} catalogueType={catalogueType} />;
    }
    // Agrega más tipos de catálogo

  return (
    <Modal open={isModalOpen} onClose={closeModal} size="small">
      <Modal.Header>Formulario</Modal.Header>
      <Modal.Content>
            {catalogueForm}
      </Modal.Content>
    </Modal>
  );
}