import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, Menu, X, MessageCircle, ChevronDown } from 'lucide-react';
import { createGeneralInquiryWhatsappUrl } from '../utils/whatsapp';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate }) => {
  const { settings, categories, adminUser } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const directWhatsappUrl = createGeneralInquiryWhatsappUrl(
    settings.whatsappNumber,
    'General Store Inquiry',
    'Hello Bola Wardrobe, I would like to inquire about your collections.'
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E9E6E0] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: Zone 1 (Brand) — Zone 2 (4-5 Nav Links) — Zone 3 (Primary Action & Affordances) */}
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            className="flex items-center gap-2 group whitespace-nowrap shrink-0"
          >
            <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717] group-hover:text-[#B99A5B] transition-colors">
              {settings.brandName || 'Bola Wardrobe'}
            </span>
          </a>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#171717]"
          >
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className={`hover:text-[#B99A5B] transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentPath === '/' ? 'text-[#B99A5B] border-b-2 border-[#B99A5B]' : 'text-[#171717]'
              }`}
            >
              Home
            </a>

            {/* Shop with Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShopDropdownOpen(true)}
              onMouseLeave={() => setShopDropdownOpen(false)}
            >
              <button
                onClick={() => navigate('/shop')}
                className={`flex items-center gap-1.5 hover:text-[#B99A5B] transition-colors whitespace-nowrap shrink-0 py-1 ${
                  currentPath.startsWith('/shop') ? 'text-[#B99A5B] border-b-2 border-[#B99A5B]' : 'text-[#171717]'
                }`}
                aria-expanded={shopDropdownOpen}
              >
                <span>Collections</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${shopDropdownOpen ? 'rotate-180 text-[#B99A5B]' : 'text-[#626262]'}`} />
              </button>

              {/* Shop Submenu Dropdown */}
              {shopDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-52 z-50">
                  <div className="bg-white border border-[#E9E6E0] shadow-lg rounded-sm py-2">
                    <a
                      href="/shop"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/shop');
                        setShopDropdownOpen(false);
                      }}
                      className="block px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#B99A5B] hover:bg-[#F8F6F2]"
                    >
                      All Collections
                    </a>
                    <div className="h-px bg-[#E9E6E0] my-1" />
                    {categories.map((cat) => (
                      <a
                        key={cat.id}
                        href={`/shop/${cat.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/shop/${cat.slug}`);
                          setShopDropdownOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-[#171717] hover:bg-[#F8F6F2] hover:text-[#B99A5B] transition-colors"
                      >
                        {cat.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a
              href="/shop/wears"
              onClick={(e) => {
                e.preventDefault();
                navigate('/shop/wears');
              }}
              className={`hover:text-[#B99A5B] transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentPath === '/shop/wears' ? 'text-[#B99A5B] border-b-2 border-[#B99A5B]' : 'text-[#171717]'
              }`}
            >
              Wears
            </a>

            <a
              href="/shop/bags"
              onClick={(e) => {
                e.preventDefault();
                navigate('/shop/bags');
              }}
              className={`hover:text-[#B99A5B] transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentPath === '/shop/bags' ? 'text-[#B99A5B] border-b-2 border-[#B99A5B]' : 'text-[#171717]'
              }`}
            >
              Bags
            </a>

            <a
              href="/shop/accessories"
              onClick={(e) => {
                e.preventDefault();
                navigate('/shop/accessories');
              }}
              className={`hover:text-[#B99A5B] transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentPath === '/shop/accessories' ? 'text-[#B99A5B] border-b-2 border-[#B99A5B]' : 'text-[#171717]'
              }`}
            >
              Accessories
            </a>

            <a
              href="/shop/cosmetics"
              onClick={(e) => {
                e.preventDefault();
                navigate('/shop/cosmetics');
              }}
              className={`hover:text-[#B99A5B] transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentPath === '/shop/cosmetics' ? 'text-[#B99A5B] border-b-2 border-[#B99A5B]' : 'text-[#171717]'
              }`}
            >
              Cosmetics
            </a>

            <a
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                navigate('/about');
              }}
              className={`hover:text-[#B99A5B] transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentPath === '/about' ? 'text-[#B99A5B] border-b-2 border-[#B99A5B]' : 'text-[#171717]'
              }`}
            >
              About
            </a>

            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                navigate('/contact');
              }}
              className={`hover:text-[#B99A5B] transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentPath === '/contact' ? 'text-[#B99A5B] border-b-2 border-[#B99A5B]' : 'text-[#171717]'
              }`}
            >
              Contact
            </a>
          </nav>

          {/* Zone 3: Functional Affordances & Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Toggle Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#171717] hover:text-[#B99A5B] transition-colors"
              aria-label="Toggle search catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Direct WhatsApp Quick Chat */}
            <a
              href={directWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat directly on WhatsApp"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-medium text-[#171717] hover:text-[#25D366] transition-colors px-2.5 py-1.5 border border-[#E9E6E0] rounded-sm hover:border-[#25D366]/40"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span className="hidden md:inline">WhatsApp</span>
            </a>

            {/* Primary Action Button: Book a Styling Consultation */}
            <button
              onClick={() => navigate('/book')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold tracking-wide uppercase text-white bg-[#171717] hover:bg-[#B99A5B] transition-colors whitespace-nowrap shrink-0 shadow-sm rounded-sm"
            >
              Book Styling
            </button>


            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#171717] hover:text-[#B99A5B] transition-colors"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Input Row */}
        {searchOpen && (
          <div className="py-3 border-t border-[#E9E6E0] animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-[#71717A]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search styles, batik sets, bags, accessories, or cosmetics..."
                className="w-full pl-9 pr-24 py-2 text-sm bg-[#F8F6F2] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-sm text-[#171717] placeholder-[#71717A]"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-1 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-[#171717] text-white hover:bg-[#B99A5B] rounded-sm transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 top-20 z-50 lg:hidden bg-white/98 backdrop-blur-md border-t border-[#E9E6E0] overflow-y-auto p-6"
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold">
                Categories
              </span>
              <a
                href="/shop"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/shop');
                  setMobileMenuOpen(false);
                }}
                className="text-lg font-medium text-[#171717] hover:text-[#B99A5B] py-1 border-b border-[#E9E6E0]/60"
              >
                All Collections
              </a>
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  href={`/shop/${cat.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/shop/${cat.slug}`);
                    setMobileMenuOpen(false);
                  }}
                  className="text-lg font-medium text-[#171717] hover:text-[#B99A5B] py-1 border-b border-[#E9E6E0]/60"
                >
                  {cat.name}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold">
                Company &amp; Services
              </span>
              <a
                href="/about"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/about');
                  setMobileMenuOpen(false);
                }}
                className="text-base text-[#171717] hover:text-[#B99A5B] py-1"
              >
                About Bola Wardrobe
              </a>
              <a
                href="/book"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/book');
                  setMobileMenuOpen(false);
                }}
                className="text-base font-semibold text-[#B99A5B] py-1"
              >
                Book a Styling Consultation
              </a>
              <a
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/contact');
                  setMobileMenuOpen(false);
                }}
                className="text-base text-[#171717] hover:text-[#B99A5B] py-1"
              >
                Contact Customer Care
              </a>
              <a
                href="/order-information"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/order-information');
                  setMobileMenuOpen(false);
                }}
                className="text-base text-[#171717] hover:text-[#B99A5B] py-1"
              >
                Order &amp; Delivery Information
              </a>
              <a
                href="/faq"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/faq');
                  setMobileMenuOpen(false);
                }}
                className="text-base text-[#171717] hover:text-[#B99A5B] py-1"
              >
                Frequently Asked Questions
              </a>
            </div>

            <div className="pt-4 flex flex-col gap-3">

              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white font-medium text-sm rounded-sm shadow-sm"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat with Bola Wardrobe on WhatsApp</span>
              </a>
              <button
                onClick={() => {
                  navigate('/shop');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 bg-[#171717] text-white font-medium text-sm uppercase tracking-wider rounded-sm hover:bg-[#B99A5B] transition-colors"
              >
                Explore All Products
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
