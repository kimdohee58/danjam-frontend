import {useLocation, useNavigate, useParams, useSearchParams} from 'react-router-dom'
import './Booking.css'
import React, {useEffect, useMemo, useState} from 'react'
import Modal from 'react-modal'
import PaymentWidget from "../payment/PaymentWidget";
import moment from "moment";
import styled from "styled-components";

Modal.setAppElement('#root');

const Booking = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation()
    const navigate = useNavigate()
    const params = useParams()
    const id = params.id

    const dormId = searchParams.get("dormId")
    const roomId = searchParams.get("roomId")
    const price = searchParams.get("price")
    const roomImg = searchParams.get("roomImg")
    const dormName = searchParams.get("dormName")
    const reviewAvg = searchParams.get("reviewAvg")
    const person = searchParams.get("person")
    const checkIn = searchParams.get("checkIn")
    const checkOut = searchParams.get("checkOut")
    const duration = moment(checkOut).diff(moment(checkIn), 'days')
    const totalPrice = (duration !== 0) ? (price * duration) : price;

    const bookingData = {
        dormName,
        roomId,
        price,
        person,
        checkIn,
        checkOut,
    }

    const [userInfo, setUserInfo] = useState({
        id: '',
        email: '',
        name: '',
        phoneNum: '',
        role: '',
    })
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
        navigate(`/dorm/${dormId}`, { state: { userInfo }})
    }

    useEffect(() => {
        console.log('booking', location.state)
        if (location.state && location.state.userInfo) {
            setUserInfo(location.state.userInfo);
        }
    }, [location.state])

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
                                    {`${moment(checkIn, 'YYYY-MM-DD HH:mm:ss').format('MM월 DD일')} ~ ${moment(checkOut, 'YYYY-MM-DD HH:mm:ss').format('MM월 DD일')}`}
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
                                            <p>{`￦${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} x ${duration ? duration : ''}박`}</p>
                                            <p>{'총 합계(KRW)'}</p>
                                            <p>{`￦${totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}</p>
                                        </div>
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
                        <PaymentWidget bookingData={bookingData} userInfo={userInfo} />
                    </Modal>
                </div>
            </div>
        </>
    )
}

export default Booking