import Search from "./search/Search";
import {useLocation} from "react-router-dom";

function Main() {
    let userInfo={
        id: '',
        name: '',
        email: '',
        phoneNum: '',
        role: ''
    }
    const location = useLocation();
    if (location.state != null) {
        userInfo = location.state.userInfo

    }
    console.log("userInfo", userInfo)

    return (
        <>
            <Search userInfo={userInfo}/>
        </>
    )
}

export default Main
