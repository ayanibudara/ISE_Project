

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import AppointmentForm from "./pages/appointment/appointmentform";
import Header from "./components/Header"
import Footer from "./components/Footer"
import AppointmentsPage from "./pages/appointment/AppointmentsPage";

function App() {
  

  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apform" element={<AppointmentForm/>}/>
          <Route path="/appoiments" element={<AppointmentsPage/>}/>
        </Routes>  
         <Footer />
      </Router>
      
      
    </>
  );
}

export default App;