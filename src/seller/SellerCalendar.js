import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
    padding: 20px;
    background-color: #f7f7f7; /* Light background similar to Airbnb's */
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
`;

const InputWrapper = styled.div`
    margin-bottom: 20px;
    display: flex;
    align-items: center;
`;

const StyledInput = styled.input`
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 16px;
    margin-right: 10px;
    flex: 1;
`;

const StyledButton = styled.button`
    padding: 10px 20px;
    border-radius: 4px;
    border: none;
    background-color: #ff5a5f; /* Airbnb red */
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #ff4d4f; /* Darker red on hover */
    }
`;

const DatePickerContainer = styled.div`
    margin: 20px 0;
    display: flex;
    justify-content: center;
`;

const EventList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 20px 0 0;
`;

const EventItem = styled.li`
    padding: 10px;
    border-bottom: 1px solid #ddd;
    font-size: 16px;
    color: #333;

    &:last-child {
        border-bottom: none;
    }
`;

// Global CSS for DatePicker highlights
const globalStyles = `
    .highlighted-date {
        background-color: #ffeb3b !important; /* Airbnb yellow */
        border-radius: 50%;
        color: #333;
    }
    .react-datepicker__day--highlighted-date {
        background-color: #ffeb3b !important; /* Airbnb yellow */
        border-radius: 50%;
        color: #333;
    }
    .react-datepicker__day--highlighted-date:hover {
        background-color: #fdd835 !important; /* Slightly darker yellow on hover */
    }
    .react-datepicker__day {
        border-radius: 50%; /* Ensure round shape for highlighted days */
    }
`;

const SellerCalendar = () => {
    const location = useLocation();  // 현재 URL의 위치 정보를 가져옵니다.
    const userInfo = location.state.userInfo;  // URL 상태에서 사용자 정보를 가져옵니다.
    const navigate = useNavigate();  // 페이지 네비게이션을 위한 훅
    const [selectedDate, setSelectedDate] = useState(null);  // 선택된 날짜 상태
    const [events, setEvents] = useState([]);  // 선택된 날짜의 이벤트 상태
    const [eventsData, setEventsData] = useState({});  // 모든 날짜의 이벤트 데이터 상태
    const [searchDate, setSearchDate] = useState('');  // 검색 날짜 상태

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
            setEvents(eventsData[dateString] || []);  // 선택된 날짜의 이벤트 설정
            setSearchDate(dateString);  // 입력 필드 업데이트
        } else {
            setEvents([]);
            setSearchDate('');  // 입력 필드 초기화
        }
    };

    // 이벤트가 있는 날짜에 클래스명을 반환
    const getDayClassName = (date) => {
        const dateString = formatDateString(date);
        return eventsData[dateString] ? 'highlighted-date' : '';  // 이벤트가 있는 날에 클래스 적용
    };

    // 북킹 데이터를 가져오고 이벤트 데이터 처리
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const id = userInfo.id;  // 사용자 ID 가져오기
                const response = await axios.get(`http://localhost:8080/SellerCalendar/${id}`, {
                    withCredentials: true
                });
                console.log(response.data);  // 응답 데이터 확인

                // 이벤트 데이터 가공
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

                    // 체크인 날짜에 이벤트 추가
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

                    // 체크아웃 날짜에 이벤트 추가
                    if (!acc[checkOutDateString]) {
                        acc[checkOutDateString] = [];
                    }
                    acc[checkOutDateString].push(checkOutEventDetails);

                    return acc;
                }, {});

                setEventsData(fetchedEventsData);  // 이벤트 데이터 상태 업데이트
                if (selectedDate) {
                    const dateString = formatDateString(selectedDate);
                    setEvents(fetchedEventsData[dateString] || []);  // 선택된 날짜의 이벤트 업데이트
                }
            } catch (error) {
                console.error('Error fetching bookings:', error);  // 에러 처리
            }
        };

        fetchBookings();
    }, [userInfo.id, selectedDate]);

    // 검색 날짜 변경 핸들러
    const handleSearchDateChange = (e) => {
        const date = new Date(e.target.value);
        setSearchDate(e.target.value);
        if (!isNaN(date.getTime())) {
            setSelectedDate(date);
            const dateString = formatDateString(date);
            setEvents(eventsData[dateString] || []);  // 검색된 날짜의 이벤트 설정
        }
    };

    // Calendar 버튼 클릭 핸들러
    const handleCalendarButtonClick = () => {
        navigate('/seller/SellerCalendar2', { state: { userInfo } });
    };

    return (
        <Container>
            <Title>{userInfo.name}의 스케쥴</Title>

            <InputWrapper>
                <StyledInput
                    type="date"
                    value={searchDate}
                    onChange={handleSearchDateChange}
                    placeholder="Select or enter a date"
                />
                <StyledButton onClick={handleCalendarButtonClick}>
                    Calendar
                </StyledButton>
            </InputWrapper>

            <DatePickerContainer>
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    isClearable
                    showYearDropdown
                    scrollableYearDropdown
                    dayClassName={getDayClassName}
                    inline  // 캘린더를 항상 보이도록 설정
                    placeholderText="Select a date"  // DatePicker의 플레이스홀더 텍스트
                />
            </DatePickerContainer>

            {selectedDate && (
                <div style={{ marginTop: '20px' }}>
                    <h2>Events for {formatDateString(selectedDate)}:</h2>
                    <EventList>
                        {events.length > 0 ? (
                            events.map((event, index) => (
                                <EventItem key={index}>
                                    {event.type}: {event.userName}
                                </EventItem>
                            ))
                        ) : (
                            <EventItem>No events for this date.</EventItem>
                        )}
                    </EventList>
                </div>
            )}

            <style>
                {globalStyles}
            </style>
        </Container>
    );
};

export default SellerCalendar;
