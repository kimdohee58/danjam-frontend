import './App.css';
import {Route, Routes} from "react-router-dom";
import Insert from "./dorm/Insert";
import AInsert from "./amenity/AInsert";
import RInsert from "./room/RInsert";
import Auth from "./users/Auth";
import Register from "./users/Register";
import Main from "./Main";


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
            </Routes>
        </div>
    );
}
export default App;
