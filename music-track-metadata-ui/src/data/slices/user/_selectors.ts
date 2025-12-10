import { createSelector } from "@reduxjs/toolkit";
import { UserSliceState } from ".";
import { Status } from "../../../types";

const userState = (state: { user: UserSliceState; }) => state.user;

export const selectorUser = createSelector(userState, (state) => state.user);

export const selectorUserStatus = createSelector(userState, (state) => state.status);

export const selectorUserResponseStatus = createSelector(userState, (state) => state.responseStatus);

export const selectorUserMessage = createSelector(userState, (state) => state.message);

export const selectorUserIsLoading = createSelector(userState, (state) => state.status === Status.LOADING);

export const selectorUserAuthCredentials = createSelector(userState, (state) => state.authCredentials);
