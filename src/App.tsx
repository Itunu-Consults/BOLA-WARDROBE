import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MessageCircle } from 'lucide-react';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { AboutPage } from './pages/AboutPage';
import { BookingPage } from './pages/BookingPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { OrderInfoPage } from './pages/OrderInfoPage';
import { PrivacyPolicyPage, TermsPage } from './pages/LegalPages';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminBookings } from './pages/admin/AdminBookings';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminMedia } from './pages/admin/AdminMedia';
import { AdminSettings } from './pages/admin/AdminSettings';

function AppContent() {
  const { adminUser, adminToken, isLoading } = useStore();
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    () => new URLSearchParams(window.location.search)
  );

  // Synchronize browser history and hash navigation
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setCurrentPath('/admin');
      } else {
        setCurrentPath(window.location.pathname || '/');
      }
      setSearchParams(new URLSearchParams(window.location.search));
    };

    // Keyboard shortcut for owner: Ctrl+Shift+A or Cmd+Shift+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigate('/admin');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('keydown', handleKeyDown);

    if (window.location.hash === '#admin') {
      setCurrentPath('/admin');
    }

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navigate = (to: string) => {
    const [pathPart, queryPart] = to.split('?');
    window.history.pushState({}, '', to);
    setCurrentPath(pathPart || '/');
    setSearchParams(new URLSearchParams(queryPart || ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin routing logic
  const isAdminRoute = currentPath.startsWith('/admin') || currentPath === '/admin' || (typeof window !== 'undefined' && window.location.hash === '#admin');

  if (isAdminRoute) {
    if (!adminToken) {
      return <AdminLoginPage navigate={navigate} />;
    }

    // Determine active admin tab from path
    let activeTab = 'dashboard';
    if (currentPath.includes('/admin/products')) activeTab = 'products';
    else if (currentPath.includes('/admin/orders')) activeTab = 'orders';
    else if (currentPath.includes('/admin/bookings')) activeTab = 'bookings';
    else if (currentPath.includes('/admin/categories')) activeTab = 'categories';
    else if (currentPath.includes('/admin/messages')) activeTab = 'messages';
    else if (currentPath.includes('/admin/media')) activeTab = 'media';
    else if (currentPath.includes('/admin/settings')) activeTab = 'settings';
    else if (currentPath.includes('/admin/categories')) activeTab = 'categories';
    else if (currentPath.includes('/admin/messages')) activeTab = 'messages';
    else if (currentPath.includes('/admin/media')) activeTab = 'media';
    else if (currentPath.includes('/admin/settings')) activeTab = 'settings';

    return (
      <AdminLayout
        currentTab={activeTab}
        setCurrentTab={(tab) => {
          const target = tab === 'dashboard' ? '/admin' : `/admin/${tab}`;
          navigate(target);
        }}
        navigate={navigate}
      >
        {activeTab === 'dashboard' && <AdminDashboard setCurrentTab={(t) => navigate(t === 'dashboard' ? '/admin' : `/admin/${t}`)} navigate={navigate} />}
        {activeTab === 'products' && <AdminProducts navigate={navigate} />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'bookings' && <AdminBookings />}
        {activeTab === 'categories' && <AdminCategories />}
        {activeTab === 'messages' && <AdminMessages />}
        {activeTab === 'media' && <AdminMedia />}
        {activeTab === 'settings' && <AdminSettings />}
      </AdminLayout>
    );
  }

  // Public routing
  const renderPublicPage = () => {
    // Product Details route: /product/:slug
    if (currentPath.startsWith('/product/')) {
      const slug = currentPath.replace('/product/', '').replace(/\/$/, '');
      return <ProductDetailsPage slug={slug} navigate={navigate} />;
    }

    // Specific category shop route: /shop/:category
    if (currentPath.startsWith('/shop/')) {
      const cat = currentPath.replace('/shop/', '').replace(/\/$/, '');
      return <ShopPage navigate={navigate} initialCategory={cat} />;
    }

    switch (currentPath) {
      case '/':
        return <HomePage navigate={navigate} />;
      case '/shop':
        return <ShopPage navigate={navigate} initialSearch={searchParams.get('q') || ''} />;
      case '/about':
        return <AboutPage navigate={navigate} />;
      case '/book':
        return <BookingPage navigate={navigate} />;
      case '/contact':
        return <ContactPage navigate={navigate} />;
      case '/faq':
        return <FAQPage navigate={navigate} />;
      case '/order-information':
        return <OrderInfoPage navigate={navigate} />;
      case '/privacy-policy':
        return <PrivacyPolicyPage navigate={navigate} />;
      case '/terms':
        return <TermsPage navigate={navigate} />;
      default:
        return <NotFoundPage navigate={navigate} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFFFF] text-[#171717] font-sans">
      <AnnouncementBar navigate={navigate} />
      <Header currentPath={currentPath} navigate={navigate} />
      <main className="flex-1 w-full" id="main-content">
        {renderPublicPage()}
      </main>
      <Footer navigate={navigate} />

      {/* Floating Concierge WhatsApp Action */}
      <a
        href="https://wa.link/ghucjd"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2.5 px-4 py-3 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20b858] transition-all duration-300 hover:scale-105 group"
        aria-label="Order or Chat on WhatsApp: https://wa.link/ghucjd"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline text-xs font-semibold tracking-wider uppercase">
          WhatsApp Concierge
        </span>
      </a>
    </div>
  );
}

export function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
