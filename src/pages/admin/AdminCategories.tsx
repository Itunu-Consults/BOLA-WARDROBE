import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';
import { Layers, Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { categories, products, adminToken, refreshCategories } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setTagline('');
    setDescription('');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setSlug(c.slug);
    setTagline(c.tagline || '');
    setDescription(c.description || '');
    setFormError('');
    setModalOpen(true);
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
    };

    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await refreshCategories();
        setModalOpen(false);
      } else {
        const err = await res.json();
        setFormError(err.error || 'Failed to save category.');
      }
    } catch {
      setFormError('Network connection error.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        await refreshCategories();
        setDeleteConfirmId(null);
      } else {
        const data = await res.json();
        alert(data.error || 'Cannot delete category.');
      }
    } catch {
      alert('Error deleting category.');
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
            Categories ({categories.length})
          </h1>
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
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#B99A5B] font-semibold">
                    Slug: /shop/{cat.slug}
                  </span>
                  <span className="text-xs text-[#71717A] bg-[#FAF8F5] px-2 py-0.5 border border-[#E9E6E0] rounded-xs font-medium">
                    {productCount} {productCount === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-semibold text-[#171717] mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs font-medium text-[#71717A] mb-2">{cat.tagline}</p>
                <p className="text-xs text-[#626262] leading-relaxed mb-4">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E9E6E0] flex items-center justify-between">
                <span className="text-[11px] text-[#71717A]">
                  Order priority: #{cat.displayOrder}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 text-[#171717] hover:text-[#B99A5B] transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 className="w-4 h-4" />
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

      {/* Category Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={editingCategory ? 'Edit Category' : 'Add Category'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="bg-white max-w-md w-full p-6 sm:p-8 rounded-sm shadow-2xl border border-[#E9E6E0] relative animate-fadeIn">
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
