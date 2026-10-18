import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductVariantOption } from '../../types';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  Upload,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { ProductVisual } from '../../components/ProductVisual';
import { compressImage } from '../../utils/imageCompressor';

interface AdminProductsProps {
  navigate: (path: string) => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({ navigate }) => {
  const { products, categories, adminToken, refreshProducts, saveProduct, deleteProduct } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('wears');
  const [shortDesc, setShortDesc] = useState('');
  const [desc, setDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [availability, setAvailability] = useState<'in_stock' | 'low_stock' | 'preorder' | 'out_of_stock'>('in_stock');
  const [label, setLabel] = useState<string>('');
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [careInstructions, setCareInstructions] = useState('');
  const [sizesInput, setSizesInput] = useState('UK 8, UK 10, UK 12, UK 14, UK 16');
  const [colorsInput, setColorsInput] = useState('');
  const [specsInput, setSpecsInput] = useState('Material: 100% Cotton\nFit: Standard Fit');

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setCategory('wears');
    setShortDesc('');
    setDesc('');
    setImageUrl('');
    setAvailability('in_stock');
    setLabel('New Arrival');
    setIsPublished(true);
    setIsFeatured(false);
    setCareInstructions('Hand wash cold or dry clean. Hang dry away from direct sunlight.');
    setSizesInput('UK 8, UK 10, UK 12, UK 14, UK 16');
    setColorsInput('');
    setSpecsInput('Material: Premium Cotton\nFit: Relaxed');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setShortDesc(p.shortDescription || '');
    setDesc(p.description || '');
    setImageUrl(p.images[0] || '');
    setAvailability(p.availability);
    setLabel(p.label || '');
    setIsPublished(p.isPublished);
    setIsFeatured(p.isFeatured);
    setCareInstructions(p.careInstructions || '');

    // Extract variants into comma-separated text for simple editing
    const sizeVar = p.variants.find((v) => v.name.toLowerCase() === 'size');
    setSizesInput(sizeVar ? sizeVar.values.join(', ') : '');

    const colorVar = p.variants.find((v) => v.name.toLowerCase().includes('color'));
    setColorsInput(colorVar ? colorVar.values.join(', ') : '');

    // Specs
    const specStr = p.specifications
      ? Object.entries(p.specifications)
          .map(([k, v]) => `${k}: ${v}`)
          .join('\n')
      : '';
    setSpecsInput(specStr);

    setFormError('');
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 1. Immediately compress image on the client down to a high-quality lightweight web JPEG (<250KB)
      const optimizedDataUrl = await compressImage(file, 1200, 1200, 0.82);
      // Immediately set the image preview so user sees it right away!
      setImageUrl(optimizedDataUrl);

      // 2. Also attempt upload to server if backend is reachable
      try {
        const res = await fetch('/api/media/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ dataUrl: optimizedDataUrl, filename: file.name }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.url) setImageUrl(data.url);
        }
      } catch {
        // Local preview remains active!
      }
    } catch (err: any) {
      alert('Unable to process photo: ' + (err?.message || 'Please choose a standard image file'));
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!name.trim()) {
      setFormError('Product title is required.');
      return;
    }

    setIsSubmitting(true);

    // Build variants array
    const variants: ProductVariantOption[] = [];
    if (sizesInput.trim()) {
      variants.push({
        name: 'Size',
        values: sizesInput.split(',').map((s) => s.trim()).filter(Boolean),
      });
    }
    if (colorsInput.trim()) {
      variants.push({
        name: 'Color',
        values: colorsInput.split(',').map((c) => c.trim()).filter(Boolean),
      });
    }

    // Build specs object
    const specifications: Record<string, string> = {};
    specsInput.split('\n').forEach((line) => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const k = parts[0].trim();
        const v = parts.slice(1).join(':').trim();
        if (k && v) specifications[k] = v;
      }
    });

    const payload: Partial<Product> = {
      ...(editingProduct ? { id: editingProduct.id } : {}),
      name: name.trim(),
      category,
      shortDescription: shortDesc.trim(),
      description: desc.trim(),
      images: imageUrl.trim() ? [imageUrl.trim()] : ['/images/products/placeholder.svg'],
      variants,
      availability,
      label: (label.trim() as any) || null,
      specifications,
      careInstructions: careInstructions.trim(),
      isPublished,
      isFeatured,
    };

    try {
      const result = await saveProduct(payload, Boolean(editingProduct));
      if (result.success) {
        setModalOpen(false);
      } else {
        setFormError(result.error || 'Failed to save product.');
      }
    } catch {
      setFormError('Error saving product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      setDeleteConfirmId(null);
    } catch {
      alert('Failed to delete product.');
    }
  };

  const togglePublish = async (p: Product) => {
    await saveProduct({ id: p.id, isPublished: !p.isPublished }, true);
  };

  const toggleFeatured = async (p: Product) => {
    await saveProduct({ id: p.id, isFeatured: !p.isFeatured }, true);
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-1">
            Catalog Management
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#171717]">
            Products ({products.length})
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#171717] text-white hover:bg-[#B99A5B] transition-colors rounded-xs shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Piece</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-[#E9E6E0] rounded-sm shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#71717A]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#71717A] shrink-0">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:outline-none cursor-pointer"
          >
            <option value="all">All Departments</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#E9E6E0] rounded-sm overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#71717A] uppercase tracking-wider border-b border-[#E9E6E0] font-semibold">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E6E0]">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF9F6] transition-colors">
                  {/* Item Image and Title */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xs overflow-hidden bg-[#FAF8F5] border border-[#E9E6E0] shrink-0">
                        <ProductVisual
                          slug={p.slug}
                          category={p.category}
                          name={p.name}
                          imageUrl={p.images[0]}
                          aspectRatio="1/1"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#171717] truncate max-w-[200px]">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-[#71717A] truncate max-w-[200px]">
                          /product/{p.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 capitalize text-[#626262]">
                    {p.category}
                  </td>

                  {/* Availability */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase rounded-xs ${
                        p.availability === 'in_stock'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {p.availability === 'in_stock' ? 'In Stock' : p.availability}
                    </span>
                  </td>

                  {/* Published Toggle */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => togglePublish(p)}
                      className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-xs border transition-colors ${
                        p.isPublished
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                      }`}
                    >
                      {p.isPublished ? 'Published' : 'Draft'}
                    </button>
                  </td>

                  {/* Featured Toggle */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleFeatured(p)}
                      className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-xs border transition-colors ${
                        p.isFeatured
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-zinc-50 text-zinc-500 border-zinc-200'
                      }`}
                    >
                      {p.isFeatured ? '★ Featured' : 'Standard'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => navigate(`/product/${p.slug}`)}
                        className="p-1.5 hover:text-[#B99A5B] transition-colors"
                        title="View Live Product Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 hover:text-[#B99A5B] transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {deleteConfirmId === p.id ? (
                        <div className="inline-flex items-center gap-1 bg-red-50 p-1 rounded-xs border border-red-200">
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="px-1.5 py-0.5 text-[10px] bg-red-600 text-white font-semibold rounded-xs"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-1 text-[10px] text-zinc-600 font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 hover:text-red-600 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Add / Edit Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={editingProduct ? 'Edit Product' : 'Add New Product'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
        >
          <div className="bg-white max-w-2xl w-full p-6 sm:p-8 rounded-sm shadow-2xl border border-[#E9E6E0] relative my-8 animate-fadeIn max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[#71717A] hover:text-[#171717] text-lg font-bold"
              aria-label="Close modal"
            >
              ×
            </button>

            <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-1">
              Catalog Editor
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#171717] mb-4">
              {editingProduct ? `Edit “${editingProduct.name}”` : 'Add New Boutique Piece'}
            </h2>

            {formError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xs mb-4 font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="flex flex-col gap-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#171717] mb-1">
                    Piece Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Adire Swirl Two-Piece Set"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#171717] mb-1">
                    Department *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  Short Tagline / Summary (Shown on Cards)
                </label>
                <input
                  type="text"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="e.g. Artisanal hand-dyed blouse with coordinating wide-leg trousers."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  Detailed Editorial Description
                </label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Describe the fabric drape, silhouette, tailoring details, and styling recommendations..."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
                />
              </div>

              {/* Image Input & Upload */}
              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  Primary Product Image (URL or Upload File)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Enter image URL or choose file..."
                    className="flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
                  />
                  <label className="px-3 py-2 bg-white border border-[#E9E6E0] hover:border-[#B99A5B] rounded-xs cursor-pointer flex items-center gap-1.5 font-semibold text-[#171717]">
                    <Upload className="w-3.5 h-3.5 text-[#B99A5B]" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Variants: Sizes & Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#171717] mb-1">
                    Available Sizes (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={sizesInput}
                    onChange={(e) => setSizesInput(e.target.value)}
                    placeholder="UK 8, UK 10, UK 12, UK 14, UK 16"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#171717] mb-1">
                    Available Colors / Shades (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={colorsInput}
                    onChange={(e) => setColorsInput(e.target.value)}
                    placeholder="Emerald Green, Onyx Black, Cognac Brown"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
                  />
                </div>
              </div>

              {/* Badges & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#171717] mb-1">
                    Editorial Tag Label
                  </label>
                  <select
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none cursor-pointer"
                  >
                    <option value="">None</option>
                    <option value="New Arrival">New Arrival</option>
                    <option value="Staff Pick">Staff Pick</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="The Edit">The Edit</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#171717] mb-1">
                    Availability
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none cursor-pointer"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="preorder">Pre-Order</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Specifications */}
              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  Specifications (One per line: Key: Value)
                </label>
                <textarea
                  rows={2}
                  value={specsInput}
                  onChange={(e) => setSpecsInput(e.target.value)}
                  placeholder="Material: 100% Cotton Poplin&#10;Closure: Elastic with side ties"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
                />
              </div>

              {/* Care Instructions */}
              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  Care Guidelines
                </label>
                <input
                  type="text"
                  value={careInstructions}
                  onChange={(e) => setCareInstructions(e.target.value)}
                  placeholder="e.g. Hand wash cold with mild soap. Line dry away from direct sun."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
                />
              </div>

              {/* Checkboxes: Published and Featured */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="accent-[#B99A5B]"
                  />
                  <span className="font-semibold text-[#171717]">Publish on Public Storefront</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-[#B99A5B]"
                  />
                  <span className="font-semibold text-[#171717]">Feature on Homepage Showcase</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E9E6E0]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 font-semibold text-[#626262] hover:text-[#171717]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 font-semibold uppercase tracking-wider bg-[#171717] text-white hover:bg-[#B99A5B] rounded-xs transition-colors shadow-2xs"
                >
                  {isSubmitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
