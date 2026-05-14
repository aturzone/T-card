import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { Toast } from '@/components/ui/Toast';
import { Home } from '@/pages/Home';
import { Shop } from '@/pages/Shop';
import { Product } from '@/pages/Product';
import { Checkout } from '@/pages/Checkout';
import { Confirmation } from '@/pages/Confirmation';
import { About } from '@/pages/About';
import { FAQ } from '@/pages/FAQ';
import { Contact } from '@/pages/Contact';
import { How } from '@/pages/How';
import { Account } from '@/pages/Account';
import { Legal } from '@/pages/Legal';
import { NotFound } from '@/pages/NotFound';

function CartRoute() {
  const { openCart } = useApp();
  const navigate = useNavigate();
  useEffect(() => {
    openCart();
    navigate('/', { replace: true });
  }, [openCart, navigate]);
  return null;
}

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);
  return null;
}

export function App() {
  const { toastMsg, toastShow } = useApp();
  const location = useLocation();

  return (
    <>
      <Header />
      <ScrollToTop />
      <div key={location.pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<CartRoute />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation/:id" element={<Confirmation />} />
          <Route path="/about" element={<About />} />
          <Route path="/about/" element={<Navigate to="/about" replace />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/how" element={<How />} />
          <Route path="/how-it-works" element={<Navigate to="/how" replace />} />
          <Route path="/account" element={<Account />} />
          <Route path="/terms" element={<Legal kind="terms" />} />
          <Route path="/privacy" element={<Legal kind="privacy" />} />
          <Route path="/cookies" element={<Legal kind="cookies" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
      <CartDrawer />
      <Toast message={toastMsg} show={toastShow} />
    </>
  );
}
