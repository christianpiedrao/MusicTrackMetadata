import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import BaseContainer from './BaseContainer';
import BaseCard from './BaseCard';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectorUser, selectorUserAuthCredentials, selectorUserResponseStatus } from '../data/slices/user/_selectors';
import { ROUTE_HOME } from '../_routes';
import Error from '../pages/Error';
import { ResultType } from '../types';

type LoginContainerProps = {
    title: string
}

const LoginBaseContainer = React.memo(function LoginBaseContainer({title, children}: React.PropsWithChildren<LoginContainerProps>) {
    const navigate = useNavigate();
    const user = useSelector(selectorUser);
    const authCredentials = useSelector(selectorUserAuthCredentials);
    const responseStatus = useSelector(selectorUserResponseStatus);

    React.useEffect(() => {
        if (user && authCredentials) {
            navigate(ROUTE_HOME);
        }
    })

    if (responseStatus === ResultType.SEVERE) {
        return <Error />;
    }

    return <Box>
        <BaseContainer direction="column" justifyContent="space-between"  paddingTop={8}>        
            <BaseCard variant="outlined">
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                >
                    {title}
                </Typography>
                {children}
            </BaseCard>
        </BaseContainer>
    </Box>
}); 

export default LoginBaseContainer;