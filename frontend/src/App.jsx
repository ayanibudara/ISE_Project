

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import AppointmentForm from "./pages/appointment/appointmentform";
import Header from "./components/Header"
import Footer from "./components/Footer"
import AppointmentsPage from "./pages/appointment/AppointmentsPage";
import PackageForm from './pages/Services/PackageForm';
import Packages from './pages/Services/PackagePage';
function App() {
  

  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apform" element={<AppointmentForm/>}/>
          <Route path="/appoiments" element={<AppointmentsPage/>}/>
          <Route path="/addpackage" element={<PackageForm/>}/>
          <Route path="/packages" element={<Packages/>}/>
        </Routes>  
         <Footer />
      </Router>
      
      
    </>
  );
}

export default App;