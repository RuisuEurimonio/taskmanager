import ColorsTable from "../components/colorsTable";
import TableBoard from "../components/tableBoard";
import EtiquetaTable from "../components/tableLabel";
import TablePriority from "../components/tablePriority";

const GridLayout = () => {
  return (
    <div className="grid grid-cols-3 gap-4 mt-8">
      {/* Primer componente */}
      <div className="col-span-1">
        <TablePriority />
      </div>

      {/* Segundo componente */}
      <div className="col-span-1">
        <EtiquetaTable />
      </div>

      {/* Tercer componente (para futuras expansiones) */}
      <div className="col-span-1 bg-gray-800 p-4 rounded shadow-lg text-gray-300">
        <ColorsTable />
      </div>
    </div>
  );
};

export default GridLayout;
