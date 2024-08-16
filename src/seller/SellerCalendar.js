import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import styled from 'styled-components';

// 접근성 향상을 위해 모달의 루트 엘리먼트를 설정
Modal.setAppElement('#root');

// Styled Components
const Container = styled.div`
    padding: 20px;
`;

const Title = styled.h1`
    margin-bottom: 20px;
`;

const InputContainer = styled.div`
    margin-bottom: 20px;
`;

const DatePickerContainer = styled.div`
    display: flex;
    margin: 20px 0;
`;

const EventList = styled.div`
    margin-top: 20px;
`;

const EventButton = styled.button`
    background: none;
    border: none;
    color: #007bff;
    text-decoration: underline;
    cursor: pointer;

    &:hover {
        text-decoration: none;
    }
`;

const ModalContent = styled.div`
    top: 50%;
    left: 50%;
    right: auto;
    bottom: auto;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: 600px;
`;

const HighlightedDate = styled.div`
    background-color: red; /* 이벤트가 있는 날짜를 빨간색으로 강조 */
    border-radius: 50%;
    color: black;
`;

const EventDetails = styled.div`
    margin-bottom: 20px;
`;

const CloseButton = styled.button`
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

const SellerCalendar = () => {
    const location = useLocation();
    const userInfo = location.state?.userInfo; // Use optional chaining to safely access userInfo
    const [selectedDate, setSelectedDate] = useState(null);
    const [events, setEvents] = useState([]);
    const [eventsData, setEventsData] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedEventDetails, setSelectedEventDetails] = useState(null);
    const [searchDate, setSearchDate] = useState('');

    // 날짜를 YYYY-MM-DD 형식으로 포맷팅
    const formatDateString = (date) => {
        if (date) {
            const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            return utcDate.toISOString().split('T')[0];
        }
        return '';
    };

    // 날짜 변경 핸들러
    const handleDateChange = (date) => {
        setSelectedDate(date);
        if (date) {
            const dateString = formatDateString(date);
            setEvents(eventsData[dateString] || []);
            setSearchDate(dateString);
        } else {
            setEvents([]);
            setSearchDate('');
        }
    };

    // 이벤트가 있는 날짜에 클래스명을 반환
    const getDayClassName = (date) => {
        const dateString = formatDateString(date);
        return eventsData[dateString] ? 'highlighted-date' : '';
    };

    // 선택된 이벤트 세부 정보를 가진 모달 열기
    const openModal = (eventDetails) => {
        setSelectedEventDetails(eventDetails);
        setModalIsOpen(true);
    };

    // 모달 닫기
    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedEventDetails(null);
    };

    // 북킹 데이터를 가져오고 이벤트 데이터 처리
    useEffect(() => {
        const fetchBookings = async () => {
            if (!userInfo || !userInfo.id) {
                console.error('User info is not available.');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/SellerCalendar/${userInfo.id}`, {
                    withCredentials: true
                });
                console.log(response.data);

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
                if (selectedDate) {
                    const dateString = formatDateString(selectedDate);
                    setEvents(fetchedEventsData[dateString] || []);
                }
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, [userInfo?.id, selectedDate]);

    // 검색 날짜 변경 핸들러
    const handleSearchDateChange = (e) => {
        const date = new Date(e.target.value);
        setSearchDate(e.target.value);
        if (!isNaN(date.getTime())) {
            setSelectedDate(date);
            const dateString = formatDateString(date);
            setEvents(eventsData[dateString] || []);
        }
    };

    if (!userInfo) {
        return <p>User information is not available.</p>; // Display a message or a fallback UI
    }

    return (
        <Container>
            <Title>{userInfo.name} Seller Calendar</Title>

            <InputContainer>
                <input
                    type="date"
                    value={searchDate}
                    onChange={handleSearchDateChange}
                    placeholder="Select or enter a date"
                />
            </InputContainer>

            <DatePickerContainer>
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    isClearable
                    showYearDropdown
                    scrollableYearDropdown
                    dayClassName={getDayClassName}
                    inline
                    placeholderText="Select a date"
                />
            </DatePickerContainer>

            {selectedDate && (
                <EventList>
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
                </EventList>
            )}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Event Details"
                style={{
                    content: ModalContent,
                }}
            >
                <h2>Event Details</h2>
                {selectedEventDetails ? (
                    <EventDetails>
                        <p><strong>Type:</strong> {selectedEventDetails.type}</p>
                        <p><strong>Reservation Name:</strong> {selectedEventDetails.userName}</p>
                        <p><strong>Check-in Date:</strong> {selectedEventDetails.details.checkIn}</p>
                        <p><strong>Check-out Date:</strong> {selectedEventDetails.details.checkOut}</p>
                        <p><strong>Hotel Name:</strong> {selectedEventDetails.details.hotelName || 'N/A'}</p>
                        <p><strong>Address:</strong> {selectedEventDetails.details.address || 'N/A'}</p>
                        <p><strong>Room Name:</strong> {selectedEventDetails.details.room?.name || 'N/A'}</p>
                        <p><strong>Room Type:</strong> {selectedEventDetails.details.room?.type || 'N/A'}</p>
                    </EventDetails>
                ) : (
                    <p>No details available.</p>
                )}
                <CloseButton onClick={closeModal}>Close</CloseButton>
            </Modal>
        </Container>
    );
};

export default SellerCalendar;
