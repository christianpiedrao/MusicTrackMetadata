import { configureStore } from "@reduxjs/toolkit";
import musicTrackSlice from "./slices/music-track";
import userSlice from "./slices/user";

export const store = configureStore({
    reducer: {
        musicTrack: musicTrackSlice.reducer,
        user: userSlice.reducer,
    }
},);

export type AppDispatch = typeof store.dispatch;