import * as React from 'react';

import { StackProps } from "@mui/material";
import BaseContainer from "./BaseContainer";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import { ROUTE_CREATE, ROUTE_HOME, ROUTE_LOGIN } from '../_routes';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectorUser } from '../data/slices/user/_selectors';
import { AppDispatch } from '../data';
import { cleanMusicTrackData } from '../data/slices/music-track';
import { cleanUserData } from '../data/slices/user';
import { selectorMusicTrackResponseStatus } from '../data/slices/music-track/_selectors';
import Error from '../pages/Error';
import { ResultType } from '../types';

const pages = [
    {name: "Search", route: ROUTE_HOME}, 
    {name: "Create", route: ROUTE_CREATE}
];

const BaseInternalContainer = React.memo(function BaseInternalContainer({children, ...rest}: React.PropsWithChildren<StackProps>) {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const responseStatus = useSelector(selectorMusicTrackResponseStatus);

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

    const user = useSelector(selectorUser);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleClickMenu = (page: {name: string, route: string}) => {
        dispatch(cleanMusicTrackData());
        navigate(page.route);
        setAnchorElNav(null);
    };

    const handleLogOut = () => {
        dispatch(cleanUserData());
    }

    React.useEffect(() => {
        if (!user) {
            navigate(ROUTE_LOGIN);
            dispatch(cleanMusicTrackData());
            dispatch(cleanUserData());
        }
    }, [dispatch, navigate, user]);
    
    if (responseStatus === ResultType.SEVERE) {
        return <Error />;
    }

    return (
        <BaseContainer>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar>
                        <AudiotrackIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            }}
                        >
                            MUSIC TRACK
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{ display: { xs: 'block', md: 'none' } }}
                                >
                                {pages.map((page) => (
                                    <MenuItem key={page.name} onClick={() => handleClickMenu(page)}>
                                        <Typography sx={{ textAlign: 'center' }}>{page.name}</Typography>
                                    </MenuItem>
                                ))}
                                <MenuItem onClick={handleLogOut}>
                                    <Typography sx={{ textAlign: 'center' }}>Log Out</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                        <AudiotrackIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            }}
                        >
                            MUSIC TRACK
                        </Typography>
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => (
                            <Button
                                key={page.name}
                                onClick={() => handleClickMenu(page)}
                                sx={{ color: 'white' }}
                            >
                                {page.name}
                            </Button>
                            ))}
                            <Button
                                onClick={handleLogOut}
                                sx={{ color: 'white' }}
                            >
                                LOG OUT
                            </Button>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            {children}
        </BaseContainer>
    );
});

export default BaseInternalContainer;
