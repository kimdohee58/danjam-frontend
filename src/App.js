import './App.css';
import {Route, Routes} from "react-router-dom";
import Insert from "./dorm/Insert";
import AInsert from "./amenity/AInsert";
import RInsert from "./room/RInsert";
import Auth from "./users/Auth";
import Register from "./users/Register";
import Main from "./Main";

import SellerCalendar from "./seller/SellerCalendar";
import SellerList from "./seller/SellerList";
import SellerCalendar2 from "./seller/SellerCalendar2";
import Approve from "./admin/Approve";
import MemberList from "./admin/MemberList";


function App() {
    return (
        <div>
            <Routes>
                <Route path={'/login'} element={<Auth/>}/>
                <Route path={'/signUp'} element={<Register/>}/>
                <Route path={'/'} element={<Main/>}/>
                <Route path="/dorm/insert" element={<Insert/>}/>
                <Route path="/amenity/AInsert/:id" element={<AInsert/>}/>
                <Route path="/room/RInsert/:id" element={<RInsert/>}/>
                <Route path="/seller/SellerList" element={<SellerList/>}/>
                <Route path="/seller/SellerCalendar" element={<SellerCalendar/>}/>
                <Route path="/seller/SellerCalendar2" element={<SellerCalendar2/>}/>
                <Route path="/admin/Approve" element={<Approve/>}/>
                <Route path="/admin/MemberList" element={<MemberList/>}/>
            </Routes>
        </div>
    );
}

export default App;
