import axios, { AxiosError } from "axios";
import { ResponseObject, ResultType } from "../../types";

export function handleFetchError<T>(error: unknown) {
    if (error && axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.status === 400) {
            return axiosError.response?.data 
                ? axiosError.response?.data as ResponseObject<T>
                : {
                    resultType: ResultType.ERROR,
                    message: "Bad request."
                }
        } 
        if (axiosError.status === 401) {
            return {
                resultType: ResultType.NOT_AUTHORIZED,
                message: "The username or password are incorrect."
            }
        }
        if (axiosError.status === 403) {
            return {
                resultType: ResultType.ERROR,
                message: "You don't have the required permissions."
            }
        }
        if (axiosError.status === 500) {
            return axiosError.response?.data 
                ? axiosError.response?.data as ResponseObject<T>
                : {
                    resultType: ResultType.SEVERE,
                    message: "Internal Server Error"
                }
        } 
    } 
    
    return {
        resultType: ResultType.SEVERE,
    } as ResponseObject<T>;
}