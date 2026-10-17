import React from 'react';
import { Product } from '../types';
import { ProductVisual } from './ProductVisual';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { createProductOrderWhatsappUrl } from '../utils/whatsapp';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  navigate: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, navigate }) => {
  const { settings, submitOrderRequest } = useStore();

  const handleWhatsappOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Register the intent in background without blocking
    submitOrderRequest({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      quantity: 1,
    });

    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://bolawardrobe.com';
    const productUrl = `${currentOrigin}/product/${product.slug}`;

    const orderUrl = createProductOrderWhatsappUrl({
      whatsappNumber: settings.whatsappNumber,
      product,
      quantity: 1,
      productUrl,
    });

    window.open(orderUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <article
      onClick={() => navigate(`/product/${product.slug}`)}
      className="group flex flex-col bg-white border border-[#E9E6E0] rounded-sm overflow-hidden hover:border-[#B99A5B]/60 transition-all duration-300 cursor-pointer h-full"
      data-testid={`card-${product.slug}`}
    >
      {/* Product Visual Container with Hover Zoom */}
      <div className="relative overflow-hidden bg-[#FAF9F6] aspect-[4/3] border-b border-[#E9E6E0]/60">
        <ProductVisual
          slug={product.slug}
          category={product.category}
          name={product.name}
          imageUrl={product.images[0]}
          aspectRatio="4/3"
        />

        {/* Editorial Tag (Quiet luxury typography, no pill badges) */}
        {product.label && (
          <div className="absolute top-3 left-3 z-10">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#171717] bg-white/95 backdrop-blur-sm px-2.5 py-1 border border-[#E9E6E0] shadow-2xs">
              {product.label}
            </span>
          </div>
        )}

        {/* Availability Marker if low stock or preorder */}
        {product.availability === 'preorder' && (
          <div className="absolute top-3 right-3 z-10">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#B99A5B] bg-white/95 backdrop-blur-sm px-2 py-0.5 border border-[#B99A5B]/30">
              Pre-Order
            </span>
          </div>
        )}
      </div>

      {/* Card Content & Action Area */}
      <div className="flex flex-col flex-1 p-5 justify-between">
        <div>
          {/* Unboxed Metadata: Category and Stock */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#71717A] mb-1.5 font-medium">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{product.availability === 'in_stock' ? 'Available' : 'Made to Order'}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-lg font-semibold text-[#171717] group-hover:text-[#B99A5B] transition-colors leading-snug line-clamp-1 mb-2">
            {product.name}
          </h3>

          {/* Short Editorial Description */}
          <p className="text-xs text-[#626262] leading-relaxed line-clamp-2 mb-4">
            {product.shortDescription}
          </p>
        </div>

        {/* Action Buttons: View Details & Direct WhatsApp Order */}
        <div className="pt-3 border-t border-[#E9E6E0]/70 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.slug}`);
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#171717] hover:text-[#B99A5B] transition-colors py-1.5"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B99A5B]" />
          </button>

          <button
            type="button"
            onClick={handleWhatsappOrder}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wide text-white bg-[#171717] hover:bg-[#25D366] transition-colors rounded-sm shadow-2xs whitespace-nowrap"
            title="Order directly on WhatsApp"
            aria-label={`Order ${product.name} on WhatsApp`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Order on WhatsApp</span>
          </button>
        </div>
      </div>
    </article>
  );
};
