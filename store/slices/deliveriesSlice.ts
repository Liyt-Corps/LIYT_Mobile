import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { Delivery, DeliveryState } from '../../types';

const initialState: DeliveryState = {
    deliveries: [],
    history: [],
    currentDelivery: null,
    loading: false,
    error: null,
};

export const fetchDeliveries = createAsyncThunk(
    'deliveries/fetchDeliveries',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/drivers/deliveries');
            return response.data as Delivery[];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch deliveries');
        }
    }
);

export const fetchDeliveryHistory = createAsyncThunk(
    'deliveries/fetchDeliveryHistory',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/drivers/deliveries/history');
            return response.data.data as Delivery[];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch delivery history');
        }
    }
);

export const fetchDeliveryById = createAsyncThunk(
    'deliveries/fetchDeliveryById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/drivers/deliveries/${id}`);
            return response.data as Delivery;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch delivery details');
        }
    }
);

export const acceptDelivery = createAsyncThunk(
    'deliveries/acceptDelivery',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/drivers/deliveries/${id}/accept`);
            return response.data as Delivery;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to accept delivery');
        }
    }
);

export const pickupDelivery = createAsyncThunk(
    'deliveries/pickupDelivery',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/drivers/deliveries/${id}/pickup`);
            return response.data as Delivery;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark as picked up');
        }
    }
);

export const completeDelivery = createAsyncThunk(
    'deliveries/completeDelivery',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/drivers/deliveries/${id}/complete`);
            return response.data as Delivery;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to complete delivery');
        }
    }
);

const deliveriesSlice = createSlice({
    name: 'deliveries',
    initialState,
    reducers: {
        clearCurrentDelivery: (state) => {
            state.currentDelivery = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDeliveries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDeliveries.fulfilled, (state, action) => {
                state.loading = false;
                state.deliveries = action.payload;
            })
            .addCase(fetchDeliveries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchDeliveryHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDeliveryHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.history = action.payload;
            })
            .addCase(fetchDeliveryHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchDeliveryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDeliveryById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentDelivery = action.payload;
            })
            .addCase(fetchDeliveryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(acceptDelivery.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(acceptDelivery.fulfilled, (state, action) => {
                state.loading = false;
                state.currentDelivery = action.payload;
                const index = state.deliveries.findIndex(d => d.id === action.payload.id);
                if (index !== -1) {
                    state.deliveries[index] = action.payload;
                }
            })
            .addCase(acceptDelivery.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(pickupDelivery.fulfilled, (state, action) => {
                state.currentDelivery = action.payload;
                const index = state.deliveries.findIndex(d => d.id === action.payload.id);
                if (index !== -1) {
                    state.deliveries[index] = action.payload;
                }
            })
            .addCase(completeDelivery.fulfilled, (state, action) => {
                state.currentDelivery = action.payload;
                const index = state.deliveries.findIndex(d => d.id === action.payload.id);
                if (index !== -1) {
                    state.deliveries[index] = action.payload;
                }
            });
    },
});

export const { clearCurrentDelivery, clearError } = deliveriesSlice.actions;
export default deliveriesSlice.reducer;
