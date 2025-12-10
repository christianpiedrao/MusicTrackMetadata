import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { AuthCredentials, MusicTrack, type ResponseObject } from "../../../types";
import { handleFetchError } from "../_utils";

const BASE_URL = `${process.env.REACT_APP_API_URL}/musictrack`;

export const fetchCreateMusicTrack = createAsyncThunk('musicTrack/fetchCreateMusicTrack', 
    async ({isrc, auth}: { isrc: string, auth: AuthCredentials}) => {
        try {
            const response: AxiosResponse<ResponseObject<MusicTrack>> = await axios.get(`${BASE_URL}/create/${isrc}`, {
                auth,
            });

            return response.data;
        } catch(error) {
            return handleFetchError<MusicTrack>(error);
        } 
    }
);

export const fetchMusicTrack = createAsyncThunk('musicTrack/fetchMusicTrack', 
    async ({isrc, auth}: { isrc: string, auth: AuthCredentials}) => {
        try {
            const response: AxiosResponse<ResponseObject<MusicTrack>> = await axios.get(`${BASE_URL}/getMetadata/${isrc}`, {
                auth,
            });

            return response.data;
        } catch(error) {
            return handleFetchError<MusicTrack>(error);
        } 
    }
);

export const fetchCoverImage = createAsyncThunk('musicTrack/fetchCoverImage', 
    async ({isrc, auth}: { isrc: string, auth: AuthCredentials}) => {
        try {
            const response: AxiosResponse<ResponseObject<string>> = await axios.get(`${BASE_URL}/getCover/${isrc}`, {
                auth,
            });

            return response.data;
        } catch(error) {
            return handleFetchError<string>(error);
        }
    }
);
