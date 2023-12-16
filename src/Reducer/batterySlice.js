import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  batteryData: [],
  loading: false,
  error: null,
};

export const fetchBatteryData = createAsyncThunk(
  'battery/fetchBatteryData',
  async () => {
    try {
      const response = await axios.get('https://dev.electorq.com/dummy/battery');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const batterySlice = createSlice({
  name: 'battery',
  initialState,
  reducers: {
    // You can add additional reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatteryData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatteryData.fulfilled, (state, action) => {
        state.loading = false;
        try {
          const parsedData = JSON.parse(action.payload.body);
          if (Array.isArray(parsedData)) {
            state.batteryData = parsedData;
          } else {
            state.error = "Data is not in the expected format";
          }
        } catch (error) {
          state.error = "Error parsing data";
        }
      })
      .addCase(fetchBatteryData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { /* any other actions */ } = batterySlice.actions;
export default batterySlice.reducer;
