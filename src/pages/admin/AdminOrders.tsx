import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderRequest } from '../../types';
import { Search, ShoppingBag, CheckCircle, MessageSquare, Clock, Filter } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { adminToken } = useStore();
  const [orders, setOrders] = useState<OrderRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderRequest | null>(null);
  const [notesInput, setNotesInput] = useState('');

  const loadOrders = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadOrders();
  }, [adminToken]);

  const updateOrderStatus = async (id: string, status: string, internalNotes?: string) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status, internalNotes }),
      });
      if (res.ok) {
        await loadOrders();
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({ ...selectedOrder, status: status as any, internalNotes });
        }
      }
    } catch {
      alert('Failed to update order status');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== 'all' && o.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.productName.toLowerCase().includes(q) ||
        (o.customerName && o.customerName.toLowerCase().includes(q)) ||
        (o.customerPhone && o.customerPhone.includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-1">
          Requests &amp; Leads
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#171717]">
          Order Inquiries ({orders.length})
        </h1>
        <p className="text-xs text-[#626262] mt-1">
          Review customer order requests initiated through product pages and WhatsApp handoffs.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-[#E9E6E0] rounded-sm shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#71717A]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product or customer name..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#71717A]" />
          <span className="text-xs text-[#71717A]">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:outline-none cursor-pointer"
          >
            <option value="all">All Inquiries</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E9E6E0] rounded-sm overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#71717A] uppercase tracking-wider border-b border-[#E9E6E0] font-semibold">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Piece</th>
                <th className="py-3 px-4">Selected Variants</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E6E0]">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="py-3 px-4 text-[#71717A] whitespace-nowrap">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#171717]">
                    {ord.productName}
                    {ord.quantity > 1 && (
                      <span className="text-[10px] text-[#B99A5B] ml-1">
                        (Qty: {ord.quantity})
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[#626262]">
                    {ord.selectedOptions && Object.keys(ord.selectedOptions).length > 0 ? (
                      Object.entries(ord.selectedOptions)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(' · ')
                    ) : (
                      <span className="text-[#71717A]">Default</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[#171717]">
                    <p className="font-medium">{ord.customerName || 'WhatsApp Clicker'}</p>
                    {ord.customerPhone && (
                      <p className="text-[11px] text-[#71717A]">{ord.customerPhone}</p>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] uppercase font-semibold rounded-xs ${
                        ord.status === 'new'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : ord.status === 'contacted'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : ord.status === 'fulfilled'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedOrder(ord);
                        setNotesInput(ord.internalNotes || '');
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-[#171717] hover:text-[#B99A5B] bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs"
                    >
                      Details &amp; Notes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details & Notes Modal */}
      {selectedOrder && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Order Inquiry Details"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-sm shadow-2xl border border-[#E9E6E0] relative animate-fadeIn">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-[#71717A] hover:text-[#171717] text-lg font-bold"
              aria-label="Close modal"
            >
              ×
            </button>

            <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-1">
              Inquiry Record
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#171717] mb-4">
              {selectedOrder.productName}
            </h2>

            <div className="space-y-3 text-xs text-[#626262] bg-[#FAF8F5] p-4 rounded-xs border border-[#E9E6E0] mb-5">
              <p>• <strong>Quantity:</strong> {selectedOrder.quantity}</p>
              <p>
                • <strong>Options:</strong>{' '}
                {selectedOrder.selectedOptions &&
                  Object.entries(selectedOrder.selectedOptions)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(', ')}
              </p>
              <p>• <strong>Customer:</strong> {selectedOrder.customerName || 'Anonymous WhatsApp Customer'}</p>
              {selectedOrder.customerPhone && (
                <p>• <strong>Phone:</strong> {selectedOrder.customerPhone}</p>
              )}
              {selectedOrder.customerEmail && (
                <p>• <strong>Email:</strong> {selectedOrder.customerEmail}</p>
              )}
              {selectedOrder.customerNotes && (
                <p>• <strong>Customer Note:</strong> {selectedOrder.customerNotes}</p>
              )}
            </div>

            {/* Status Selector */}
            <div className="mb-4 text-xs">
              <label className="block font-semibold text-[#171717] mb-1">
                Update Status
              </label>
              <div className="flex flex-wrap gap-2">
                {['new', 'contacted', 'fulfilled', 'closed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => updateOrderStatus(selectedOrder.id, st, notesInput)}
                    className={`px-3 py-1 text-xs font-semibold uppercase rounded-xs border ${
                      selectedOrder.status === st
                        ? 'bg-[#171717] text-white border-[#171717]'
                        : 'bg-[#FAF8F5] text-[#626262] border-[#E9E6E0] hover:text-[#171717]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Internal Staff Notes */}
            <div className="mb-5 text-xs">
              <label className="block font-semibold text-[#171717] mb-1">
                Internal Staff Notes
              </label>
              <textarea
                rows={3}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Add notes about payment status, fabric batch, or rider dispatch..."
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  updateOrderStatus(selectedOrder.id, selectedOrder.status, notesInput);
                  setSelectedOrder(null);
                }}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-[#171717] text-white hover:bg-[#B99A5B] rounded-xs transition-colors"
              >
                Save &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
