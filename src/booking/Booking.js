import {useLocation, useNavigate, useParams, useSearchParams} from 'react-router-dom'
import './Booking.css'
import {useState} from 'react'
import Modal from 'react-modal'
import PaymentWidget from "../payment/PaymentWidget";
import moment from "moment";

Modal.setAppElement('#root');

const Booking = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation()
    const navigate = useNavigate()
    const params = useParams()
    const id = params.id
    const roomId = searchParams.get("roomId")
    const price = searchParams.get("price")
    const roomImg = searchParams.get("roomImg")
    const dormName = searchParams.get("dormName")
    const reviewAvg = searchParams.get("reviewAvg")
    const person = searchParams.get("person")
    const checkIn = searchParams.get("checkIn")
    const checkOut = searchParams.get("checkOut")
    const duration = moment(checkOut).diff(moment(checkIn), 'days')
    const totalPrice = price * duration

    const bookingInfo = {
        ...location.state,
    }
    console.log('bookingInfo', bookingInfo)


    const [isOpen, setIsOpen] = useState(false)
    const handleOpenModal = () => {
        setIsOpen(true);
    }
    const handleCloseModal = () => {
        setIsOpen(false);
    }
    const customStyles = {
        overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
            width: "650px",
            height: "500px",
            margin: "auto",
            borderRadius: "12px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            padding: "20px",
        },
    }

    const handleClick = () => {
        navigate(`/dorms/${id}`)
    }

    return (
        <>
            <div className={'container'}>
                <div className={'header'}>
                    <div className={'history-back'}>
                        <button type={'button'} onClick={handleClick}>
                            {'뒤로가기'}
                        </button>
                        {'예약 요청'}
                    </div>
                </div>

                <div className={'body'}>
                    <div className={'booking-info'}>
                        <span>{'예약 정보'}</span>
                        <div>
                            <div>
                                <span>{'날짜'}</span>
                            </div>
                            <div>
                                <span>
                                    {`${moment(checkIn, 'MM월 dd일')} ~ ${moment(checkOut, 'MM월 dd일')}`}
                                </span>
                            </div>
                        </div>

                        <div>
                            <div>
                                <span>{'게스트'}</span>
                            </div>
                            <div>
                                <span>{`게스트 ${person}명`}</span>
                            </div>
                        </div>

                        <div className={'booking-detail'}>
                            <div className={'dorm-detail'}>
                                <div>
                                    <div>
                                        <div>
                                            <img src={roomImg} alt={roomImg} />
                                        </div>
                                        <div>
                                            <p>{dormName}</p>
                                            <p>{reviewAvg}</p>
                                        </div>
                                        <hr />
                                    </div>

                                    <div>
                                        <div>
                                            <span>{'요금 세부정보'}</span>
                                        </div>
                                        <div>
                                            <span>{'총 합계(KRW)'}</span>
                                            <span>{`￦${price} x ${duration}박`}</span>
                                            <span>{`￦${totalPrice}`}</span>
                                        </div>
                                        <hr />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr />
                    </div>

                    <button
                        type={'button'}
                        className={'req-booking-btn'}
                        onClick={handleOpenModal}
                    >
                        {'예약 요청'}
                    </button>

                    <Modal isOpen={isOpen} onRequestClose={handleCloseModal} style={customStyles}>
                        <PaymentWidget bookingInfo={bookingInfo} />
                    </Modal>
                </div>
            </div>
        </>
    )
}

export default Booking
