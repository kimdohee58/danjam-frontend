import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom';
import Insert from './dorm/Insert';
import AInsert from './amenity/AInsert';
import RInsert from './room/RInsert';
import Auth from './users/Auth';
import Register from './users/Register';
import Main from './Main';

import SellerCalendar from './seller/SellerCalendar';
import SellerList from './seller/SellerList';
import SellerCalendar2 from './seller/SellerCalendar2';
import Approve from './admin/Approve';
import MemberList from './admin/MemberList';
import Layout from './layout/Layout';
import MyPage from './users/MyPage';
import Privacy from './users/Privacy';
import Bookings from './users/Bookings';
import WishPage from './users/WishPage';
import DormOne from "./dorm/DormOne";
import ReviewCard from "./review/ReviewCard";
import ReviewList from "./review/ReviewList";
import ReviewWriteModal from "./review/ReviewWriteModal";
import ReviewListModal from "./review/ReviewListModal";


const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<Layout/>}>
                <Route path="login" element={<Auth/>}/>
                <Route path="signUp" element={<Register/>}/>
                <Route path="/">
                    <Route index element={<Main/>}/>
                    {/*<Route path="search/Search" element={<Search/>}/>*/}
                </Route>

                <Route path="dorm/:id" element={<DormOne/>}/>
                <Route path="dorm/insert" element={<Insert/>}/>
                <Route path="amenity/AInsert/:id" element={<AInsert/>}/>
                <Route path="room/RInsert/:id" element={<RInsert/>}/>
                <Route path="seller">
                    <Route path="SellerList" element={<SellerList/>}/>
                    <Route path="SellerCalendar" element={<SellerCalendar/>}/>
                    <Route path="SellerCalendar2" element={<SellerCalendar2/>}/>
                </Route>
                <Route path="admin">
                    <Route path="Approve" element={<Approve/>}/>
                    <Route path="MemberList" element={<MemberList/>}/>
                </Route>

                <Route path="users/:id/my-page" >
                    <Route path="privacy" element={<Privacy />} />
                    <Route path="bookings" element={<Bookings />} />
                    <Route path="wishes" element={<WishPage />} />
                </Route>

                <Route path="review">
                    <Route path="ReviewWriteModal" element={<ReviewWriteModal/>}/>
                    <Route path="ReiviewList" element={<ReviewList/>}/>
                    <Route path="ReviewListModal" element={<ReviewListModal/>}/>
                </Route>

            </Route>
        )
    )
;

function App() {
    return <RouterProvider router={router}/>;
}

export default App;
