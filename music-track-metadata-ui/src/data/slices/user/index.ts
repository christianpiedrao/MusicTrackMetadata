import { createSlice } from "@reduxjs/toolkit";
import { fetchGetUser, fetchRegisterUser } from "../../fetchers/user-fetchers";
import { AuthCredentials, ResponseObject, ResultType, Status, type User } from "../../../types";
import { getResultType } from "../../_utils";

export type UserSliceState = {
    isVerified: boolean,
    user?: User,
    status: Status,
    responseStatus?: ResultType,
    message?: string,
    authCredentials?: AuthCredentials,
}

const INITIAL_USER_SLICE: UserSliceState = {
    isVerified: false,
    user: undefined,
    status: Status.IDLE,
    responseStatus: undefined,
    message: undefined,
    authCredentials: undefined
}

const userSlice = createSlice({
    name: "user",
    initialState: INITIAL_USER_SLICE,
    reducers: {
        cleanUserData() {
            return INITIAL_USER_SLICE;
        },
        cleanUpFetchUserData(state) {
            state.status = INITIAL_USER_SLICE.status;
            state.responseStatus = INITIAL_USER_SLICE.responseStatus;
            state.message = INITIAL_USER_SLICE.message;
        },
        setUser(state, action) {
            state.user = action.payload;
        },
        setAuthCredentials(state, action) {
            state.authCredentials = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRegisterUser.pending, (state, action) => {
                state.status = Status.LOADING;
                state.responseStatus = INITIAL_USER_SLICE.responseStatus;
                state.message = INITIAL_USER_SLICE.message;
            })
            .addCase(fetchRegisterUser.fulfilled, (state, action) => {
                state.status = Status.IDLE;
                state.responseStatus = getResultType(action.payload.resultType);
                state.message = action.payload.message;
            })
            .addCase(fetchRegisterUser.rejected, (state, action) => {
                const data = action.payload as ResponseObject<User>;
                state.status = Status.IDLE;
                state.responseStatus = getResultType(data.resultType);
                state.message = data.message;
            })
            .addCase(fetchGetUser.pending, (state, action) => {
                state.status = Status.LOADING;
                state.user = INITIAL_USER_SLICE.user;
                state.responseStatus = INITIAL_USER_SLICE.responseStatus;
                state.message = INITIAL_USER_SLICE.message;
            })
            .addCase(fetchGetUser.fulfilled, (state, action) => {
                state.status = Status.IDLE;
                state.user = action.payload.data;
                state.responseStatus = getResultType(action.payload.resultType);
                state.message = action.payload.message;
            })
            .addCase(fetchGetUser.rejected, (state, action) => {
                const data = action.payload as ResponseObject<User>;
                state.status = Status.IDLE;
                state.user = INITIAL_USER_SLICE.user;
                state.responseStatus = getResultType(data.resultType);
                state.message = data.message;
            })
    }
});

export const {cleanUpFetchUserData, cleanUserData, setUser, setAuthCredentials} = userSlice.actions;
export default userSlice;