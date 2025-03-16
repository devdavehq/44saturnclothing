import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ComingSoon from './pages/coming-soon'
import HomePage from './pages/HomePage'
// import YearBook from './pages/LookBook.jsx/YearBook';
// import Returning from './pages/Returning';
import Shop from './pages/shop';
import Dashboard from './pages/admin/dashboard';
import CheckoutPage from './pages/checkout'; // The checkout page with paystack
import About from './pages/about'; 
import Contact from './pages/contact';
// import Product from './pages/ProductPage'; 
import Login from './pages/admin/login';
 






// import ProductPage from './pages/ProductPage'
import ResetPassword from './pages/admin/reset-password';
import ResetPasswordToken from './pages/admin/reset-password-token';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/checkout/:id" element={<CheckoutPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* <Route path="/product/:id" element={<Product />} /> */}

        <Route path="/admin/dashboard/*" element={<Dashboard />} />
        <Route path="admin/login" element={<Login />} />
        <Route path="admin/reset-password" element={<ResetPassword />} />
        <Route path="admin/reset-password/:token" element={<ResetPasswordToken />} />
     
        {/* <Route path="/product/:name" element={<ProductPage />} />i */}

      </Routes>
    </Router>
    </>
  );
}

export default App;
