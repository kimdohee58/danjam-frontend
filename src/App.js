import './App.css';
import {Route, Routes} from "react-router-dom";
import Insert from "./dorm/Insert";
import AInsert from "./amenity/AInsert";
import RInsert from "./room/RInsert";
import Auth from "./users/Auth";
import Register from "./users/Register";
import Main from "./Main";
import Privacy from './users/Privacy'
import Bookings from './users/Bookings'

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
              <Route path={'/my-page/:id'} element={<Privacy />}/>
              <Route path={'/my-page/:id/bookings'} element={<Bookings />}/>
          </Routes>
      </div>
  );
}

export default App
