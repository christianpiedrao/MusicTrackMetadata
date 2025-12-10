import { Alert, AlertColor, AlertTitle } from "@mui/material";
import React from "react";
import { ResultType } from "../types";

export type PropsMessageAlert = {
    type?: ResultType,
    message?: string,
    time?: number,
}

export function MessageAlert({type, message, time}: PropsMessageAlert) {

    const [isRendered, setIsRendered] = React.useState<boolean>(false);

    const {severity, title} = React.useMemo<{ severity: AlertColor, title: string}>(() => {
        switch(type){
            case ResultType.INFO:
                return {
                    severity: "info",
                    title: "Info"
                };            
            case ResultType.SUCCESS:
                return {
                    severity: "success",
                    title: "Success"
                };        
            case ResultType.WARNING:
                return {
                    severity: "warning",
                    title: "Warning"
                };
            default:
                return {
                    severity: "error",
                    title: "Error"
                };
        }
    }, [type]);

    React.useEffect(() => {
        setIsRendered(Boolean(message) && type !== undefined);
    }, [message, type]);

    React.useEffect(() => {
        if (time && isRendered) {
            const timer = setTimeout(() => {
                setIsRendered(false);
            }, time * 1000);

            return () => clearTimeout(timer);
        }
    }, [isRendered, message, time, type]);

    return <>
        {isRendered &&
            <Alert severity={severity}>
                <AlertTitle>{title}</AlertTitle>
                {message}
            </Alert>
        }
    </>;
}