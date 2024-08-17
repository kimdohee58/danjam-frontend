// import ReviewWriteButton from "./review/ReviewWriteButton"

import moment from "moment";
import ReviewWriteButton from "../review/ReviewWriteButton";

const BookingList = ({ booking }) => {
    console.log(booking)

    return (
        <>
            <td>{moment(booking.checkIn).format('yyyy.MM.DD')}</td>
            <td>{moment(booking.checkOut).format('yyyy.MM.DD')}</td>
            <td>{booking.person}</td>
            <td>{booking.dorm.name}</td>
            <td>{booking.room.name}</td>
            <td>{booking.users.name}</td>
            <td>{booking.payment.orderId}</td>
            <td>{booking.room.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
            <ReviewWriteButton />
        </>
    )
}

export default BookingList