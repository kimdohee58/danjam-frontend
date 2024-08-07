import './App.css';
import {Route, Routes} from "react-router-dom";
import Auth from "./users/Auth";
import Register from "./users/Register";
import Main from "./Main";

function App() {
  return (
      <div>
          {'App Page'}
          <Routes>
              <Route path={'/login'} element={<Auth/>}/>
              <Route path={'/signUp'} element={<Register/>}/>
              <Route path={'/'} element={<Main/>}/>
          </Routes>
      </div>
  );
}

export default App;
