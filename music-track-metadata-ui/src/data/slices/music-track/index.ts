import { createSlice } from "@reduxjs/toolkit";
import { fetchMusicTrack, fetchCoverImage, fetchCreateMusicTrack } from "../../fetchers/music-track-fetchers";
import { MusicTrack, ResponseObject, ResultType, Status } from "../../../types";
import { getResultType } from "../../_utils";

export type MusicTrackSliceState = {
    isrc?: string,
    coverImage?: string,
    musicTrack?: MusicTrack,
    status: Status,
    responseStatus?: ResultType,
    message?: string,
    imageStatus: Status,
    imageResponseStatus?: ResultType,
}

const INITIAL_MUSIC_TRACK_SLICE: MusicTrackSliceState = {
    isrc: "",
    coverImage: undefined,
    musicTrack: undefined,
    status: Status.IDLE,
    responseStatus: undefined,
    message: undefined,
    imageStatus: Status.IDLE,
    imageResponseStatus: undefined,
}

const musicTrackSlice = createSlice({
    name: "musicTrack",
    initialState: INITIAL_MUSIC_TRACK_SLICE,
    reducers: {
        cleanMusicTrackData() {
            return INITIAL_MUSIC_TRACK_SLICE;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCreateMusicTrack.pending, (state, action) => {
                state.status = Status.LOADING;
                state.musicTrack = INITIAL_MUSIC_TRACK_SLICE.musicTrack;
                state.responseStatus = INITIAL_MUSIC_TRACK_SLICE.responseStatus;
                state.message = INITIAL_MUSIC_TRACK_SLICE.message;
            })
            .addCase(fetchCreateMusicTrack.fulfilled, (state, action) => {
                state.status = Status.IDLE;
                state.musicTrack = action.payload.data;
                state.responseStatus = getResultType(action.payload.resultType);
                state.message = action.payload.message;
            })
            .addCase(fetchCreateMusicTrack.rejected, (state, action) => {
                const data = action.payload as ResponseObject<MusicTrack>;
                state.status = Status.IDLE;
                state.musicTrack = INITIAL_MUSIC_TRACK_SLICE.musicTrack;
                state.responseStatus = getResultType(data.resultType);
                state.message = data.message;
            })
            .addCase(fetchMusicTrack.pending, (state, action) => {
                state.status = Status.LOADING;
                state.musicTrack = INITIAL_MUSIC_TRACK_SLICE.musicTrack;
                state.responseStatus = INITIAL_MUSIC_TRACK_SLICE.responseStatus;
                state.message = INITIAL_MUSIC_TRACK_SLICE.message;
            })
            .addCase(fetchMusicTrack.fulfilled, (state, action) => {
                state.status = Status.IDLE;
                state.musicTrack = action.payload.data;
                state.responseStatus = getResultType(action.payload.resultType);
                state.message = action.payload.message;
            })
            .addCase(fetchMusicTrack.rejected, (state, action) => {
                const data = action.payload as ResponseObject<MusicTrack>;
                state.status = Status.IDLE;
                state.musicTrack = INITIAL_MUSIC_TRACK_SLICE.musicTrack;
                state.responseStatus = getResultType(data.resultType);
                state.message = data.message;
            })
            .addCase(fetchCoverImage.pending, (state, action) => {
                state.imageStatus = Status.LOADING;
                state.imageResponseStatus = INITIAL_MUSIC_TRACK_SLICE.imageResponseStatus;
                state.coverImage = INITIAL_MUSIC_TRACK_SLICE.coverImage;
            })
            .addCase(fetchCoverImage.fulfilled, (state, action) => {
                state.imageStatus = Status.IDLE;
                state.imageResponseStatus = getResultType(action.payload.resultType);
                state.coverImage = action.payload.data;
            })
            .addCase(fetchCoverImage.rejected, (state, action) => {
                const data = action.payload as ResponseObject<string>;
                state.imageStatus = Status.IDLE;
                state.imageResponseStatus = getResultType(data.resultType);
                state.coverImage = INITIAL_MUSIC_TRACK_SLICE.coverImage;
            })
    }
});

export const {cleanMusicTrackData} = musicTrackSlice.actions;
export default musicTrackSlice;