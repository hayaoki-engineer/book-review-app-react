import { configureStore, createSlice } from "@reduxjs/toolkit";

// ページネーションの状態を管理するslice
const paginationSlice = createSlice({
  name: "pagination",
  initialState: {
    currentPage: 1, // 現在のページ
    offset: 0, // APIのオフセット値
  },
  reducers: {
    nextPage: (state) => {
      state.currentPage += 1;
      state.offset += 10; // 次の10件を表示
    },
    prevPage: (state) => {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
        state.offset -= 10;
      }
    },
  },
});

export const { nextPage, prevPage } = paginationSlice.actions;

export const store = configureStore({
  reducer: {
    pagination: paginationSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
