import {Button} from "react-bootstrap";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {useState} from "react";
import sellerCalendar from "./seller/SellerCalendar";

function Header(props) {
    const navigate = useNavigate()
    console.log(props)

    const SignUp = () => {
        navigate('/signUp')
    }
    const LogIn = () => {
        navigate('/login')
    }
    const LogOut = async () => {
        try {
            const resp = await axios({
                url: 'http://localhost:8080/users/logout',
                method: 'POST',
                withCredentials: true,
            })
            console.log(resp)
            if (resp.status === 200) {
                navigate('/')
            }
        } catch (error) {
            console.log(error)
        }
    }
    const Home = () => {
        navigate('/')
    }

    const REGIST = () => {
        navigate('/dorm/insert')
    }

    const RoomInser = () => {

        navigate('/seller/SellerList' , { state: { userInfo: props.userInfo } });
    };

    const SellerCalendar = () => {

        navigate('/seller/SellerCalendar' , { state: { userInfo: props.userInfo } });
    };



    return (
        <>
            {props.userInfo.name !== '' ? (<h3>{props.userInfo.name}</h3>) : (<h3>비회원</h3>)}
            <div hidden={props.userInfo.name !== '' ? true : false}>
                <Button onClick={LogIn}>{'로그인'}</Button>
                <Button onClick={SignUp}>{'회원가입'}</Button>
            </div>
            <div hidden={props.userInfo.name === '' ? true : false}>
                <Button onClick={LogOut}>{'로그아웃'}</Button>
            </div>
            <Button onClick={Home}>{'home'}</Button>
            <div hidden={props.userInfo.role !== 'ROLE_SELLER'}>
                <Button onClick={REGIST}>{'숙소등록'}</Button>
                <Button onClick={RoomInser}>{'방추가'}</Button>
                <Button onClick={SellerCalendar}>{'예약리스트'}</Button>
            </div>

        </>
    )
}

export default Header