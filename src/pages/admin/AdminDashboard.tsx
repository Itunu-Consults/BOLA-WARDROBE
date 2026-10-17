import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Package,
  FileEdit,
  Layers,
  ShoppingBag,
  Calendar,
  Mail,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Booking, OrderRequest } from '../../types';

interface AdminDashboardProps {
  setCurrentTab: (tab: string) => void;
  navigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setCurrentTab, navigate }) => {
  const { products, categories, adminToken } = useStore();
  const [orders, setOrders] = useState<OrderRequest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!adminToken) return;
    fetch('/api/orders', {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setOrders(data))
      .catch(() => {});

    fetch('/api/bookings', {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setBookings(data))
      .catch(() => {});
  }, [adminToken]);

  const publishedCount = products.filter((p) => p.isPublished).length;
  const draftCount = products.filter((p) => !p.isPublished).length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'new').length;
  const pendingBookingsCount = bookings.filter((b) => b.status === 'pending').length;

  return (
    <div className="space-y-8">
      
      {/* Title & Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-1">
            Overview
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#171717]">
            Store Management Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('products')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#171717] text-white hover:bg-[#B99A5B] transition-colors rounded-xs shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="bg-white p-5 border border-[#E9E6E0] rounded-sm shadow-2xs">
          <div className="flex items-center justify-between text-[#71717A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Live Items</span>
            <Package className="w-4 h-4 text-[#B99A5B]" />
          </div>
          <p className="font-serif text-3xl font-bold text-[#171717] tabular-nums">
            {publishedCount}
          </p>
          <span className="text-[11px] text-[#71717A] mt-1 block">In storefront</span>
        </div>

        <div className="bg-white p-5 border border-[#E9E6E0] rounded-sm shadow-2xs">
          <div className="flex items-center justify-between text-[#71717A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Drafts</span>
            <FileEdit className="w-4 h-4 text-[#71717A]" />
          </div>
          <p className="font-serif text-3xl font-bold text-[#171717] tabular-nums">
            {draftCount}
          </p>
          <span className="text-[11px] text-[#71717A] mt-1 block">Unpublished</span>
        </div>

        <div className="bg-white p-5 border border-[#E9E6E0] rounded-sm shadow-2xs">
          <div className="flex items-center justify-between text-[#71717A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Categories</span>
            <Layers className="w-4 h-4 text-[#B99A5B]" />
          </div>
          <p className="font-serif text-3xl font-bold text-[#171717] tabular-nums">
            {categories.length}
          </p>
          <span className="text-[11px] text-[#71717A] mt-1 block">Active departments</span>
        </div>

        <div className="bg-white p-5 border border-[#E9E6E0] rounded-sm shadow-2xs">
          <div className="flex items-center justify-between text-[#71717A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Order Inquiries</span>
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif text-3xl font-bold text-[#171717] tabular-nums">
            {orders.length}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
            {pendingOrdersCount} new
          </span>
        </div>

        <div className="bg-white p-5 border border-[#E9E6E0] rounded-sm shadow-2xs">
          <div className="flex items-center justify-between text-[#71717A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Consultations</span>
            <Calendar className="w-4 h-4 text-[#B99A5B]" />
          </div>
          <p className="font-serif text-3xl font-bold text-[#171717] tabular-nums">
            {bookings.length}
          </p>
          <span className="text-[11px] text-[#B99A5B] font-medium mt-1 block">
            {pendingBookingsCount} pending
          </span>
        </div>

        <div className="bg-white p-5 border border-[#E9E6E0] rounded-sm shadow-2xs">
          <div className="flex items-center justify-between text-[#71717A] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Store Health</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif text-2xl font-bold text-emerald-700">
            Active
          </p>
          <span className="text-[11px] text-[#71717A] mt-1 block">WhatsApp connected</span>
        </div>

      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-white border border-[#E9E6E0] p-6 rounded-sm shadow-2xs">
        <h3 className="font-serif text-lg font-semibold text-[#171717] mb-4">
          Quick Management Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setCurrentTab('products')}
            className="p-4 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs text-left hover:border-[#B99A5B] transition-colors"
          >
            <Package className="w-5 h-5 text-[#B99A5B] mb-2" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#171717] mb-1">
              Manage Products
            </h4>
            <p className="text-[11px] text-[#626262]">Edit descriptions, photos &amp; sizes</p>
          </button>

          <button
            onClick={() => setCurrentTab('orders')}
            className="p-4 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs text-left hover:border-[#B99A5B] transition-colors"
          >
            <ShoppingBag className="w-5 h-5 text-[#B99A5B] mb-2" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#171717] mb-1">
              Review Orders
            </h4>
            <p className="text-[11px] text-[#626262]">Check incoming customer requests</p>
          </button>

          <button
            onClick={() => setCurrentTab('bookings')}
            className="p-4 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs text-left hover:border-[#B99A5B] transition-colors"
          >
            <Calendar className="w-5 h-5 text-[#B99A5B] mb-2" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#171717] mb-1">
              Consultations
            </h4>
            <p className="text-[11px] text-[#626262]">View booked styling appointments</p>
          </button>

          <button
            onClick={() => setCurrentTab('settings')}
            className="p-4 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs text-left hover:border-[#B99A5B] transition-colors"
          >
            <Mail className="w-5 h-5 text-[#B99A5B] mb-2" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#171717] mb-1">
              WhatsApp &amp; Settings
            </h4>
            <p className="text-[11px] text-[#626262]">Update phone numbers and social links</p>
          </button>
        </div>
      </div>

      {/* Two-Column Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Order Requests */}
        <div className="bg-white border border-[#E9E6E0] rounded-sm p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-semibold text-[#171717]">
              Recent Order Inquiries
            </h3>
            <button
              onClick={() => setCurrentTab('orders')}
              className="text-xs font-semibold text-[#B99A5B] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {orders.length > 0 ? (
            <div className="divide-y divide-[#E9E6E0] text-xs">
              {orders.slice(0, 5).map((ord) => (
                <div key={ord.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[#171717]">{ord.productName}</p>
                    <p className="text-[#71717A]">
                      {ord.customerName ? `${ord.customerName} · ` : ''}
                      {ord.selectedOptions && Object.values(ord.selectedOptions).join(', ')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] uppercase font-semibold rounded-xs ${
                        ord.status === 'new'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : ord.status === 'fulfilled'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {ord.status}
                    </span>
                    <span className="text-[10px] text-[#71717A] block mt-0.5">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#71717A] py-6 text-center">No order inquiries registered yet.</p>
          )}
        </div>

        {/* Recent Consultation Bookings */}
        <div className="bg-white border border-[#E9E6E0] rounded-sm p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-semibold text-[#171717]">
              Recent Styling Bookings
            </h3>
            <button
              onClick={() => setCurrentTab('bookings')}
              className="text-xs font-semibold text-[#B99A5B] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {bookings.length > 0 ? (
            <div className="divide-y divide-[#E9E6E0] text-xs">
              {bookings.slice(0, 5).map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[#171717]">{b.fullName}</p>
                    <p className="text-[#71717A]">
                      {b.consultationType} · {b.preferredDate} ({b.preferredTime})
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] uppercase font-semibold rounded-xs ${
                        b.status === 'pending'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : b.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {b.status}
                    </span>
                    <span className="text-[10px] text-[#71717A] block mt-0.5">
                      {b.whatsapp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#71717A] py-6 text-center">No consultation bookings registered yet.</p>
          )}
        </div>

      </div>

    </div>
  );
};
