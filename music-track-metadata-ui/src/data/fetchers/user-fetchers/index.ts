import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { AuthCredentials, ResponseObject, User } from "../../../types";
import { handleFetchError } from "../_utils";

const BASE_URL = `${process.env.REACT_APP_API_URL}/user`;

export const fetchRegisterUser = createAsyncThunk('user/fetchRegisterUser', async (user: User) => {
    try {
        const response: AxiosResponse<ResponseObject<User>> = await axios.post(`${BASE_URL}/register`, user);
        return response.data;
    } catch(error) {
        return handleFetchError<User>(error); 
    }
});

export const fetchGetUser = createAsyncThunk('user/fetchGetUser', 
    async (auth: AuthCredentials) => {
        try{
            const response: AxiosResponse<ResponseObject<User>> = await axios.get(`${BASE_URL}/getUser/${auth.username}`,  {
                auth,
            });

            return response.data;
        } catch(error) {
            return handleFetchError<User>(error);            
        }
    }
);
