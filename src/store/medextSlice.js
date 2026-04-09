import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as medextApi from '../services/medextApi';

const initialState = {
  currentResult: null,
  history: [],
  health: null,
  status: 'idle',
  error: null,
  // image extraction
  imageResult: null,
  imageStatus: 'idle',
  imageError: null,
};

export const checkSystemHealth = createAsyncThunk(
  'medext/checkHealth',
  async (_, { rejectWithValue }) => {
    try {
      return await medextApi.checkHealth();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const performExtraction = createAsyncThunk(
  'medext/extract',
  async (payload, { rejectWithValue }) => {
    try {
      return await medextApi.extractMedicalInfo(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const performImageExtraction = createAsyncThunk(
  'medext/extractImage',
  async (formData, { rejectWithValue }) => {
    try {
      return await medextApi.extractFromImage(formData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const medextSlice = createSlice({
  name: 'medext',
  initialState,
  reducers: {
    clearCurrentResult: (state) => {
      state.currentResult = null;
    },
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
    clearImageResult: (state) => {
      state.imageResult = null;
      state.imageStatus = 'idle';
      state.imageError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkSystemHealth.fulfilled, (state, action) => {
        state.health = action.payload;
      })
      .addCase(performExtraction.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(performExtraction.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentResult = action.payload;
        state.history.unshift({
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          input: action.meta.arg.text,
          result: action.payload,
        });
      })
      .addCase(performExtraction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // image extraction
      .addCase(performImageExtraction.pending, (state) => {
        state.imageStatus = 'loading';
        state.imageError = null;
      })
      .addCase(performImageExtraction.fulfilled, (state, action) => {
        state.imageStatus = 'succeeded';
        state.imageResult = action.payload;
      })
      .addCase(performImageExtraction.rejected, (state, action) => {
        state.imageStatus = 'failed';
        state.imageError = action.payload;
      });
  },
});

export const { clearCurrentResult, resetStatus, clearImageResult } = medextSlice.actions;
export default medextSlice.reducer;