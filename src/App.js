import './App.css';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
    useLocation
} from "react-router-dom";
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
import Layout from "./layout/Layout";


const router = createBrowserRouter(

    createRoutesFromElements(

        <Route path="/" element={<Layout />}>
            <Route path="/login" element={<Auth />} />
            <Route path="/signUp" element={<Register />} />
            <Route path="/" element={<Main />} />
            <Route path="/dorm/insert" element={<Insert />} />
            <Route path="/amenity/AInsert/:id" element={<AInsert />} />
            <Route path="/room/RInsert/:id" element={<RInsert />} />
            <Route path="/seller">
                <Route path="SellerList" element={<SellerList />} />
                <Route path="SellerCalendar" element={<SellerCalendar />} />
                <Route path="SellerCalendar2" element={<SellerCalendar2 />} />
            </Route>
            <Route path="/admin">
                <Route path="Approve" element={<Approve />} />
                <Route path="MemberList" element={<MemberList />} />
            </Route>
        </Route>
    )
);

function App() {
    return <RouterProvider router={router} />;
}



export default App;
