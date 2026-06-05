import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { Toast } from '@/components/ui/Toast';
import { useLenis } from '@/hooks/useLenis';
import { Home } from '@/pages/Home';

const Shop = lazy(() => import('@/pages/Shop').then((m) => ({ default: m.Shop })));
const Product = lazy(() => import('@/pages/Product').then((m) => ({ default: m.Product })));
const Checkout = lazy(() => import('@/pages/Checkout').then((m) => ({ default: m.Checkout })));
const Confirmation = lazy(() => import('@/pages/Confirmation').then((m) => ({ default: m.Confirmation })));
const About = lazy(() => import('@/pages/About').then((m) => ({ default: m.About })));
const FAQ = lazy(() => import('@/pages/FAQ').then((m) => ({ default: m.FAQ })));
const Contact = lazy(() => import('@/pages/Contact').then((m) => ({ default: m.Contact })));
const How = lazy(() => import('@/pages/How').then((m) => ({ default: m.How })));
const Account = lazy(() => import('@/pages/Account').then((m) => ({ default: m.Account })));
const Legal = lazy(() => import('@/pages/Legal').then((m) => ({ default: m.Legal })));
const NotFound = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFound })));

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
  useLenis();

  return (
    <>
      <Header />
      <ScrollToTop />
      <div key={location.pathname}>
        <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/cart" element={<CartRoute />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmation/:id" element={<Confirmation />} />
            <Route path="/about" element={<About />} />
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
        </Suspense>
      </div>
      <Footer />
      <CartDrawer />
      <Toast message={toastMsg} show={toastShow} />
    </>
  );
}
