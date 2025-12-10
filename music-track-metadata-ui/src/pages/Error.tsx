
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_HOME } from '../_routes';
import MessageContainer from '../components/MessageContainer';

export default function Error(){
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(ROUTE_HOME);
    };

    return <MessageContainer 
                variation='error' 
                title='Something went wrong!' 
                message='There was an unexpected system failure. Please try again later or contact the support team.'
                onClick={handleClick} />;
}