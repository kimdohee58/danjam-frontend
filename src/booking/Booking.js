import { useLocation, useNavigate, useParams } from 'react-router-dom'
import './Booking.css'
import {useState} from 'react'
import Modal from 'react-modal'
import PaymentWidget from "../payment/PaymentWidget";

Modal.setAppElement('#root');

const Booking = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const params = useParams()
    const id = params.id

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
            height: "450px",
            margin: "auto",
            borderRadius: "12px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            padding: "20px",
        },
    }

    const bookingInfo = { ...location.state }

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
                                <span>{'8월 15일~17일'}</span>
                            </div>
                        </div>

                        <div>
                            <div>
                                <span>{'게스트'}</span>
                            </div>
                            <div>
                                <span>{'게스트 2명'}</span>
                            </div>
                        </div>

                        <div className={'booking-detail'}>
                            <div className={'dorm-detail'}>
                                <div>
                                    <div>
                                        <div>{'이미지'}</div>
                                        <div>
                                            {'써니 하우스 #10 북유럽 방구석 영화관+카페/빔프로젝터'}
                                            {'공동 주택 전체'}
                                            {'평점 4.94(후기 212개) 슈퍼호스트'}
                                        </div>
                                        <hr />
                                    </div>

                                    <div>
                                        <div>
                                            <span>{'요금 세부정보'}</span>
                                        </div>
                                        <div>
                                            <span>{'$118,000 x 2박'}</span>
                                            <span>{'$236,000'}</span>
                                        </div>
                                        <div>
                                            <span>{'청소비'}</span>
                                            <span>{'$17,000'}</span>
                                        </div>
                                        <div>
                                            <span>{'에어비앤비 서비스 수수료'}</span>
                                            <span>{'$39,290'}</span>
                                        </div>
                                        <hr />
                                    </div>

                                    <div>
                                        <div>
                                            <span>{'총 합계(KRW)'}</span>
                                            <span>{'$292,290'}</span>
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
                        <PaymentWidget bookingInfo={bookingInfo} />
                    </Modal>
                </div>
            </div>
        </>
    )
}

export default Booking
