import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Auth from '../users/Auth';
import styled from 'styled-components';
import logo from '../images/danjam-logo.png'; // Import the logo image
import SellerCalendar from '../seller/SellerCalendar';
import Search from "../search/Search"; // Import the SellerCalendar component

// Colors
const colors = {
    darkBlueBlack: 'rgb(2, 13, 29)',
    lightGrayBlue: 'rgb(150, 161, 170)',
    mediumGrayBlue: 'rgb(93, 105, 118)',
    darkBlue: 'rgb(40, 53, 68)',
    lightGray: 'rgb(223, 226, 228)',
};

// Wrapper for the entire layout
const AppWrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: ${colors.lightGray}; // Background color for the app
`;

// Header Styling
const Header = styled.header`
    background: ${colors.darkBlue};
    padding: 16px 24px; // Added horizontal padding for better spacing
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between; // Distribute space between logo and buttons
    z-index: 1000;
    box-sizing: border-box;
`;

const HrLine = styled.hr`
    background: rgb(240, 240, 240);
    height: 1px;
    border: 0;
`;

// ContentContainer Styling
const ContentContainer = styled.div`
    display: flex;
    align-items: center; // Vertically center align items
    gap: 16px; // Space between buttons
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    padding: 0 24px;
    position: relative;
    flex: 1; // Allow ContentContainer to take available space
`;

// ButtonsWrapper Styling
const ButtonsWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 16px; // Space between buttons
    margin-left: auto; // Push buttons to the right
`;

// Logo Styling
const Logo = styled.img`
    height: 60px; // Adjust height to fit well within the header
    cursor: pointer;
`;

// DropdownButton Styling
const DropdownButton = styled(Button)`
    background: ${colors.darkBlue}; /* Vibrant background color */
    color: #ffffff; /* White text color */
    border: none;
    padding: 12px 24px; /* Adjust padding for better button size */
    cursor: pointer;
    font-size: 16px;
    font-weight: 600; /* Slightly bolder text for emphasis */
    border-radius: 8px; /* Rounded corners */
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow */
    transition: background 0.3s ease, box-shadow 0.3s ease; /* Smooth transition effects */

    &:hover {
        background: ${colors.mediumGrayBlue}; /* Hover color */
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* Deeper shadow on hover */
    }

    &:focus {
        outline: none; /* Remove default focus outline */
    }
`;

// BookingListButton Styling
const BookingListButton = styled(Button)`
    background: ${colors.darkBlue}; /* Consistent background color */
    color: #ffffff; /* White text color */
    border: none;
    padding: 12px 24px; /* Adjust padding */
    cursor: pointer;
    font-size: 16px;
    font-weight: 600; /* Slightly bolder text */
    border-radius: 8px; /* Rounded corners */
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow */
    transition: background 0.3s ease, box-shadow 0.3s ease; /* Smooth transition effects */

    &:hover {
        background: ${colors.mediumGrayBlue}; /* Hover color */
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* Deeper shadow on hover */
    }

    &:focus {
        outline: none; /* Remove default focus outline */
    }
`;

// DropdownMenu Styling
const DropdownMenu = styled.ul`
    list-style: none;
    padding: 0;
    margin: 5px 15px;
    position: absolute;
    top: 60px;
    right: 0;
    background: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: ${props => (props.show ? 'block' : 'none')};
    width: 230px;
    border-radius: 4px;
    z-index: 1000;
`;

// DropdownMenuItem Styling
const DropdownMenuItem = styled.li`
    padding: 12px 16px;

    &:last-child {
        border-bottom: none;
    }
    &:hover {
        background-color: rgb(240,242,242);
    }
    a {
        color: ${colors.mediumGrayBlue};
        text-decoration: none;
    }
    button {
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 16px;
        text-align: left;
        width: 100%;
        padding: 0;
    }
`;

// Main Content Styling
const Main = styled.main`
    padding: 80px 0 20px;  // Adjust padding to account for fixed header
    flex: 1; // Ensures the main content takes up the remaining space
    background-color: white; // Background color for the main content
`;

// Footer Styling
const Footer = styled.footer`
    background: ${colors.darkBlue};
    padding: 20px 0;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
`;

// FooterContent Styling
const FooterContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

// FooterLinks Styling
const FooterLinks = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
`;

// FooterLink Styling
const FooterLink = styled.li`
    margin-left: 16px;
    a {
        color: ${colors.lightGrayBlue};
        text-decoration: none;
        font-size: 14px;
        &:hover {
            text-decoration: underline;
        }
    }
`;

// Modal Styling
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: #ffffff;
    padding: 20px;
    border-radius: 8px;
    position: relative;
    max-width: 400px;
`;

const ModalClose = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: ${colors.mediumGrayBlue};
`;

// BookingListModal Styling
const BookingListModal = styled(ModalContent)`
    overflow: auto; // Allow scrolling if content overflows
    padding: 20px; // Ensure padding for better spacing
