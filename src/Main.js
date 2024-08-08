import {useNavigate} from 'react-router-dom'
import {Button} from 'react-bootstrap'
import axios from 'axios'
import Search from "./search/Search";
import Header from "./Header";

function Main() {
    // 로그인 성공했을 경우 사용 됨
    /* const location = useLocation()
    const userInfo = location.state.userInfo
    if (userInfo != null) {
      console.log(userInfo)
    }*/


    return (
        <>
            <Header/>
            <h1>{'여기가 메인 페이지 입니다.'}</h1>
            <Search/>
        </>
    )
}

export default Main
