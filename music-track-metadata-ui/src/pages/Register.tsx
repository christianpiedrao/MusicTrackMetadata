import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import LoginBaseContainer from "../components/LoginBaseContainer";
import { AuthCredentials, PermissionType, ResultType, User } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../data";
import { fetchRegisterUser } from "../data/fetchers/user-fetchers";
import { selectorUserIsLoading, selectorUserMessage, selectorUserResponseStatus } from "../data/slices/user/_selectors";
import { MessageAlert } from "../components/MessageAlert";
import { Backdrop, CircularProgress } from "@mui/material";
import MessageContainer from "../components/MessageContainer";
import { setAuthCredentials, setUser } from "../data/slices/user";
import { useNavigate } from "react-router-dom";
import { ROUTE_HOME } from "../_routes";

export default function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [nameError, setNameError] = React.useState(false);
    const [nameErrorMessage, setNameErrorMessage] = React.useState("");
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
    const [usernameError, setUsernameError] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);
    const [repeatPasswordError, setRepeatPasswordError] = React.useState(false);
    const [repeatPasswordErrorMessage, setRepeatPasswordErrorMessage] = React.useState("");
    const [userData, setUserData] = React.useState<User>();
    const [authCredentialsData, setAuthCredentialsData] = React.useState<AuthCredentials>();

    const message = useSelector(selectorUserMessage);
    const isLoading = useSelector(selectorUserIsLoading);
    const responseStatus = useSelector(selectorUserResponseStatus);

    const validateInputs = () => {
        const name = document.getElementById("name") as HTMLInputElement;
        const email = document.getElementById("email") as HTMLInputElement;
        const username = document.getElementById("username") as HTMLInputElement;
        const password = document.getElementById("password") as HTMLInputElement;
        const repeatPassword = document.getElementById("repeatpassword") as HTMLInputElement;

        let isValid = true;

        if (!name.value || !/^[A-Za-z\s]*$/.test(name.value)) {
            setNameError(true);
            setNameErrorMessage("Please enter a valid name.");
            isValid = false;            
        } else {
            setNameError(false);
            setNameErrorMessage("");
        }

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage("Please enter a valid email address.");
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage("");
        }

        if (!username.value || username.value.length < 8 || !/^\w+$/.test(username.value)) {
            setUsernameError(true);
            isValid = false;
        } else {
            setUsernameError(false);
        }

        if (!password.value || password.value.length < 8) {
            setPasswordError(true);
            isValid = false;
        } else {
            setPasswordError(false);
        }

        if (password.value && (!repeatPassword.value || repeatPassword.value !== password.value)) {
            setRepeatPasswordError(true);
            setRepeatPasswordErrorMessage("The passwords are not the same.");
            isValid = false;
        } else {
            setRepeatPasswordError(false);
            setRepeatPasswordErrorMessage("");
        }

        return isValid;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (nameError || emailError || usernameError || passwordError || repeatPasswordError) {
            return;
        }
        
        const data = new FormData(event.currentTarget);
        const userFormData: User = {
            name: data.get("name")?.toString(),
            email: data.get("email")?.toString(),
            username: data.get("username")?.toString(),
            password: data.get("password")?.toString(),
            permission: PermissionType.ALL,
        };

        if (userFormData && userFormData.name && userFormData.password) {
            setAuthCredentialsData({username: userFormData.name, password: userFormData.password})
            setUserData(userFormData);
            dispatch(fetchRegisterUser(userFormData));
        }
    };

    const handleSuccessClick = () => {
        if (userData && authCredentialsData) {
            dispatch(setAuthCredentials(authCredentialsData));
            dispatch(setUser(userData));
            navigate(ROUTE_HOME);
        }       
    }

    if (responseStatus === ResultType.SUCCESS) {
        return <MessageContainer 
                    variation='success' 
                    title={message ?? 'User created successfully'}
                    onClick={handleSuccessClick} />;
    }

    return (
        <LoginBaseContainer title="Sign up">
            <MessageAlert type={responseStatus} message={message} time={10} />           
            <Box
                component="form"            
                onSubmit={handleSubmit}
                noValidate
                sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: 2,
                }}
            >
                <FormControl>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <TextField
                        error={nameError}
                        helperText={nameErrorMessage}
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Your name"
                        required
                        fullWidth
                        variant="outlined"
                        color={nameError ? "error" : "primary"}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <TextField
                        error={emailError}
                        helperText={emailErrorMessage}
                        id="email"
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        required
                        fullWidth
                        variant="outlined"
                        color={emailError ? "error" : "primary"}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <TextField
                        error={usernameError}
                        helperText="Username must be alphanumeric and at least 8 characters long."
                        id="username"
                        type="text"
                        name="username"
                        placeholder="Your access username"
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
                        helperText="Password must be at least 8 characters long."
                        name="password"
                        placeholder="••••••"
                        type="password"
                        id="password"
                        required
                        fullWidth
                        variant="outlined"
                        color={passwordError ? "error" : "primary"}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="repeatpassword">Repeat Password</FormLabel>
                    <TextField
                        error={repeatPasswordError}
                        helperText={repeatPasswordErrorMessage}
                        name="repeatpassword"
                        placeholder="••••••"
                        type="password"
                        id="repeatpassword"
                        required
                        fullWidth
                        variant="outlined"
                        color={repeatPasswordError ? "error" : "primary"}
                    />
                </FormControl>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    onClick={validateInputs}
                >
                    Continue
                </Button>
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
