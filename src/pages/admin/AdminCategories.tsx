import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';
import { Layers, Plus, Edit2, Trash2, AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';

export const AdminCategories: React.FC = () => {
  const { categories, products, adminToken, saveCategory, deleteCategory } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [formError, setFormError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setTagline('');
    setDescription('');
    setImage('');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setSlug(c.slug);
    setTagline(c.tagline || '');
    setDescription(c.description || '');
    setImage(c.image || '');
    setFormError('');
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const optimizedDataUrl = await compressImage(file, 1200, 1200, 0.82);
      setImage(optimizedDataUrl);

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
          if (data?.url) setImage(data.url);
        }
      } catch {}
    } catch (err: any) {
      alert('Unable to process category photo: ' + (err?.message || 'Please select a valid image'));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Category name is required.');
      return;
    }

    const payload = {
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tagline: tagline.trim(),
      description: description.trim(),
      image: image.trim(),
    };

    try {
      const payloadWithId = editingCategory ? { id: editingCategory.id, ...payload } : payload;
      const res = await saveCategory(payloadWithId, Boolean(editingCategory));
      if (res.success) {
        setModalOpen(false);
      } else {
        setFormError(res.error || 'Failed to save category.');
      }
    } catch {
      setFormError('Error saving category.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      setDeleteConfirmId(null);
    } catch {
      alert('Cannot delete category.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-1">
            Department Architecture
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#171717]">
            Categories &amp; Homepage Banners ({categories.length})
          </h1>
          <p className="text-xs text-[#71717A] mt-1">
            Manage titles, taglines, and display cover images shown on the Homepage and Shop filters.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#171717] text-white hover:bg-[#B99A5B] transition-colors rounded-xs shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const productCount = products.filter(
            (p) => p.category.toLowerCase() === cat.slug.toLowerCase()
          ).length;

          return (
            <div
              key={cat.id}
              className="bg-white border border-[#E9E6E0] p-6 rounded-sm shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-widest text-[#B99A5B] font-semibold">
                    Slug: /shop/{cat.slug}
                  </span>
                  <span className="text-xs text-[#71717A] bg-[#FAF8F5] px-2 py-0.5 border border-[#E9E6E0] rounded-xs font-medium">
                    {productCount} {productCount === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <div className="flex gap-4 items-start mb-3">
                  {/* Category Display Thumbnail Preview */}
                  <div className="w-20 h-20 rounded-xs overflow-hidden bg-[#FAF8F5] border border-[#E9E6E0] shrink-0 relative group">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#71717A] bg-[#FAF8F5] p-2 text-center">
                        <ImageIcon className="w-5 h-5 mb-1 text-[#B99A5B]" />
                        <span className="text-[9px] font-medium">No Custom Photo</span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-xl font-semibold text-[#171717] mb-0.5">
                      {cat.name}
                    </h3>
                    <p className="text-xs font-medium text-[#B99A5B] mb-1.5">{cat.tagline || 'Everyday elegance'}</p>
                    <p className="text-xs text-[#626262] leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E9E6E0] flex items-center justify-between">
                <span className="text-[11px] text-[#71717A]">
                  Homepage Cover: {cat.image ? 'Custom Image Active' : 'System Default'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#FAF8F5] hover:bg-[#171717] hover:text-white border border-[#E9E6E0] rounded-xs transition-colors"
                    title="Change Display Image & Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Change Image &amp; Edit</span>
                  </button>

                  {deleteConfirmId === cat.id ? (
                    <div className="inline-flex items-center gap-1 bg-red-50 p-1 rounded-xs border border-red-200">
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="px-2 py-0.5 text-[10px] bg-red-600 text-white font-semibold rounded-xs"
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
                      onClick={() => setDeleteConfirmId(cat.id)}
                      className="p-1.5 text-[#71717A] hover:text-red-600 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Modal with Image Uploader */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={editingCategory ? 'Edit Category' : 'Add Category'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
        >
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-sm shadow-2xl border border-[#E9E6E0] relative animate-fadeIn max-h-[92vh] overflow-y-auto my-6">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[#71717A] hover:text-[#171717] text-lg font-bold"
              aria-label="Close modal"
            >
              ×
            </button>

            <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-1">
              Category Settings
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#171717] mb-4">
              {editingCategory ? `Edit “${editingCategory.name}”` : 'Create New Department'}
            </h2>

            {formError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xs mb-4 font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Traditional Fabrics"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  URL Slug (e.g. traditional-fabrics)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="leave empty to auto-generate"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
                />
              </div>

              {/* Homepage Category Display Image Section */}
              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  Homepage Display Cover Image (Upload Photo or Paste Link)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Paste image URL (https://...) or upload below..."
                    className="flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
                  />
                  <label className="px-4 py-2 bg-[#171717] hover:bg-[#B99A5B] text-white rounded-xs cursor-pointer flex items-center gap-1.5 font-semibold transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Live Preview Box */}
                {image && (
                  <div className="p-3 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs flex items-center gap-4 mb-2">
                    <div className="w-16 h-16 rounded-xs overflow-hidden bg-white border border-[#E9E6E0] shrink-0">
                      <img src={image} alt="Category preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="font-semibold text-emerald-800 text-[11px]">Display Image Loaded</span>
                      </div>
                      <p className="text-[10px] text-[#71717A] truncate font-mono mt-0.5">
                        {image.startsWith('data:') ? 'Custom Web Image (Direct Data)' : image}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="px-2.5 py-1 text-[11px] text-red-600 hover:bg-red-50 rounded-xs border border-red-200 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                )}

                {/* Curated Category Presets */}
                <div className="p-2.5 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs flex items-center justify-between flex-wrap gap-2 text-xs">
                  <span className="text-[11px] text-[#71717A]">Curated Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setImage('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80')}
                      className="text-[10px] px-2 py-1 bg-white border border-[#E9E6E0] hover:border-[#B99A5B] rounded-xs text-[#171717] font-medium"
                    >
                      Fashion Wears
                    </button>
                    <button
                      type="button"
                      onClick={() => setImage('https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80')}
                      className="text-[10px] px-2 py-1 bg-white border border-[#E9E6E0] hover:border-[#B99A5B] rounded-xs text-[#171717] font-medium"
                    >
                      Bags &amp; Leather
                    </button>
                    <button
                      type="button"
                      onClick={() => setImage('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80')}
                      className="text-[10px] px-2 py-1 bg-white border border-[#E9E6E0] hover:border-[#B99A5B] rounded-xs text-[#171717] font-medium"
                    >
                      Accessories
                    </button>
                    <button
                      type="button"
                      onClick={() => setImage('https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80')}
                      className="text-[10px] px-2 py-1 bg-white border border-[#E9E6E0] hover:border-[#B99A5B] rounded-xs text-[#171717] font-medium"
                    >
                      Cosmetics
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Artisanal Loom Woven Elegance"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171717] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short introductory description for this collection's landing page..."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E9E6E0]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 font-semibold text-[#626262] hover:text-[#171717]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold uppercase tracking-wider bg-[#171717] text-white hover:bg-[#B99A5B] rounded-xs transition-colors"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
