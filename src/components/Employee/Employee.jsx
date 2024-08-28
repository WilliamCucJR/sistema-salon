import CatalogueTable from "../CatalogueTable";

export default function Employee({ isSidebarVisible }) {
    const catalogueType = 'employees';
    return (
        <div>
            <h1>Desde componente Supplier</h1>
            <CatalogueTable isSidebarVisible={isSidebarVisible} catalogueType={catalogueType}/>
        </div>
    );
};
