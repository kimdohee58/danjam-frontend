import React, { useEffect, useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import styled from 'styled-components';
import { format, startOfDay, endOfDay } from 'date-fns';

// Set the app element for accessibility
Modal.setAppElement('#root');

// Styled Components
const Container = styled.div`
    padding: 20px;
    font-family: Arial, sans-serif;
    max-width: 1200px;
    margin: auto;
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
`;

const Title = styled.h1`
    margin: 0;
    font-size: 2rem;
    color: #333;
`;

const CalendarWrapper = styled.div`
    margin-top: 20px;
`;

const ModalContent = styled.div`
    padding: 20px;
`;

const ModalTitle = styled.h2`
    margin-bottom: 20px;
`;

const ModalText = styled.p`
    margin: 10px 0;
`;

const CloseButton = styled.button`
    background: #e74c3c;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
    float: right;

    &:hover {
        background: #c0392b;
    }
`;

// Initialize localizer
const localizer = momentLocalizer(require('moment'));

const SellerCalendar2 = () => {
    const location = useLocation();
    const userInfo = location.state?.userInfo;
    const [events, setEvents] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedEventDetails, setSelectedEventDetails] = useState(null);

    const openModal = (eventDetails) => {
        setSelectedEventDetails(eventDetails);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedEventDetails(null);
    };

    useEffect(() => {
        const fetchBookings = async () => {
            if (!userInfo || !userInfo.id) return;

            try {
                const response = await axios.get(`http://localhost:8080/SellerCalendar/${userInfo.id}`, {
                    withCredentials: true
                });

                const fetchedEvents = response.data.map(booking => {
                    const checkInDate = new Date(booking.booking.checkIn);
                    const checkOutDate = new Date(booking.booking.checkOut);

                    return {
                        title: `Check-in: ${booking.booking.userName}`,
                        start: startOfDay(checkInDate),
                        end: endOfDay(checkOutDate),
                        details: {
                            ...booking.booking,
                            address: booking.address,
                            hotelName: booking.name,
                            room: booking.room
                        }
                    };
                });

                setEvents(fetchedEvents);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, [userInfo?.id]);

    return (
        <Container>
            <Header>
                <Title>{userInfo?.name || 'Seller'} Calendar</Title>
            </Header>

            <CalendarWrapper>
                <BigCalendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '600px' }}
                    onSelectEvent={openModal}
                />
            </CalendarWrapper>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Event Details"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darker background overlay
                        zIndex: 1000 // Ensure it is above other content
                    },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        maxWidth: '600px',
                        padding: '20px',
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        zIndex: 1001 // Ensure it is above the overlay
                    }
                }}
            >
                <ModalContent>
                    <ModalTitle>Event Details</ModalTitle>
                    {selectedEventDetails ? (
                        <div>
                            <ModalText><strong>Type:</strong> Check-in</ModalText>
                            <ModalText><strong>Reservation Name:</strong> {selectedEventDetails.details.userName}</ModalText>
                            <ModalText><strong>Check-in Date:</strong> {format(new Date(selectedEventDetails.start), 'yyyy-MM-dd')}</ModalText>
                            <ModalText><strong>Check-out Date:</strong> {format(new Date(selectedEventDetails.end), 'yyyy-MM-dd')}</ModalText>
                            <ModalText><strong>Hotel Name:</strong> {selectedEventDetails.details.hotelName || 'N/A'}</ModalText>
                            <ModalText><strong>Address:</strong> {selectedEventDetails.details.address || 'N/A'}</ModalText>
                            <ModalText><strong>Room Name:</strong> {selectedEventDetails.details.room?.name || 'N/A'}</ModalText>
                            <ModalText><strong>Room Type:</strong> {selectedEventDetails.details.room?.type || 'N/A'}</ModalText>
                        </div>
                    ) : (
                        <ModalText>No details available.</ModalText>
                    )}
                    <CloseButton onClick={closeModal}>Close</CloseButton>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default SellerCalendar2;
