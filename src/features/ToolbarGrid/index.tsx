import {
  DataGrid,
  GridLoadingOverlay,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchPersons,
  selectPersons,
  selectStatus,
  selectedRowsId,
  updatePerson,
} from "../Persons/personsSlice";
import { CustomToolbar } from "../CustomToolbar/CustomToolbar";

export default function ToolbarGrid() {
  const dispatch = useAppDispatch();
  const persons = useAppSelector(selectPersons);
  const status = useAppSelector(selectStatus);

  useEffect(() => {
    dispatch(fetchPersons());
  }, [dispatch]);

  const handleSelectionModelChange = (newSelectionModel: any) => {
    dispatch(selectedRowsId(newSelectionModel));
  };
  const handleProcessRowUpdate = (newRow: GridValidRowModel) => {
    dispatch(updatePerson({ id: newRow.id, row: newRow }));
    return newRow;
  };
  const handleProcessRowUpdateError = (error: unknown) => {
    console.error(error);
  };
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        {...persons}
        // columns={persons.columns}
        // rows={persons.rows}
        loading={status === "loading"}
        components={{
          LoadingOverlay: GridLoadingOverlay,
        }}
        processRowUpdate={handleProcessRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        checkboxSelection
        onRowSelectionModelChange={handleSelectionModelChange}
        slots={{
          toolbar: () => <CustomToolbar />,
        }}
      />
    </div>
  );
}
