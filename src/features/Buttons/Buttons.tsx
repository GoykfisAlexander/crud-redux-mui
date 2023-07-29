import { Button } from "@mui/material";
import { GridAddIcon, GridDeleteIcon } from "@mui/x-data-grid";
import { useAppDispatch } from "../../app/hooks";

import { addPerson, deletePersons } from "../Persons/personsSlice";

export function Buttons() {
  const dispatch = useAppDispatch();
  const handleAdd = () => {
    dispatch(addPerson());
  };

  const handleDelete = () => {
    dispatch(deletePersons());
  };

  return (
    <div>
      <Button
        sx={{ border: "none" }}
        startIcon={<GridAddIcon />}
        variant="outlined"
        color="primary"
        onClick={handleAdd}
      >
        add
      </Button>

      <Button
        sx={{ border: "none" }}
        startIcon={<GridDeleteIcon />}
        variant="outlined"
        color="secondary"
        onClick={handleDelete}
      >
        Delete
      </Button>
    </div>
  );
}
