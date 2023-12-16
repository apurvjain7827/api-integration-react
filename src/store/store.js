import { configureStore } from '@reduxjs/toolkit';
import batteryReducer from '../Reducer/batterySlice';

const store = configureStore({
  reducer: {
    battery: batteryReducer,
  },

});

export default store;
