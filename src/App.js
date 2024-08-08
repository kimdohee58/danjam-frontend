import './App.css';
import {Route, Routes} from "react-router-dom";
import Insert from "./dorm/Insert";
import AInsert from "./amenity/AInsert";
import RInsert from "./room/RInsert";



function App() {
  return (
    <div>
      <Routes>
        <Route path="/dorm/insert" element={<Insert/>}/>
        <Route path="/amenity/AInsert/:id" element={<AInsert/>}/>
        <Route path="/room/RInsert/:id" element={<RInsert/>}/>
      </Routes>
    </div>
  );
}

export default App;
