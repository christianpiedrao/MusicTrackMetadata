import { createSelector } from "@reduxjs/toolkit";
import { MusicTrackSliceState } from ".";
import { Status } from "../../../types";

const musicTrackState = (state: { musicTrack: MusicTrackSliceState; }) => state.musicTrack;

export const selectorMusicTrackIsrc = createSelector(musicTrackState, (state) => state.isrc);

export const selectorMusicTrack = createSelector(musicTrackState, (state) => state.musicTrack);

export const selectorCoverImage = createSelector(musicTrackState, (state) => state.coverImage);

export const selectorMusicTrackStatus = createSelector(musicTrackState, (state) => state.status);

export const selectorMusicTrackResponseStatus = createSelector(musicTrackState, (state) => state.responseStatus);

export const selectorMusicTrackMessage = createSelector(musicTrackState, (state) => state.message);

export const selectorMusicTrackIsLoading = createSelector(musicTrackState, (state) => state.status === Status.LOADING);

export const selectorMusicTrackImageStatus = createSelector(musicTrackState, (state) => state.imageStatus);

export const selectorMusicTrackImageIsLoading = createSelector(musicTrackState, (state) => state.imageStatus === Status.LOADING);

export const selectorMusicTrackImageResponseStatus = createSelector(musicTrackState, (state) => state.imageResponseStatus);
