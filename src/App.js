import './App.css';
import {Route, Routes} from "react-router-dom";
import DormOne from "./Dorm/DormOne";
import RoomOne from "./Room/RoomList";
import BookingOne from "./Booking/BookingPage";
import Map from "./Map /Map"; // Map 컴포넌트 임포트


const App = () => {
    return (
        <Routes>
            <Route path="/dorms/:id" element={<DormOne/>}/>
            <Route path="/rooms/:id" element={<RoomOne/>}/>
            <Route path="/bookings/:id" element={<BookingOne/>}/>
            <Route path="/Map" element={<Map/>}/> {/* 새로운 경로에 Map 컴포넌트 추가 */}
        </Routes>
    );
};

export default App;
