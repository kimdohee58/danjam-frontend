import './App.css';
import {Route, Routes} from "react-router-dom";
import Insert from "./dorm/Insert";
import AInsert from "./amenity/AInsert";
import RInsert from "./room/RInsert";
import Auth from "./users/Auth";
import Register from "./users/Register";
import Main from "./Main";
import Privacy from './users/Privacy';
import Bookings from './users/Bookings';
import MyPage from './users/MyPage';
import WishPage from './users/WishPage';
import Booking from './booking/Booking';
import PaymentWidget from './payment/PaymentWidget';
import SuccessPage from './payment/SuccessPage';
import FailPage from './payment/FailPage';

function App() {
  return (
      <div>
          {'App Page'}
          <Routes>
              <Route path={'/'} element={<Main/>}/>
              <Route path={'/login'} element={<Auth/>}/>
              <Route path={'/signUp'} element={<Register/>}/>

              <Route path="/dorm/insert" element={<Insert/>}/>
              <Route path="/amenity/AInsert/:id" element={<AInsert/>}/>
              <Route path="/room/RInsert/:id" element={<RInsert/>}/>

              <Route path={'/my-page/:id'} element={<MyPage />}/>
              <Route path={'/my-page/:id/privacy'} element={<Privacy />}/>
              <Route path={'/my-page/:id/bookings'} element={<Bookings />}/>
              <Route path={'/my-page/:id/wishes'} element={<WishPage />}/>
              {/*TODO : 휘 예약 컴포넌트 넣어야함*/}
              <Route path={'/my-page/:id/reservations'} element={''}/>

              <Route path='/bookings/:id' element={<Booking />} />
              <Route path='/payments/:id' element={<PaymentWidget />} />
              <Route path='/payments-success' element={<SuccessPage />} />
              <Route path='/payments-fail' element={<FailPage />} />
          </Routes>
      </div>
  );
}

export default App
