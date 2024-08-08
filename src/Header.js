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

    // TODO 로그인 한 계정의 id를 path variable 넘겨줘야 함
    const handleMyPage = () => {
        navigate(`/my-page/8`)
    }

    const [isLogin, setIsLogin] = useState(false)
    const [isLogOut, setInLogOut] = useState(true)

    return (
        <>
            <Button onClick={LogIn} disabled={isLogin}>{'로그인'}</Button>
            <Button onClick={SignUp}>{'회원가입'}</Button>
            <Button onClick={LogOut} disabled={isLogOut}>{'로그아웃'}</Button>
            <Button onClick={Home}>{'home'}</Button>
            <Button onClick={handleMyPage}>{'My Page'}</Button>
        </>
    )
}

export default Header