import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useState} from "react";

const Header = () => {
    const navigate = useNavigate()

    const SignUp = () => {
        navigate('/signUp')
    }
    const LogIn = () => {
        navigate('/login')
    }
    const LogOut = async () => {
        try {
            const resp = await axios.post('http://localhost:8080/user/logout')
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

    const [isLogin, setIsLogin] = useState(false)
    const [isLogOut, setInLogOut] = useState(true)

    return (
        <>
            <Button onClick={LogIn} disabled={isLogin}>{'로그인'}</Button>
            <Button onClick={SignUp}>{'회원가입'}</Button>
            <Button onClick={LogOut} disabled={isLogOut}>{'로그아웃'}</Button>
            <Button onClick={Home}>{'home'}</Button>
        </>
    )
}

export default Header