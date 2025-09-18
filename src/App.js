
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/common/navbar/Navbar';

import Home from './pages/Home';
import Footer from './components/common/footer/Footer';

import About from './pages/About';

import Entrepreneurship from './pages/Entrepreneurship';
import LatestNewsArticles from './pages/LatestNewsArticles';
import ActivitiesTravels from './pages/ActivitiesTravelPage';
import Login from './pages/Logiin/Login';
import MultiStepRegister from './pages/Register/MultiStepRegister';
import Gallery from './pages/Gallery/Gallery';
import PaymentPage from './components/payment/PaymentPage';
import Helo from './pages/Helo/Helo';
import Membership from './components/membership/Membership';
import EventsSection from './components/events/EventsSection';
import AllEventsPage from './components/events/AllEvents/AllEventsPage';
import EventDetailsPage from './components/events/EventDetailsPage/EventDetailsPage';
import EventRegistrationPage from './components/events/EventRegistrationPage/EventRegistrationPage';
import QRCodeScanner from './components/QRCodeScanner/QRCodeScanner';

import UserManagement from './components/testing/UserManagement';
import { ModalProvider } from './contexts/ModalContext';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
// import QRCheckInAdmin from './components/checkin/QRCheckInAdmin';
import QRCheckInPage from './components/checkin/QRCheckInPage';
import PasswordReset from './pages/forgotpassowrd/PasswordReset';
import ForgotPassword from './pages/forgotpassowrd/ForgotPassword';
import UserProfileEditor from './pages/Edits/UserProfileEditor';

import './contexts/notifications.css';
import { NotificationProvider } from './contexts/NotificationContext';




function App() {
  return (
         <NotificationProvider>
    <Router>
    
      {/* <TopBar/> */}
    <Navbar />
    <ModalProvider>
          <ScrollToTop />
    <Routes>
      
    <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<MultiStepRegister/>} />
      <Route path="/" element={<Home />} />
      <Route path="/helo" element={<Helo/>} />
      <Route path="/about" element={<About/>} />
      {/* <Route path="/gallery" element={<Trips/>} /> */}
      <Route path="/gallery" element={<Gallery/>} />

      <Route path="/entrepreneurship" element={<Entrepreneurship/>} />
      <Route path="/newsandarticles" element={<LatestNewsArticles/>} />
      <Route path="/activitiesandtravels" element={<ActivitiesTravels/>} />

      <Route path="/pay" element={<PaymentPage/>} />
      <Route path="/membership-card" element={<Membership/>} />

      <Route path="/featured-events" element={<EventsSection />} />
      <Route path="/all-events" element={<AllEventsPage />} />
      <Route path="/events/:eventId" element={<EventDetailsPage />} />
      <Route path="/events/:eventId/register" element={<EventRegistrationPage />} />

      <Route path="/verify-qr" element={<QRCodeScanner />} />
      <Route path="/checkuser" element={<UserManagement />} />
      <Route path="/qr-checkin" element={<QRCheckInPage />} />
      <Route path="/reset-password/:token" element={<PasswordReset />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/profile-edit" element={<UserProfileEditor/>} />








 




      


 
    </Routes>
    </ModalProvider>
    <Footer/>

  </Router>
      </NotificationProvider>
  );
}

export default App;
