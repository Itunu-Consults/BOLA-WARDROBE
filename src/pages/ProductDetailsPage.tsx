import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductVisual } from '../components/ProductVisual';
import { ProductCard } from '../components/ProductCard';
import {
  MessageCircle,
  Check,
  ShieldCheck,
  Sparkles,
  Truck,
  RotateCcw,
  Calendar,
  Share2,
  Copy,
} from 'lucide-react';
import { createProductOrderWhatsappUrl } from '../utils/whatsapp';

interface ProductDetailsPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ slug, navigate }) => {
  const { products, settings, submitOrderRequest } = useStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const product = products.find((p) => p.slug === slug);

  // Initialize default options when product changes
  useEffect(() => {
    if (product?.variants) {
      const defaults: Record<string, string> = {};
      product.variants.forEach((v) => {
        if (v.values && v.values.length > 0) {
          defaults[v.name] = v.values[0];
        }
      });
      setSelectedOptions(defaults);
      setSelectedImageIndex(0);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-[#FAF9F6] text-center">
        <h2 className="font-serif text-3xl font-semibold text-[#171717] mb-3">
          Piece Not Found
        </h2>
        <p className="text-sm text-[#626262] max-w-md mb-6">
          The item you are searching for is either out of catalog or has been moved.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#171717] text-white hover:bg-[#B99A5B] transition-colors rounded-sm"
        >
          Return to Collections
        </button>
      </div>
    );
  }

  // Related products from the same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.slug !== product.slug && p.isPublished)
    .slice(0, 3);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://bolawardrobe.com/product/${product.slug}`;

  const handleWhatsappOrderClick = () => {
    // Save order request to database
    submitOrderRequest({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      selectedOptions,
      quantity,
    });

    const whatsappUrl = createProductOrderWhatsappUrl({
      whatsappNumber: settings.whatsappNumber,
      product,
      selectedOptions,
      quantity,
      productUrl: currentUrl,
    });

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleModalOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;

    await submitOrderRequest({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      selectedOptions,
      quantity,
      customerName,
      customerPhone,
      customerNotes,
    });

    const emailRecipient = 'ismailrofiatbolanle@gmail.com';
    const emailSubject = `[Order Inquiry] ${product.name} (Qty: ${quantity}) - ${customerName}`;
    const formattedOptions = Object.entries(selectedOptions).map(([k, v]) => `${k}: ${v}`).join(', ') || 'Default';
    const emailBody = `New Order Inquiry from Website:\n\nProduct: ${product.name}\nQuantity: ${quantity}\nOptions: ${formattedOptions}\nCustomer Name: ${customerName}\nCustomer WhatsApp: ${customerPhone}\nSpecial Notes: ${customerNotes || 'None'}\nProduct Page: ${currentUrl}\n\n---\nSent from Bola Wardrobe Boutique`;
    const mailtoUrl = `mailto:${emailRecipient}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    setOrderSuccess(true);

    // Direct email dispatch to ismailrofiatbolanle@gmail.com
    setTimeout(() => {
      try {
        window.location.href = mailtoUrl;
      } catch {
        // fallback
      }
    }, 300);

    // Open official WhatsApp short link
    setTimeout(() => {
      window.open('https://wa.link/ghucjd', '_blank', 'noopener,noreferrer');
    }, 900);
  };

  const copyShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumbs" className="mb-8 flex items-center gap-2 text-xs text-[#71717A]">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            className="hover:text-[#171717] transition-colors"
          >
            Home
          </a>
          <span aria-hidden="true">/</span>
          <a
            href="/shop"
            onClick={(e) => {
              e.preventDefault();
              navigate('/shop');
            }}
            className="hover:text-[#171717] transition-colors"
          >
            Collections
          </a>
          <span aria-hidden="true">/</span>
          <a
            href={`/shop/${product.category}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/shop/${product.category}`);
            }}
            className="hover:text-[#171717] transition-colors capitalize"
          >
            {product.category}
          </a>
          <span aria-hidden="true">/</span>
          <span className="text-[#171717] font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Contiguous PDP Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-20">
          
          {/* Gallery Column (Left, Spans 7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Primary Visual Container */}
            <div className="relative aspect-[4/3] bg-white border border-[#E9E6E0] rounded-sm overflow-hidden shadow-2xs">
              <ProductVisual
                slug={product.slug}
                category={product.category}
                name={product.name}
                imageUrl={product.images[selectedImageIndex] || product.images[0]}
                aspectRatio="4/3"
              />

              {product.label && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#171717] bg-white/95 px-3 py-1 border border-[#E9E6E0] shadow-2xs">
                    {product.label}
                  </span>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails (if multiple images) */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 aspect-square bg-white border rounded-xs overflow-hidden transition-all ${
                      selectedImageIndex === idx
                        ? 'border-[#B99A5B] ring-1 ring-[#B99A5B]'
                        : 'border-[#E9E6E0] opacity-75 hover:opacity-100'
                    }`}
                    aria-label={`View image thumbnail ${idx + 1}`}
                  >
                    <ProductVisual
                      slug={product.slug}
                      category={product.category}
                      name={product.name}
                      imageUrl={img}
                      aspectRatio="1/1"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Assurance Bar below gallery */}
            <div className="p-4 bg-white border border-[#E9E6E0] rounded-sm grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#626262] mt-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B99A5B] shrink-0" />
                <span>Craftsmanship Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#B99A5B] shrink-0" />
                <span>Local &amp; Regional Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <span>Concierge Fit Guidance</span>
              </div>
            </div>

          </div>

          {/* Purchase Module Column (Right, Spans 5 cols on lg) */}
          <div className="lg:col-span-5 bg-white border border-[#E9E6E0] p-6 sm:p-8 rounded-sm shadow-2xs sticky top-24">
            
            {/* Department & Stock Indicator (NO PILLS) */}
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#71717A] font-semibold">
                <span className="text-[#B99A5B]">{product.category}</span>
                <span aria-hidden="true">·</span>
                <span>{product.availability === 'in_stock' ? 'In Stock' : 'Custom Tailored'}</span>
              </div>

              {/* Share link */}
              <button
                type="button"
                onClick={copyShareLink}
                className="inline-flex items-center gap-1 text-xs text-[#71717A] hover:text-[#171717] transition-colors"
                title="Copy shareable link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
              </button>
            </div>

            {/* Title */}
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#171717] leading-tight mb-4">
              {product.name}
            </h1>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-[#626262] leading-relaxed mb-6">
              {product.shortDescription}
            </p>

            <div className="h-px bg-[#E9E6E0] my-6" />

            {/* Interactive Variant Selectors */}
            {product.variants && product.variants.length > 0 && (
              <div className="flex flex-col gap-5 mb-6">
                {product.variants.map((variant) => (
                  <div key={variant.name}>
                    <div className="flex items-center justify-between text-xs font-semibold mb-2">
                      <span className="text-[#171717]">{variant.name}:</span>
                      <span className="text-[#B99A5B] font-medium">{selectedOptions[variant.name] || 'Select'}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {variant.values.map((val) => {
                        const isSelected = selectedOptions[variant.name] === val;
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setSelectedOptions({ ...selectedOptions, [variant.name]: val })}
                            className={`px-3.5 py-1.5 text-xs font-medium rounded-xs border transition-all ${
                              isSelected
                                ? 'bg-[#171717] text-white border-[#171717] shadow-2xs'
                                : 'bg-[#FAF8F5] text-[#171717] border-[#E9E6E0] hover:border-[#B99A5B]'
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center justify-between gap-4 mb-6 pt-2 border-t border-[#E9E6E0]/60">
              <span className="text-xs font-semibold text-[#171717]">Quantity:</span>
              <div className="flex items-center border border-[#E9E6E0] rounded-xs bg-[#FAF8F5]">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-sm font-semibold text-[#171717] hover:bg-[#E9E6E0]/60 transition-colors"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="px-3 py-1 text-xs font-semibold text-[#171717] tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-sm font-semibold text-[#171717] hover:bg-[#E9E6E0]/60 transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Primary Action Button: Order on WhatsApp */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleWhatsappOrderClick}
                className="w-full py-3.5 px-6 text-xs font-semibold uppercase tracking-wider text-white bg-[#25D366] hover:bg-[#20b858] transition-colors rounded-sm shadow-sm flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderModalOpen(true)}
                className="w-full py-3 px-6 text-xs font-semibold uppercase tracking-wider text-[#171717] bg-[#FAF8F5] border border-[#E9E6E0] hover:border-[#B99A5B] hover:text-[#B99A5B] transition-colors rounded-sm flex items-center justify-center gap-1.5"
              >
                <span>Request Availability &amp; Callback</span>
              </button>
            </div>

            <p className="text-[11px] text-[#71717A] text-center mt-3">
              No immediate online payment needed. We confirm exact stock, dimensions, and dispatch details via WhatsApp before payment is collected.
            </p>

            <div className="h-px bg-[#E9E6E0] my-6" />

            {/* Styling Consultation Link */}
            <div className="p-3 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#171717]">Unsure about sizing?</p>
                <p className="text-[11px] text-[#626262]">Book a complimentary styling consultation.</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/book')}
                className="text-xs font-semibold text-[#B99A5B] hover:underline"
              >
                Book Now
              </button>
            </div>

          </div>

        </div>

        {/* Detailed Description & Specifications Section */}
        <div className="bg-white border border-[#E9E6E0] p-8 sm:p-10 rounded-sm mb-20 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Story & Description */}
            <div className="md:col-span-7">
              <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-2">
                Design &amp; Craftsmanship
              </span>
              <h2 className="font-serif text-2xl font-semibold text-[#171717] mb-4">
                About this Piece
              </h2>
              <p className="text-xs sm:text-sm text-[#626262] leading-relaxed mb-6 whitespace-pre-line">
                {product.description}
              </p>

              {product.careInstructions && (
                <div className="mt-6 p-4 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#171717] mb-1">
                    Care Guidelines
                  </h3>
                  <p className="text-xs text-[#626262] leading-relaxed">
                    {product.careInstructions}
                  </p>
                </div>
              )}
            </div>

            {/* Technical Specifications Table */}
            <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-[#E9E6E0] pt-6 md:pt-0 md:pl-8">
              <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-2">
                Item Details
              </span>
              <h3 className="font-serif text-xl font-semibold text-[#171717] mb-4">
                Specifications
              </h3>

              <div className="divide-y divide-[#E9E6E0] text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#71717A]">Department</span>
                  <span className="text-[#171717] font-medium capitalize">{product.category}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#71717A]">Availability</span>
                  <span className="text-[#171717] font-medium">{product.availability === 'in_stock' ? 'In Stock' : 'Made to Order'}</span>
                </div>
                {product.specifications &&
                  Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="py-2.5 flex justify-between gap-4">
                      <span className="text-[#71717A] shrink-0">{key}</span>
                      <span className="text-[#171717] font-medium text-right">{val}</span>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        </div>

        {/* Category Recommendations */}
        {relatedProducts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-1">
                  Complete the Look
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#171717]">
                  More from {product.category}
                </h2>
              </div>
              <button
                onClick={() => navigate(`/shop/${product.category}`)}
                className="text-xs font-semibold uppercase tracking-wider text-[#171717] hover:text-[#B99A5B] transition-colors"
              >
                View Department
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} navigate={navigate} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Availability Callback Modal */}
      {orderModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Request Availability Callback"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="bg-white max-w-md w-full p-6 sm:p-8 rounded-sm shadow-xl border border-[#E9E6E0] relative animate-fadeIn">
            <button
              onClick={() => {
                setOrderModalOpen(false);
                setOrderSuccess(false);
              }}
              className="absolute top-4 right-4 text-[#71717A] hover:text-[#171717] text-lg font-bold"
              aria-label="Close modal"
            >
              ×
            </button>

            {orderSuccess ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-[#171717] mb-2">
                  Order Dispatched to Email & WhatsApp!
                </h3>
                <p className="text-xs text-[#626262] leading-relaxed mb-6">
                  Your request for <strong className="text-[#171717]">{product.name}</strong> has been sent directly to <strong>ismailrofiatbolanle@gmail.com</strong> and pre-loaded in WhatsApp.
                </p>
                <button
                  onClick={() => {
                    setOrderModalOpen(false);
                    setOrderSuccess(false);
                  }}
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#171717] text-white hover:bg-[#B99A5B] rounded-sm transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-1">
                  Availability Check
                </span>
                <h3 className="font-serif text-2xl font-semibold text-[#171717] mb-2">
                  Request Information
                </h3>
                <p className="text-xs text-[#626262] mb-6">
                  Provide your details and we will confirm stock, measurement options, and payment arrangements.
                </p>

                <form onSubmit={handleModalOrderSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Adebisi Adeleke"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      WhatsApp Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 0801 234 5678"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Delivery Location or Special Request
                    </label>
                    <textarea
                      rows={2}
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      placeholder="e.g. Preferred delivery date or location inquiry"
                      className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-xs"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 text-xs font-semibold uppercase tracking-wider bg-[#171717] text-white hover:bg-[#B99A5B] rounded-sm transition-colors shadow-sm"
                    >
                      Submit &amp; Open WhatsApp
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
