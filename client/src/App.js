import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";
import { Filter } from "./pages/Filter/Search-Filter";
import Register from "./pages/Register/Register";
// import Login from "./pages/Login/Login";
import { UserProvider } from "./context/UserContext";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Form1 from "./signup/verify/form1";
import Form2 from "./signup/verify/form2";
import ProfileSetup from "./pages/ProfileSetup/profileSetup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUpGoogle from "./signup/verify/signUpGoogle";
import Signin from "./verify/signin1";
import Signin2 from "./verify/signin2";
import Login1 from "./verify/login1";
import Reset_password from "./verify/reset-password";
import Complete_signup from "./verify/Complete_signup";
import Signup_Email from "./verify/Complete_signup_email";
import Account_Recovery from "./verify/Account_Recovery";
import Mobile_verification from "./verify/Mobile_verification";
import Account_recovery_options from "./verify/Account_recovery_options";
import Account_Recovery_Email from "./verify/Account_Recovery_Email";
import Email_verification from "./verify/Email_Verification";
import Almost_there from "./verify/Almost_there";
import Profile from "./pages/Profile/Profile.js";
// import ProfileManage from "./pages/Profile/ProfileManage.js";
import ProfileManage from "./pages/Profile/ProfilePage.js";
import StepOne from "./verify/ServiceForm/StepOne.js";
import ServiceForm from "./verify/ServiceForm/ServiceForm.js";
import StepTwo from "./verify/ServiceForm/StepTwo.js";
import ErrorPage from "./pages/Error/Error.js";
import FAQ from "./pages/FAQ/Faq.js";
import HowToVideos from "./components/HowToVideos/HowToVideos.js";
import ScrollToTop from "./components/ScrollToTop.js";
import Construction from "./components/UnderConstruction/Construction.js"
function AppContent() {
  const location = useLocation();
  const noNavbarRoutes = ["/signin2", "/signup","/signup/email", "/login"];
  const hideNavbar = noNavbarRoutes.includes(location.pathname);
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Filter />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} /> */}
        <Route path="/Consumer-Signup" element={<Form1 />} />
        <Route path="/Consumer-Signup2" element={<Form2 />} />
        <Route path="/profileSetup" element={<ProfileSetup />} />
        <Route path="/signUp-google" element={<SignUpGoogle />} />
        <Route path="/signup" element={<Signin />} />
        <Route path="/login" element={<Login1 />} />
        <Route path="/signin2" element={<Signin2 />} />
        <Route path="/reset-password" element={<Reset_password />} />
        <Route path="/signup/setup-profile" element={<Complete_signup />} />
        <Route path="/signup/email" element={<Signup_Email />} />
        <Route path="/account-recovery" element={<Account_Recovery />} />
        <Route path="/mobile-verification" element={<Mobile_verification />} />
        <Route
          path="/account-recover-options"
          element={<Account_recovery_options />}
        />
        <Route
          path="/account-recovery-email"
          element={<Account_Recovery_Email />}
        />
        <Route path="/email-verification" element={<Email_verification />} />
        <Route path="/signup/complete" element={<Almost_there />} />
        <Route path="/profile-div" element={<Profile />} />
        <Route path="/profile/manage" element={<ProfileManage />} />
        {/* service provider */}
        <Route path="/signup/basic-info" element={<StepTwo />} />
        <Route path="/signup/service-form" element={<ServiceForm />} />
        <Route path="/faqs" element={<FAQ />} />
        {/* how to videos */}
        <Route path="/how-to-videos" element={<HowToVideos />} />
        <Route path="/under-construction" element={<Construction />} />

        {/* wildcard default route if nothing above matches */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
      <ToastContainer />
    </UserProvider>
  );
}

export default App;
