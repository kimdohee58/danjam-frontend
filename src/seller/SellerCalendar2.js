import React, { useEffect, useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import styled from 'styled-components';
import { format, startOfDay, endOfDay } from 'date-fns';
import moment from 'moment';

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
    font-weight: 600;
`;

const CalendarWrapper = styled.div`
    margin-top: 20px;

    .rbc-calendar {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .rbc-header {
        background: #f7f7f7;
        color: #333;
        font-weight: 500;
        border-bottom: 1px solid #e0e0e0;
    }

    .rbc-day-bg {
        background: #f9f9f9;
    }

    .rbc-day-slot {
        border-right: 1px solid #e0e0e0;
    }

    .rbc-month-view .rbc-month-header {
        border-bottom: 1px solid #e0e0e0;
    }

    .rbc-event {
        border-radius: 4px;
        color: #fff;
        padding: 4px 8px;
        font-size: 0.875rem;
        cursor: pointer;

        &:hover {
            opacity: 0.8;
        }
    }
`;

const ModalContent = styled.div`
    padding: 20px;
`;

const ModalTitle = styled.h2`
    margin-bottom: 20px;
    font-size: 1.5rem;
    color: #333;
`;

const ModalText = styled.p`
    margin: 10px 0;
    font-size: 1rem;
    color: #555;
`;

const CloseButton = styled.button`
    background: #ff5a5f;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
    float: right;

    &:hover {
        background: #ff4a4f;
    }
`;

// Initialize localizer
const localizer = momentLocalizer(moment);

const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

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
                        },
                        userName: booking.booking.userName, // Add the userName to event data
                        color: generateRandomColor() // Generate a unique color for each event
                    };
                });

                setEvents(fetchedEvents);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, [userInfo?.id]);

    const eventStyleGetter = (event) => {
        const style = {
            backgroundColor: event.color || '#00A699', // Default color
            borderRadius: '4px',
            color: '#fff',
            padding: '4px 8px',
            fontSize: '0.875rem',
            border: 'none'
        };

        return {
            style
        };
    };

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
                    eventPropGetter={eventStyleGetter} // Apply the style function
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
