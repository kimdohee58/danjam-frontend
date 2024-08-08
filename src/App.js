import './App.css'
import {Route, Routes} from "react-router-dom"
import Auth from "./users/Auth"
import Register from "./users/Register"
import Main from "./Main"
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
              <Route path={'/my-page/:id'} element={<Privacy />}/>
              <Route path={'/my-page/:id/bookings'} element={<Bookings />}/>
          </Routes>
      </div>
  )
}

export default App
