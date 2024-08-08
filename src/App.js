import './App.css';
import {Route, Routes} from "react-router-dom";
import DormOne from "./Dorm/DormOne";
import DormList from "./Dorm/DormList";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<DormList/>}/>
            <Route path="/dorm/:id" element={<DormOne/>}/>
        </Routes>
    );
}

export default App;