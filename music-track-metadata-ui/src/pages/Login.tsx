import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoginBaseContainer from "../components/LoginBaseContainer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../data";
import { fetchGetUser } from "../data/fetchers/user-fetchers";
import { selectorUserIsLoading, selectorUserMessage, selectorUserResponseStatus } from "../data/slices/user/_selectors";
import { MessageAlert } from "../components/MessageAlert";
import { Backdrop, CircularProgress } from "@mui/material";
import { ROUTE_REGISTER } from "../_routes";
import { setAuthCredentials } from "../data/slices/user";

export default function Login() {    
    const dispatch = useDispatch<AppDispatch>();

    const [usernameError, setUsernameError] = React.useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = React.useState("");
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");

    const message = useSelector(selectorUserMessage);
    const isLoading = useSelector(selectorUserIsLoading);
    const responseStatus = useSelector(selectorUserResponseStatus);

    const validateInputs = () => {
        const username = document.getElementById("username") as HTMLInputElement;
        const password = document.getElementById("password") as HTMLInputElement;

        let isValid = true;

        if (!username.value || username.value.length < 8 || !/^\w+$/.test(username.value)) {
            setUsernameError(true);
            setUsernameErrorMessage("Please enter a valid username.");
            isValid = false;
        } else {
            setUsernameError(false);
            setUsernameErrorMessage("");
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage("Password must be at least 6 characters long.");
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage("");
        }

        return isValid;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (usernameError || passwordError) return;

        const data = new FormData(event.currentTarget);
        const username = data.get("username")?.toString();
        const password = data.get("password")?.toString();

        if (username && password) {
            const authCredentials = {
                username,
                password
            };
            dispatch(setAuthCredentials(authCredentials));
            dispatch(fetchGetUser(authCredentials));
        }
    };   

    return (
        <LoginBaseContainer title="Sign in">
            <MessageAlert type={responseStatus} message={message} time={10} />
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: 4,
                }}
            >
                <FormControl>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <TextField
                        error={usernameError}
                        helperText={usernameErrorMessage}
                        id="username"
                        type="text"
                        name="username"
                        placeholder="Your access username"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        color={usernameError ? "error" : "primary"}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <TextField
                        error={passwordError}
                        helperText={passwordErrorMessage}
                        name="password"
                        placeholder="••••••"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        required
                        fullWidth
                        variant="outlined"
                        color={passwordError ? "error" : "primary"}
                    />
                </FormControl>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    onClick={validateInputs}
                >
                    Sign in
                </Button>
            </Box>
            <Divider>or</Divider>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography sx={{ textAlign: "center" }}>
                    Don&apos;t have an account?{" "}
                    <Link
                        href={ROUTE_REGISTER}
                        variant="body2"
                        sx={{ alignSelf: "center" }}
                    >
                        Sign up
                    </Link>
                </Typography>
            </Box>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </LoginBaseContainer>
    );    
}
