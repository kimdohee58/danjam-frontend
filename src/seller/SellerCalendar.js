import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, isValid } from 'date-fns';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const SellerCalendar = () => {
    const location = useLocation();
    const userInfo = location.state.userInfo;

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [books, setBooks] = useState([]);
    const [events, setEvents] = useState({});
    const [selectedBookings, setSelectedBookings] = useState([]);

    // Handle date change and filter bookings
    const handleDateChange = (date) => {
        setSelectedDate(date);

        // Format the selected date
        const formattedDate = format(date, 'yyyy-MM-dd');

        // Filter bookings that include the selected date
        const bookingsForDate = books.filter(booking => {
            const checkInDate = new Date(booking.checkIn);
            const checkOutDate = new Date(booking.checkOut);

            if (!isValid(checkInDate) || !isValid(checkOutDate)) {
                return false;
            }

            const formattedCheckInDate = format(checkInDate, 'yyyy-MM-dd');
            const formattedCheckOutDate = format(checkOutDate, 'yyyy-MM-dd');

            // Check if the selected date falls within the check-in and check-out range
            return (formattedDate >= formattedCheckInDate && formattedDate <= formattedCheckOutDate);
        });

        setSelectedBookings(bookingsForDate);
    };

    // Get events for the given date
    const getEventsForDate = (date) => {
        const dateString = format(date, 'yyyy-MM-dd');
        return events[dateString] || [];
    };

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const id = userInfo.id;
                const response = await axios.get(`http://localhost:8080/Sellerlist/${id}`, {
                    withCredentials: true
                });
                const dorms = response.data;
                console.log(response.data.date)

                console.log(dorms)

                setBooks(dorms);

                const transformedEvents = dorms.reduce((acc, dorm) => {

                    console.log(dorm)
                    console.log(dorm.checkIn)
                    console.log(dorm.checkOut)

                    const checkInDate =  dorm.checkIn;
                    const checkOutDate =  dorm.checkOut;

                    console.log(checkInDate)
                    console.log(checkOutDate)
                    //
                    // if (!isValid(checkInDate) || !isValid(checkOutDate)) {
                    //     return acc; // Skip invalid dates
                    // }

                    // Ensure dates are formatted correctly
                    const checkInString =  dorm.checkIn;
                    const checkOutString = dorm.checkOut;



                    // Iterate over each date range
                    let currentDate = checkInDate;
                    while (currentDate <= checkOutDate) {
                        const dateString = format(currentDate, 'yyyy-MM-dd');
                        if (!acc[dateString]) {
                            acc[dateString] = [];
                        }
                        acc[dateString].push(dorm.description);
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                    return acc;
                }, {});

                setEvents(transformedEvents);
            } catch (error) {
                console.error('Error fetching dorms:', error);
            }
        };

        fetchBookings();
    }, [userInfo.id]);

    return (
        <div>
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                inline
            />
            <div>
                <h3>Events for {format(selectedDate, 'yyyy-MM-dd')}:</h3>
                <ul>
                    {getEventsForDate(selectedDate).map((event, index) => (
                        <li key={index}>{event}</li>
                    ))}
                </ul>
            </div>
            {selectedBookings.length > 0 && (
                <div>
                    <h3>Bookings for {format(selectedDate, 'yyyy-MM-dd')}:</h3>
                    <ul>
                        {selectedBookings.map((booking, index) => (
                            <li key={index}>
                                {booking.description} (Check-In: {format(new Date(booking.checkIn), 'HH:mm')}, Check-Out: {format(new Date(booking.checkOut), 'HH:mm')})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SellerCalendar;
