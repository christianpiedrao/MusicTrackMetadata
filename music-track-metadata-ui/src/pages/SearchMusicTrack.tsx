import React from "react";
import { Card, CardContent, Container, Typography, TextField, InputAdornment, IconButton, CardMedia, Stack, Divider, Dialog, DialogContent, CardActions, Button, Backdrop, CircularProgress } from "@mui/material";
import { fetchMusicTrack, fetchCoverImage } from "../data/fetchers/music-track-fetchers";
import { type AppDispatch } from "../data";
import { useDispatch, useSelector } from "react-redux";
import { selectorMusicTrack, 
    selectorCoverImage,
    selectorMusicTrackMessage, 
    selectorMusicTrackResponseStatus, 
    selectorMusicTrackIsLoading, 
    selectorMusicTrackImageIsLoading,
    selectorMusicTrackImageResponseStatus
} from "../data/slices/music-track/_selectors";
import { Search, Close } from "@mui/icons-material";
import { selectorUserAuthCredentials } from "../data/slices/user/_selectors";
import { MessageAlert } from "../components/MessageAlert";
import BaseInternalContainer from '../components/BaseInternalContainer';
import ScreenSearchDesktopIcon from '@mui/icons-material/ScreenSearchDesktop';
import { cleanMusicTrackData } from "../data/slices/music-track";

export default function SearchMusicTrack() {
    const dispatch = useDispatch<AppDispatch>();

    const musicTrack = useSelector(selectorMusicTrack);
    const coverImage = useSelector(selectorCoverImage);
    const authCredentials = useSelector(selectorUserAuthCredentials);
    const message = useSelector(selectorMusicTrackMessage);
    const isLoading = useSelector(selectorMusicTrackIsLoading);
    const isImageLoading = useSelector(selectorMusicTrackImageIsLoading);    
    const responseStatus = useSelector(selectorMusicTrackResponseStatus);
    const imageResponseStatus = useSelector(selectorMusicTrackImageResponseStatus);    

    const [searchValue, setSearchValue] = React.useState("");
    const [open, setOpen] = React.useState(false);

    //"USMC18620549"
    const handleSearch = () => {
        if (authCredentials && searchValue) {
            setSearchValue("");
            dispatch(fetchMusicTrack({ isrc: searchValue, auth: authCredentials}));
        }
    }

    const handleImageClick = () => {
        if (coverImage) setOpen(true);
    };

    const handleCleanSearch = () => {
        dispatch(cleanMusicTrackData())
    };

    const disabledSearch = React.useMemo(() => 
        !searchValue || searchValue.length < 3, 
    [searchValue]);

    const cardImage = React.useMemo(() => 
        coverImage 
                ? `data:image/jpg;base64, ${coverImage}` 
                : "/musical-note.jpg", 
    [coverImage]);

    const isExplicitLabel = React.useMemo(() => {
        if (musicTrack?.isExplicit === true) return "Yes";
        if (musicTrack?.isExplicit === false) return "No";
        return undefined;
    }, [musicTrack?.isExplicit]);

    React.useEffect(() => {
        if (musicTrack && musicTrack.isrc && !coverImage && authCredentials && !isImageLoading && !imageResponseStatus) {
            dispatch(fetchCoverImage({ isrc: musicTrack.isrc, auth: authCredentials}));
        }
    }, [authCredentials, coverImage, dispatch, imageResponseStatus, isImageLoading, musicTrack]);

    return (
        <BaseInternalContainer>
            <Container
                maxWidth="sm"
                sx={{ display: 'flex', flexDirection: 'column', my: 4, gap: 2 }}
            >
                <Typography variant="h3">
                    Search
                </Typography>
                <TextField
                    label="Search by isrc"
                    variant="outlined" 
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    slotProps={{
                        input: {
                            endAdornment: (
                            <InputAdornment position="start">
                                <InputAdornment position="end">
                                    <IconButton 
                                        aria-label="search" 
                                        disabled={disabledSearch} 
                                        type="button"
                                        onClick={handleSearch}>
                                        <Search />
                                    </IconButton>

                                    {musicTrack && <IconButton 
                                        aria-label="clean" 
                                        type="button"
                                        onClick={handleCleanSearch}>
                                        <Close />
                                    </IconButton>}
                                </InputAdornment>
                            </InputAdornment>
                            ),
                        },
                    }}
                />
                <MessageAlert type={responseStatus} message={message} time={10} />
                {!musicTrack && <Card variant="outlined">
                    <Stack sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '50vh',
                        gap: 6,
                        paddingY: 4,
                    }}>
                        <ScreenSearchDesktopIcon sx={{ fontSize: 100 }} color="disabled" />
                        <Typography variant="h4" gutterBottom>
                            Try searching something!
                        </Typography>
                    </Stack>                    
                </Card>}
                {musicTrack && <Card variant="outlined">
                    <CardMedia
                        image={cardImage}
                        sx={{ height: 250 }}
                        title="Cover image"
                        onClick={handleImageClick}
                    /> 
                    <CardContent>
                        <Typography component="div" variant="h5">
                            {musicTrack?.name}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            component="div"
                            sx={{ color: 'text.secondary' }}
                        >
                            {musicTrack?.artistName}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            component="div"
                            sx={{ color: 'text.secondary' }}
                        >
                            {musicTrack?.isrc}
                        </Typography>
                        <Divider />         
                        <Typography
                            variant="subtitle1"
                            component="div"
                            sx={{ 
                                fontWeight: 'bold',
                                paddingTop: 2
                            }}
                        >
                            Album Name
                        </Typography>   
                        <Typography
                            variant="subtitle1"
                            component="div"
                            sx={{ color: 'text.secondary' }}
                        >
                            {musicTrack?.albumName}
                        </Typography>         
                        <Typography
                            variant="subtitle1"
                            component="div"
                            sx={{ fontWeight: 'bold' }}
                        >
                            Explicit
                        </Typography>   
                        <Typography
                            variant="subtitle1"
                            component="div"
                            sx={{ color: 'text.secondary' }}
                        >
                            {isExplicitLabel}
                        </Typography>  
                        <Typography
                            variant="subtitle1"
                            component="div"
                            sx={{ fontWeight: 'bold' }}
                        >
                            Playback Seconds
                        </Typography>   
                        <Typography
                            variant="subtitle1"
                            component="div"
                            sx={{ color: 'text.secondary' }}
                        >
                            {musicTrack?.playbackSeconds}
                        </Typography> 
                    </CardContent>
                    {coverImage && <CardActions>
                        <Button size="medium" onClick={() => setOpen(true)}>Full size image</Button>
                    </CardActions>}
                </Card>}  
            </Container>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={isLoading || isImageLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Dialog
                maxWidth="sm"
                open={open}
                onClose={() => setOpen(false)}
            >
                <DialogContent>
                    <img alt="Cover" src={cardImage} style={{maxWidth: '100%', height: 'auto'}} />
                </DialogContent>
            </Dialog>
        </BaseInternalContainer>
        
    );
}
