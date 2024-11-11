import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Components/Register';
import Login from './Components/Login';
import ForgotPassword from './Components/ForgotPassword';
import ResetPassword from './Components/ResetPassword';
import Dashboard from './Components/Dashboard';

function App() {
  

  return (
    <>
       <Router>
        <Routes>
        <Route path="/" element={<Login />} />
       <Route path="/register" element={<Register />} />
       <Route path="/password-reset" element={<ForgotPassword />} />
       <Route path="/api/password-reset-confirm/" element={<ResetPassword />} />
       <Route path="/dashboard" element={<Dashboard />} />
       </Routes>
       </Router>
    </>
  );
}

export default App
