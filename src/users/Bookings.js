import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BookingList from './BookingList'

const Bookings = () => {
    const params = useParams()
    const id = params.id

    const fetchBookingUrl = 'http://localhost:8080/bookings'

    const [data, setData] = useState([])

    useEffect(() => {
        const fetchBookings = async () => {
            const response = await fetch(`${fetchBookingUrl}/${id}`, {
                method: 'GET',
                credentials: 'include',
            })

            return await response.json()
        }

        fetchBookings().then((result) => {
            setData(result)
        })
    }, [id])

    return (
        <div>
            <table>
                <thead>
                <tr>
                    <th>체크 인</th>
                    <th>체크 아웃</th>
                    <th>인원 수</th>
                    <th>숙박 이름</th>
                    <th>방 이름</th>
                    <th>예약자</th>
                    <th>주문 번호</th>
                    <th>가격</th>
                </tr>
                </thead>
                <tbody>
                {data.length !== 0 ? (data.map(booking => (
                    <tr>
                        <BookingList booking={booking} />
                    </tr>
                ))) : (<tr><td style={{textAlign: 'center'}} colSpan="8"><h3>예약 내역이 없습니다.</h3></td></tr>)}
                </tbody>
            </table>
        </div>
    )
}

export default Bookings