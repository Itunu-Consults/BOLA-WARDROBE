import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface ShopPageProps {
  navigate: (path: string) => void;
  initialCategory?: string;
  initialSearch?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  navigate,
  initialCategory = 'all',
  initialSearch = '',
}) => {
  const { products, categories } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'name'>('featured');

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    if (initialSearch) setSearchQuery(initialSearch);
  }, [initialSearch]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (!product.isPublished) return false;
        if (selectedCategory !== 'all' && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = product.name.toLowerCase().includes(q);
          const matchesCategory = product.category.toLowerCase().includes(q);
          const matchesDesc = product.shortDescription.toLowerCase().includes(q) || product.description.toLowerCase().includes(q);
          return matchesName || matchesCategory || matchesDesc;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        // Default: featured first, then newest
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[#71717A]">
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
          <span className="text-[#171717] font-medium">Collections</span>
          {selectedCategory !== 'all' && (
            <>
              <span aria-hidden="true">/</span>
              <span className="text-[#B99A5B] font-medium capitalize">{selectedCategory}</span>
            </>
          )}
        </nav>

        {/* Page Title & Editorial Header */}
        <div className="mb-10 max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-2">
            The Catalog
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#171717] tracking-tight mb-4">
            {selectedCategory === 'all'
              ? 'All Collections'
              : categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
          </h1>
          <p className="text-sm sm:text-base text-[#626262] leading-relaxed">
            {selectedCategory === 'all'
              ? 'Thoughtfully curated feminine accessories, ready-to-wear clothing, structured bags, and clean cosmetics designed for everyday elegance.'
              : categories.find((c) => c.slug === selectedCategory)?.description ||
                'Explore our carefully curated selection.'}
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-[#E9E6E0] p-4 rounded-sm shadow-2xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Category Tabs (Interactive Segmented Buttons) */}
          <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Filter by Category">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-[#171717] text-white shadow-2xs'
                  : 'text-[#626262] hover:text-[#171717] hover:bg-[#F8F6F2]'
              }`}
            >
              All Pieces ({products.filter((p) => p.isPublished).length})
            </button>
            {categories.map((cat) => {
              const count = products.filter((p) => p.isPublished && p.category.toLowerCase() === cat.slug.toLowerCase()).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors whitespace-nowrap ${
                    selectedCategory.toLowerCase() === cat.slug.toLowerCase()
                      ? 'bg-[#171717] text-white shadow-2xs'
                      : 'text-[#626262] hover:text-[#171717] hover:bg-[#F8F6F2]'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-60">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-[#71717A]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collection..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-xs text-[#171717]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-xs text-[#71717A] hover:text-[#171717]"
                  aria-label="Clear search query"
                >
                  ×
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#71717A]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-1.5 pl-2 pr-6 text-xs bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-xs text-[#171717] cursor-pointer"
                aria-label="Sort products"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest Arrivals</option>
                <option value="name">Alphabetical (A–Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter and Active Filter Tags */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#71717A]">
          <span>Showing {filteredProducts.length} curated {filteredProducts.length === 1 ? 'item' : 'items'}</span>
          {(selectedCategory !== 'all' || searchQuery) && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-[#B99A5B] hover:underline font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                navigate={navigate}
              />
            ))}
          </div>
        ) : (
          /* Empty Search/Filter State */
          <div className="bg-white border border-[#E9E6E0] p-12 text-center rounded-sm max-w-lg mx-auto my-12">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E9E6E0] flex items-center justify-center mx-auto mb-4 text-[#71717A]">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-[#171717] mb-2">
              No matching pieces found
            </h3>
            <p className="text-xs text-[#626262] leading-relaxed mb-6">
              We couldn’t find anything matching your current filters. Try searching for different keywords or view our complete catalog.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#171717] text-white hover:bg-[#B99A5B] transition-colors rounded-sm shadow-2xs"
            >
              View All Products
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
