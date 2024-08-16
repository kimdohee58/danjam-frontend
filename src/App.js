import './App.css';
import {Route, Routes} from "react-router-dom";
import DormOne from "./Dorm/DormOne";
import RoomOne from "./Room/RoomList";
import BookingOne from "./Booking/BookingPage";

const App = () => {
    return (
        <Routes>
            <Route path="/dorms/:id" element={<DormOne/>}/>
            <Route path="/rooms/:id" element={<RoomOne/>}/>
            <Route path="/bookings/:id" element={<BookingOne/>}/>
        </Routes>
    );
};

export default App;
