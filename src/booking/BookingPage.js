import React from 'react';
import {useLocation} from 'react-router-dom';

const BookingPage = () => {
    const location = useLocation();
    const {user} = location.state.bookingInfo;

    console.log("북킹페이지 콘솔 로그에서 북킹인포 제대로 들어오는지 확인", user);

    return (
        <div>
            <h2>예약 정보 확인</h2>

            {/* 유저 정보 표시 */}
            <h3>유저 정보</h3>
            <p>이름: {user.name || "이름이 없습니다"}</p>
            <p>이메일: {user.email || "이메일이 없습니다"}</p>
            <p>전화번호: {user.phoneNumber || "전화번호가 없습니다"}</p>


        </div>
    );
};

export default BookingPage;
