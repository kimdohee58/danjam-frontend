import './App.css';
import { Route, Routes } from 'react-router-dom'
import Booking from './booking/Booking'
import PaymentWidget from './payment/PaymentWidget'
import SuccessPage from './payment/SuccessPage'
import FailPage from './payment/FailPage'

function App() {
  return (
    <Routes>
      <Route path='/bookings' element={<Booking />} />
      <Route path='/payments' element={<PaymentWidget />} />
      <Route path='/success' element={<SuccessPage />} />
      <Route path='/fail' element={<FailPage />} />
    </Routes>
  );
}

export default App;
