// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Shared components
import { Navbar } from './home/Navbar';
import './App.css';

// Main pages
import Home from './home/Home';
import About from './home/About';
import Services from './home/Services';
import Hospital from './home/Hospital';

// Authentication and admin
import Login from './login/Login.jsx';
import DoctorSignup from './login/DoctorSignup.jsx';
import PatientSignup from './login/PatientSignup.jsx';
import P_WPage from './login/P_WPage.jsx';
import CreateBlog from './login/CreateBlog.jsx';
import WriteBlogPage from './login/WriteBlogPage.jsx';
import Signup from './login/Signup.jsx';
import AdminPage from './login/AdminPage.jsx';
import PatientDashboard from './login/PatientDashboard.jsx';

// Pages for Doctors and Appointments
import DoctorList from './section/Doctors_List';
import Form from './login/form';
import Slip from './login/slip';
import BlogPage from './section/blogpage.jsx';
import BookAppointment from './home/BookAppointments.jsx';

// Import DoctorContext
import { DoctorProvider } from './context/DoctorContext';
import { AppointmentProvider } from './context/AppointmentContext';
import { DoctorDataProvider } from "./context/DoctorDataContext";
function App() {
  return (
    <DoctorProvider>
        <AppointmentProvider>
          <DoctorDataProvider>
          <Router>
            <Routes>
              {/* Pages with Navbar */}
              <Route
                path="/"
                element={
                  <>
                    <Navbar />
                    <div>
                      {/* Sections for scrolling */}
                      <section id="home"><Home /></section>
                      <section id="about"><About /></section>
                      <section id="services"><Services /></section>
                      <section id="booking"><BookAppointment /></section>
                      <section id="hospitals"><Hospital /></section>
                      <section id="blogpage"><BlogPage /></section>
                    </div>
                  </>
                }
              />

              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/patient-signup" element={<PatientSignup />} />
              <Route path="/doctor-signup" element={<DoctorSignup />} />

              {/* Admin and Dashboard Routes */}
              <Route path="/adminpage" element={<AdminPage />} />
              <Route path="/PatientDashboard" element={<PatientDashboard />} />
              <Route path="/P_WPage" element={<P_WPage />} />

              {/* Blog Routes */}
              <Route path="/create-blog" element={<CreateBlog />} />
              <Route path="/write-blog-page" element={<WriteBlogPage />} />
              <Route path="/blogpage" element={<BlogPage />} />
              <Route path="/CreateBlog" element={<CreateBlog />} />

              {/* Routes for Doctors and Appointments */}
              <Route
                path="/doctor-list"
                element={
                  <section className="doctor-section mt-8 lg:ml-[320px] sm:ml-14 md:ml-14">
                    <DoctorList />
                  </section>
                }
              />
              <Route
                path="/form"
                element={
                  <Form />
                }
              />
              <Route
                path="/slip"
                element={<Slip />}
              />

              {/* Redirect unmatched paths */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
          </DoctorDataProvider>
      </AppointmentProvider>
    </DoctorProvider>
  );
}

export default App;
