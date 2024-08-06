import { useLocation, useNavigate, useParams } from 'react-router-dom'
import './Booking.css'

const Booking = () => {
    const location = useLocation()
    const navigate = useNavigate()
    // const bookingInfo = { ...location.state }
    const bookingInfo = {
        user: {
            id: 1,
            email: 'test1@test.com',
            name: 'test1',
            phoneNumber: '1011111111',
        },
        dormId: 1,
    }

    const handleClick = () => {
        navigate('/payments', {
            state: bookingInfo,
        })
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
                        onClick={handleClick}
                    >
                        {'예약 요청'}
                    </button>
                </div>
            </div>
        </>
    )
}

export default Booking
