import ReviewWriteButton from './reivew/RevieWriteButton'

const BookingList = ({ booking }) => {

    return (
        <>
            <td>{booking.checkIn}</td>
            <td>{booking.checkOut}</td>
            <td>{booking.person}</td>
            <td>{booking.dorm.name}</td>
            <td>{booking.room.name}</td>
            <td>{booking.users.name}</td>
            <td>{booking.payment.orderId}</td>
            <td>{booking.room.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
            <td>
                <ReviewWriteButton />
            </td>
        </>
    )
}

export default BookingList