`;

function Layout() {
    const [showModal, setShowModal] = useState(false);
    const [showBookingListModal, setShowBookingListModal] = useState(false);
    const [userInfo, setUserInfo] = useState({
        id: '',
        name: '',
        role: ''
    });
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (location.state && location.state.userInfo) {
            setUserInfo(location.state.userInfo);
        }
    }, [location.state]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const SignUp = () => navigate('/signUp');
    const LogIn = () => setShowModal(true);
    const LogOut = async () => {
        try {
            const resp = await axios.post('http://localhost:8080/users/logout', {}, { withCredentials: true });
            if (resp.status === 200) {
                navigate('/');
                setUserInfo({
                    id: '',
                    name: '',
                    role: ''
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    const Home = () => navigate('/', { state: { userInfo } });
    const REGIST = () => navigate('/dorm/insert', { state: { userInfo } });
    const RoomInser = () => navigate('/seller/SellerList', { state: { userInfo } });
    const SellerCalendarNavigate = () => navigate('/seller/SellerCalendar', { state: { userInfo } });
    const SellerCalendar2 = () => navigate('/seller/SellerCalendar2', { state: { userInfo } });
    const Approve = () => navigate('/admin/Approve', { state: { userInfo } });
    const MemberList = () => navigate('/admin/MemberList', { state: { userInfo } });

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            setShowModal(false);
            setShowBookingListModal(false);
        }
    };

    const handleMyPage = (page) => navigate(`/users/${userInfo.id}/my-page/${page}`);

    const handleLoginSuccess = () => setShowModal(false);

    // Memoize the SellerCalendar component
    const MemoizedSellerCalendar = useMemo(() => {
        return <SellerCalendar userInfo={userInfo} />;
    }, [userInfo]);

    return (
        <AppWrapper>
            <Header>
                <Logo src={logo} alt="Company Logo" onClick={(toMain) => navigate('/')} />

                {/*<Search/>*/}

                <ButtonsWrapper>
                    {userInfo.role === 'ROLE_SELLER' && (
                        <BookingListButton onClick={() => setShowBookingListModal(true)}>
                            schedule
                        </BookingListButton>
                    )}
                    <DropdownButton onClick={() => setDropdownOpen(prev => !prev)}>
                        {userInfo.name ? userInfo.name : 'Menu'}
                    </DropdownButton>
                </ButtonsWrapper>
                <DropdownMenu show={dropdownOpen} ref={dropdownRef}>
                    {!userInfo.name ? (
                        <>
                            <DropdownMenuItem><Button onClick={LogIn}>로그인</Button></DropdownMenuItem>
                            <DropdownMenuItem><Button onClick={SignUp}>회원가입</Button></DropdownMenuItem>
                        </>
                    ) : (
                        <>
                            {userInfo.role === 'ROLE_SELLER' && (
                                <>
                                    <DropdownMenuItem><Button onClick={REGIST}>당신의 단잠을 함께하세요</Button></DropdownMenuItem>
                                    <DropdownMenuItem><Button onClick={RoomInser}>단잠리스트</Button></DropdownMenuItem>
                                    <DropdownMenuItem><Button onClick={SellerCalendar2}>숙소관리</Button></DropdownMenuItem>
                                    <HrLine/>
                                </>
                            )}
                            {userInfo.role === 'ROLE_ADMIN' && (
                                <>
                                    <DropdownMenuItem><Button onClick={Approve}>단잠승인</Button></DropdownMenuItem>
                                    <DropdownMenuItem><Button onClick={MemberList}>사용자리스트</Button></DropdownMenuItem>
                                    <HrLine/>
                                </>
                            )}
                            <DropdownMenuItem><Button onClick={() => handleMyPage('privacy')}>개인정보</Button></DropdownMenuItem>
                            <DropdownMenuItem><Button onClick={() => handleMyPage('bookings')}>예약정보</Button></DropdownMenuItem>
                            <DropdownMenuItem><Button onClick={() => handleMyPage('wishes')}>위시리스트</Button></DropdownMenuItem>
                            <HrLine/>
                            <DropdownMenuItem><Button onClick={LogOut}>로그아웃</Button></DropdownMenuItem>
                        </>
                    )}
                </DropdownMenu>
            </Header>
            <Main>
                <ContentContainer>
                    <Outlet />
                </ContentContainer>
            </Main>
            <Footer>
                <ContentContainer>
                    <FooterContent>
                        <p>&copy; 2024 Your Company. All rights reserved.</p>
                        <FooterLinks>
                            <FooterLink><a href="#">Privacy Policy</a></FooterLink>
                            <FooterLink><a href="#">Terms of Service</a></FooterLink>
                            <FooterLink><a href="#">Contact Us</a></FooterLink>
                        </FooterLinks>
                    </FooterContent>
                </ContentContainer>
            </Footer>

            {showModal && (
                <ModalOverlay onClick={handleOverlayClick}>
                    <ModalContent>
                        <ModalClose onClick={() => setShowModal(false)}>
                            &times;
                        </ModalClose>
                        <Auth onSuccess={handleLoginSuccess} />
                    </ModalContent>
                </ModalOverlay>
            )}

            {showBookingListModal && (
                <ModalOverlay onClick={handleOverlayClick}>
                    <BookingListModal>
                        <ModalClose onClick={() => setShowBookingListModal(false)}>
                            &times;
                        </ModalClose>
                        {MemoizedSellerCalendar}
                    </BookingListModal>
                </ModalOverlay>
            )}

        </AppWrapper>
    );
}

export default Layout;
