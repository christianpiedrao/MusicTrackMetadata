import React from 'react';
import { styled } from '@mui/material';
import MuiCard from '@mui/material/Card';

const BaseCard = React.memo(
    styled(MuiCard)(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        width: '100%',
        padding: theme.spacing(4),
        gap: theme.spacing(2),
        marginRight: 'auto',
        marginLeft: 'auto',
        marginTop: theme.spacing(6),
        marginBottom:  theme.spacing(8),
        [theme.breakpoints.up('xs')]: {
            maxWidth: '250px',
        },
        [theme.breakpoints.up('sm')]: {
            maxWidth: '450px',
        },
        boxShadow:
            'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
        ...theme.applyStyles('dark', {
            boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
        }),
    }))
);

export default BaseCard;