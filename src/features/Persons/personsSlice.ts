import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios, { AxiosError } from "axios";

export interface personsState {
  persons: any;
  selectedRowsId: number[];
  status: "idle" | "loading" | "failed";
}

export const fetchPersons = createAsyncThunk(
  "persons/fetchPersons",
  async function (_, { rejectWithValue }) {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/records"
        // "https://api.github.com/users/GoykfisAlexander/repos"
      );
      return response.data;
    } catch (e: unknown) {
      const error = e as AxiosError;
      return rejectWithValue(error.message);
    }
  }
);
export const deletePersons = createAsyncThunk(
  "persons/deletePersons",
  async function (_, { rejectWithValue, getState, dispatch }) {
    const state: any = getState();
    state.persons.selectedRowsId.forEach(async (id: number) => {
      try {
        await axios.delete(`http://127.0.0.1:5000/records/${id}`);
      } catch (e: unknown) {
        const error = e as AxiosError;
        return rejectWithValue(error.message);
      }
    });
  }
);
export const addPerson = createAsyncThunk(
  "persons/addPerson",
  async function (_, { rejectWithValue }) {
    try {
      const response = await axios.post(`http://127.0.0.1:5000/records`, {});
      return response.data;
    } catch (e: unknown) {
      const error = e as AxiosError;
      return rejectWithValue(error.message);
    }
  }
);
export const updatePerson = createAsyncThunk(
  "persons/updatePerson",
  async function ({ id, row }: any, { rejectWithValue }) {
    try {
      await axios.put(`http://127.0.0.1:5000/records/${id}`, row);
      return { id, row };
    } catch (e: unknown) {
      const error = e as AxiosError;
      return rejectWithValue(error.message);
    }
  }
);
const initialState: personsState = {
  persons: {
    columns: [],
    rows: [],
  },
  selectedRowsId: [],
  status: "idle",
};
export const personsSlice = createSlice({
  name: "persons",
  initialState,
  reducers: {
    selectedRowsId(state, action) {
      state.selectedRowsId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPersons.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPersons.fulfilled, (state, action) => {
        const persons = [];
        for (const key in action.payload) {
          const person = Object.assign({ id: +key }, action.payload[key]);
          persons.push(person);
        }
        state.persons.rows = persons;
        state.persons.columns = [];
        for (const key in state.persons.rows[0]) {
          state.persons.columns.push({
            field: key,
            editable: key !== "id",
            headerName:
              key === "id" ? key : key.charAt(0).toUpperCase() + key.slice(1),
            type: typeof state.persons.rows[0][key],
            width: 130,
          });
        }
        state.status = "idle";
      })
      .addCase(fetchPersons.rejected, (state, action) => {
        state.status = "failed";
        console.log(action.payload);
      })
      .addCase(addPerson.fulfilled, (state, action) => {
        state.persons.rows.push({ id: action.payload });
      })
      .addCase(deletePersons.fulfilled, (state) => {
        state.persons.rows = state.persons.rows.filter(
          (person: any) => !state.selectedRowsId.includes(person.id)
        );
      })
      .addCase(updatePerson.fulfilled, (state, action) => {
        state.persons.rows[
          state.persons.rows.findIndex(
            (person: any) => person.id === action.payload.id
          )
        ] = action.payload.row;
      });
  },
});

export const { selectedRowsId } = personsSlice.actions;

export const selectPersons = (state: RootState) => state.persons.persons;
export const selectStatus = (state: RootState) => state.persons.status;

export default personsSlice.reducer;
