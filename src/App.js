import './App.css';
import {Route, Routes} from "react-router-dom";
import Insert from "./dorm/Insert";
import AInsert from "./amenity/AInsert";
import RInsert from "./room/RInsert";
import Auth from "./users/Auth";
import Register from "./users/Register";
import Main from "./Main";
import Booking from './booking/Booking';
import PaymentWidget from './payment/PaymentWidget';
import SuccessPage from './payment/SuccessPage';
import FailPage from './payment/FailPage';

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

                <Route path='/bookings' element={<Booking />} />
                <Route path='/payments' element={<PaymentWidget />} />
                <Route path='/payments-success' element={<SuccessPage />} />
                <Route path='/payments-fail' element={<FailPage />} />
            </Routes>
        </div>
    );
}

export default App;
