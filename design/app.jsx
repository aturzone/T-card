// ============================================
// T-Card — App shell: state + router
// ============================================

function App() {
  // Persistent state
  const [theme, setTheme] = useState(() => localStorage.getItem('tcard.theme') || 'light');
  const [lang, setLangState] = useState(() => localStorage.getItem('tcard.lang') || 'en');
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tcard.cart') || '[]'); } catch (e) { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState({ msg: '', show: false });

  // Router — hash-based
  const parseHash = () => {
    const h = (window.location.hash || '#/').replace(/^#/, '');
    const [path, qs] = h.split('?');
    const query = {};
    if (qs) qs.split('&').forEach(p => { const [k,v] = p.split('='); query[k] = decodeURIComponent(v || ''); });
    return { path: path || '/', query };
  };
  const [{ path: route, query }, setRouter] = useState(parseHash());

  useEffect(() => {
    const handler = () => { setRouter(parseHash()); window.scrollTo({ top: 0, behavior: 'instant' }); };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const navigate = (to) => {
    window.location.hash = '#' + to;
  };

  // Persist
  useEffect(() => {
    localStorage.setItem('tcard.theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('tcard.lang', lang);
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('tcard.cart', JSON.stringify(cart));
  }, [cart]);

  const setLang = (l) => setLangState(l);
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  // Cart actions
  const addToCart = (entry) => {
    setCart(prev => [...prev, { ...entry, id: 'i_' + Math.random().toString(36).slice(2, 9) }]);
    setCartOpen(true);
  };
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, q) => {
    if (q <= 0) return removeFromCart(id);
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: q } : i));
  };
  const clearCart = () => setCart([]);
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const showToast = (msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast({ msg: '', show: false }), 2400);
  };

  // Route resolution
  const renderRoute = () => {
    if (route === '/' || route === '') return <PageHome />;
    if (route === '/shop') return <PageShop />;
    if (route.startsWith('/product/')) return <PageProduct brandId={route.slice('/product/'.length)} />;
    if (route === '/cart') { openCart(); return <PageHome />; }
    if (route === '/checkout') return <PageCheckout />;
    if (route.startsWith('/confirmation/')) return <PageConfirmation orderId={route.slice('/confirmation/'.length)} />;
    if (route === '/about' || route === '/about/') return <PageAbout />;
    if (route === '/faq') return <PageFAQ />;
    if (route === '/contact') return <PageContact />;
    if (route === '/how' || route === '/how-it-works') return <PageHow />;
    if (route === '/account') return <PageAccount />;
    if (route === '/terms') return <PageLegal kind="terms" />;
    if (route === '/privacy') return <PageLegal kind="privacy" />;
    if (route === '/cookies') return <PageLegal kind="cookies" />;
    return <PageNotFound />;
  };

  const ctx = {
    theme, toggleTheme,
    lang, setLang,
    cart, addToCart, removeFromCart, updateQty, clearCart,
    cartOpen, openCart, closeCart,
    showToast,
    route, query, navigate
  };

  return (
    <AppContext.Provider value={ctx}>
      <Header />
      <div key={route}>{renderRoute()}</div>
      <Footer />
      <CartDrawer />
      <Toast message={toast.msg} show={toast.show} />
    </AppContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
