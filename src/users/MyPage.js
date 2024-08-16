import { Link, useParams } from 'react-router-dom'

const MyPage = () => {
    const params = useParams()
    const id = params.id
    
    return (
        <>
            <Link to={`/my-page/${id}/privacy`}>개인 정보</Link>
            <br/>
            <Link to={`/my-page/${id}/bookings`}>예약 정보</Link>
            <br/>
            <Link to={`/my-page/${id}/wishes`}>위시리스트</Link>
            <br/>
            <Link to={`/my-page/${id}/reservations`}>숙소 예약 정보</Link>
        </>
    )
}

export default MyPage