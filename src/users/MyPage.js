import React from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';

const FlexContainer = styled.div`
    display: flex;
    height: 100vh; /* Full viewport height */
    background-color: #f7f7f7; /* Light background color for the entire page */
`;

const Sidebar = styled.div`
    width: 250px; /* Sidebar width */
    background-color: #fff; /* White background for sidebar */
    border-right: 1px solid #e0e0e0; /* Light border for separation */
    display: flex;
    flex-direction: column;
    padding: 20px; /* Padding inside sidebar */
`;

const ButtonList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 15px; /* Space between buttons */
`;

const ButtonItem = styled.li``;

const MainContent = styled.div`
    flex: 1;
    padding: 20px; /* Padding around content */
    background-color: #fff; /* White background for content area */
    overflow-y: auto; /* Allow scrolling if content overflows */
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
            <Sidebar>
                <ButtonList>
                    <ButtonItem>
                        <Button onClick={() => goTo('privacy')} variant="outline-primary">Privacy</Button>
                    </ButtonItem>
                    <ButtonItem>
                        <Button onClick={() => goTo('bookings')} variant="outline-primary">Bookings</Button>
                    </ButtonItem>
                    <ButtonItem>
                        <Button onClick={() => goTo('wishes')} variant="outline-primary">Wishes</Button>
                    </ButtonItem>
                </ButtonList>
            </Sidebar>
            <MainContent>
                <Outlet /> {/* This will render the nested routes */}
            </MainContent>
        </FlexContainer>
    );
};

export default MyPage;
