import React from 'react';
import BaseInternalContainer from '../components/BaseInternalContainer';
import BaseCard from '../components/BaseCard';
import { Backdrop, Box, Button, CircularProgress, FormControl, FormLabel, TextField, Typography } from '@mui/material';
import { MessageAlert } from '../components/MessageAlert';
import { useDispatch, useSelector } from 'react-redux';
import { selectorMusicTrack, selectorMusicTrackIsLoading, selectorMusicTrackMessage, selectorMusicTrackResponseStatus } from '../data/slices/music-track/_selectors';
import { selectorUserAuthCredentials } from '../data/slices/user/_selectors';
import { AppDispatch } from '../data';
import { fetchCreateMusicTrack } from '../data/fetchers/music-track-fetchers';
import { useNavigate } from 'react-router-dom';
import { ROUTE_HOME } from '../_routes';

export default function CreateMusicTrack(){
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [isrcError, setIsrcError] = React.useState(false);
    const [isrcErrorMessage, setIsrcErrorMessage] = React.useState("");

    const authCredentials = useSelector(selectorUserAuthCredentials);
    const message = useSelector(selectorMusicTrackMessage);
    const isLoading = useSelector(selectorMusicTrackIsLoading);
    const responseStatus = useSelector(selectorMusicTrackResponseStatus);
    const musicTrack = useSelector(selectorMusicTrack);

    const validateInputs = () => {
        const isrcElement = document.getElementById("isrc") as HTMLInputElement;

        let isValid = true;

        if (!isrcElement.value || isrcElement.value.length < 5 || !/^\w+$/.test(isrcElement.value)) {
            setIsrcError(true);
            setIsrcErrorMessage("Please enter a valid isrc code.");
            isValid = false;
        } else {
            setIsrcError(false);
            setIsrcErrorMessage("");
        }

        return isValid;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isrcError) return;

        const data = new FormData(event.currentTarget);
        const isrcCode = data.get("isrc")?.toString();

        if (authCredentials && isrcCode) {
            dispatch(fetchCreateMusicTrack({ isrc: isrcCode, auth: authCredentials}));
        }
    };   

    React.useEffect(() => {
        if (musicTrack) {
            navigate(ROUTE_HOME);
        }
    }, [musicTrack, navigate]);

    return (
        <BaseInternalContainer>
            <BaseCard variant="outlined">
                <Typography
                    component="h3"
                    variant="h4"
                    sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                >
                    Create
                </Typography>
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
                        <FormLabel htmlFor="isrc">ISRC</FormLabel>
                        <TextField
                            error={isrcError}
                            helperText={isrcErrorMessage}
                            id="isrc"
                            type="text"
                            name="isrc"
                            placeholder="Enter an isrc code"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={isrcError ? "error" : "primary"}
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={validateInputs}
                    >
                        Acept
                    </Button>
                </Box>
            </BaseCard>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </BaseInternalContainer>
    );
}
