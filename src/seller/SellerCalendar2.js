import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import styled from 'styled-components';

// Set the app element for accessibility
Modal.setAppElement('#root');

// Styled Components
const Container = styled.div`
    padding: 20px;
    font-family: Arial, sans-serif;
    max-width: 1200px;
    margin: auto;
    display: flex;
    gap: 20px;
`;

const Header = styled.div`
    display: flex;
    flex-direction: column; // Align items in a column
    gap: 10px; // Add space between Title and DateInput
    margin-bottom: 20px;
`;

const Title = styled.h1`
    margin: 0;
    font-size: 2rem;
    color: #333;
`;

const DateInput = styled.input`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    width: 150px;
`;

const CalendarWrapper = styled.div`
    flex: 1;
    display: flex;
    justify-content: flex-start;
`;

const StyledCalendar = styled(Calendar)`
    .react-calendar {
        border: none;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .react-calendar__month-view__days__day--neighboringMonth {
        color: #ccc;
    }
    .react-calendar__tile--active {
        background: #007bff;
        color: white;
    }
    .react-calendar__tile--highlighted-date {
        background: #ffeb3b !important;
        color: black;
    }
    .highlighted-date {
        background-color: #ffeb3b; /* Highlighted dates */
        border-radius: 50%;
        color: black;
    }
`;

const EventsList = styled.div`
    flex: 2;
    margin-top: 20px;
`;

const EventButton = styled.button`
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px;
    cursor: pointer;
    width: 100%;
    text-align: left;
    margin-bottom: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:hover {
        background: #0056b3;
    }
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

const SellerCalendar2 = () => {
    const location = useLocation();
    const userInfo = location.state.userInfo;
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [eventsData, setEventsData] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedEventDetails, setSelectedEventDetails] = useState(null);
    const [searchDate, setSearchDate] = useState('');

    const formatDateString = (date) => {
        if (date) {
            const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            return utcDate.toISOString().split('T')[0];
        }
        return '';
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const dateString = formatDateString(date);
        setEvents(eventsData[dateString] || []);
        setSearchDate(dateString);
    };

    const getTileClassName = (date) => {
        const dateString = formatDateString(date);
        return eventsData[dateString] ? 'highlighted-date' : '';
    };

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
            try {
                const id = userInfo.id;
                const response = await axios.get(`http://localhost:8080/SellerCalendar/${id}`, {
                    withCredentials: true
                });

                const fetchedEventsData = response.data.reduce((acc, booking) => {
                    const checkInDate = new Date(booking.booking.checkIn);
                    const checkInDateString = checkInDate.toISOString().split('T')[0];

                    const checkOutDate = new Date(booking.booking.checkOut);
                    const checkOutDateString = checkOutDate.toISOString().split('T')[0];

                    const eventDetails = {
                        type: 'Check-in',
                        userName: booking.booking.userName,
                        details: {
                            ...booking.booking,
                            address: booking.address,
                            hotelName: booking.name,
                            room: booking.room
                        }
                    };

                    if (!acc[checkInDateString]) {
                        acc[checkInDateString] = [];
                    }
                    acc[checkInDateString].push(eventDetails);

                    const checkOutEventDetails = {
                        type: 'Check-out',
                        userName: booking.booking.userName,
                        details: {
                            ...booking.booking,
                            address: booking.address,
                            hotelName: booking.name,
                            room: booking.room
                        }
                    };

                    if (!acc[checkOutDateString]) {
                        acc[checkOutDateString] = [];
                    }
                    acc[checkOutDateString].push(checkOutEventDetails);

                    return acc;
                }, {});

                setEventsData(fetchedEventsData);
                const dateString = formatDateString(selectedDate);
                setEvents(fetchedEventsData[dateString] || []);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, [userInfo.id, selectedDate]);

    const handleSearchDateChange = (e) => {
        const date = new Date(e.target.value);
        setSearchDate(e.target.value);
        if (!isNaN(date.getTime())) {
            setSelectedDate(date);
            const dateString = formatDateString(date);
            setEvents(eventsData[dateString] || []);
        }
    };

    return (
        <Container>
            <CalendarWrapper>
                <StyledCalendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    tileClassName={({ date }) => getTileClassName(date)}
                />
            </CalendarWrapper>

            <EventsList>
                <Header>
                    <Title>{userInfo.name} Seller Calendar</Title>
                    <DateInput
                        type="date"
                        value={searchDate}
                        onChange={handleSearchDateChange}
                        placeholder="Select or enter a date"
                    />
                </Header>

                {selectedDate && (
                    <>
                        <h2>Events for {formatDateString(selectedDate)}:</h2>
                        <ul>
                            {events.length > 0 ? (
                                events.map((event, index) => (
                                    <li key={index}>
                                        <EventButton onClick={() => openModal(event)}>
                                            {event.type}: {event.userName}
                                        </EventButton>
                                    </li>
                                ))
                            ) : (
                                <li>No events for this date.</li>
                            )}
                        </ul>
                    </>
                )}
            </EventsList>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Event Details"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        maxWidth: '600px',
                    },
                }}
            >
                <ModalContent>
                    <ModalTitle>Event Details</ModalTitle>
                    {selectedEventDetails ? (
                        <div>
                            <ModalText><strong>Type:</strong> {selectedEventDetails.type}</ModalText>
                            <ModalText><strong>Reservation Name:</strong> {selectedEventDetails.userName}</ModalText>
                            <ModalText><strong>Check-in Date:</strong> {selectedEventDetails.details.checkIn}</ModalText>
                            <ModalText><strong>Check-out Date:</strong> {selectedEventDetails.details.checkOut}</ModalText>
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
