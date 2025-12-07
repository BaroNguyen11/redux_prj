import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '../../api';

// Config
const savedSettings = JSON.parse(localStorage.getItem('userSettings')) || {};

const initialState = {
    list: [],
    status: 'idle',
    error: null,
    pagination: {
        page: 1,
        limit: savedSettings.limit || 10,
        hasMore: true,
        pageCount: 1,
    },
    sorting: {
        sortBy: savedSettings.sortBy || 'createdAt',
        order: savedSettings.order || 'desc',
    },
    selectedUser: null,
    total: 0,
    cache: {},
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { getState, rejectWithValue }) => {
    try {
        const { pagination, sorting, cache, total } = getState().users;
        const key = `${pagination.page}-${pagination.limit}-${sorting.sortBy}-${sorting.order}`;
        if (cache[key]) {
            return {
                data: cache[key],
                total: total,
                key: key,
                fromCache: true
            };
        }
        const res = await userApi.getAll(
            pagination.page,
            pagination.limit,
            sorting.sortBy,
            sorting.order
        );
        const totalUsers = await userApi.getTotal();

        return {
            data: res.data,
            total: totalUsers,
            key: key,
            fromCache: false
        };
    } catch (err) {
        return rejectWithValue(err.message);
    }
}
);


export const addUser = createAsyncThunk('users/add', async (user) => await userApi.add(user));
export const updateUser = createAsyncThunk('users/update', async ({ id, data }) => await userApi.update(id, data));
export const deleteUser = createAsyncThunk('users/delete', async (id) => await userApi.delete(id));

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setPage: (state, action) => { state.pagination.page = action.payload; },
        setLimit: (state, action) => {
            state.pagination.limit = action.payload;
            state.pagination.page = 1;
        },
        setSorting: (state, action) => {
            state.sorting = action.payload;
            state.pagination.page = 1;
        },
        setSelectedUser: (state, action) => { state.selectedUser = action.payload; },
        invalidateCache: (state) => { state.cache = {}; state.total = 0; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { data, total, key } = action.payload;
                state.list = Array.isArray(data) ? data : [];

                state.total = total ?? 0;
                state.pagination.pageCount = Math.ceil(state.total / state.pagination.limit) || 1;
                if (!action.payload.fromCache) {
                    state.cache[key] = data;
                }
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // --- ADD ---
            .addCase(addUser.fulfilled, (state) => {
                state.status = 'idle';
                state.cache = {};
                state.total += 1;
            })
            // --- UPDATE ---
            .addCase(updateUser.fulfilled, (state) => {
                state.status = 'idle';
                state.selectedUser = null;
                state.cache = {};
            })
            // --- DELETE ---
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.list = state.list.filter(user => user.id !== action.meta.arg);
                state.cache = {};
                state.total -= 1;
            });
    },
});

export const { setPage, setLimit, setSorting, setSelectedUser, invalidateCache } = userSlice.actions;
export default userSlice.reducer;