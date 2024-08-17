import React from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';

const FlexContainer = styled.div`
    display: flex;
    gap: 20px; /* Adjust space between ButtonList and OutletContainer */
`;

const ButtonList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px; /* Adjust spacing between buttons */
    width: 200px; /* Adjust width as needed */
`;

const ButtonItem = styled.li`
    /* Optional: Add any custom styles for button items here */
`;

const OutletContainer = styled.div`
    flex: 1; /* Allows the OutletContainer to take up remaining space */
    padding: 10px; /* Add padding if needed */
    border: 1px solid #ddd; /* Optional: Add border for visual separation */
`;

const MyPage = () => {
    const params = useParams();
    const id = params.id;
    const navigate = useNavigate();
    const location = useLocation();
    const userInfo = location.state?.userInfo;

    const goTo = (id) => {
        navigate(`${id}`, { state: { userInfo } });
    };

    return (
        <FlexContainer>
            <ButtonList>
                <ButtonItem>
                    <Button onClick={() => goTo('privacy')}>Privacy</Button>
                </ButtonItem>
                <ButtonItem>
                    <Button onClick={() => goTo('bookings')}>Bookings</Button>
                </ButtonItem>
                <ButtonItem>
                    <Button onClick={() => goTo('wishes')}>Wishes</Button>
                </ButtonItem>
            </ButtonList>
            <OutletContainer>
                <Outlet /> {/* This will render the nested routes */}
            </OutletContainer>
        </FlexContainer>
    );
};

export default MyPage;
