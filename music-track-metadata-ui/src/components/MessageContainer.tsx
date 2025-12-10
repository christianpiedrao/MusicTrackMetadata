
import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import BaseContainer from "./BaseContainer";
import BaseCard from "./BaseCard";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

export type PropsMessageContainer = {
    variation: 'info' | 'error' | 'success';
    title: string;
    message?: string;
    buttonText?: string;
    onClick: () => void;
}

const MessageContainer = React.memo(function MessageContainer({variation, title, message, buttonText, onClick}: PropsMessageContainer) {
    const icon = React.useMemo(() => {
        const iconStyle = { fontSize: 75 };
        if (variation === 'success') {
            return <CheckCircleOutlineIcon sx={iconStyle} color="success" />;
        }
        if (variation === 'error'){
            return <WarningAmberIcon sx={iconStyle} color='error'/>;
        }
        return <InfoOutlineIcon sx={iconStyle} color='primary'/>;
    }, [variation]);


    return (
        <BaseContainer direction="column" justifyContent="space-between" paddingTop={8}>
            <BaseCard>
                <Stack sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 3
                }}>
                    {icon}
                    <Typography variant="h4" gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        {message}
                    </Typography>
                    <Button
                        type="button"
                        color={variation}
                        fullWidth
                        variant="contained"
                        onClick={onClick}
                        sx={{marginTop: 2}}
                    >
                        {buttonText ?? "Acept"}
                    </Button>
                </Stack>                    
            </BaseCard>                
        </BaseContainer>
    );
});

export default MessageContainer;