import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Booking } from '../../types';
import { Calendar, Search, Filter, MessageCircle, Clock } from 'lucide-react';
import { createGeneralInquiryWhatsappUrl } from '../../utils/whatsapp';

export const AdminBookings: React.FC = () => {
  const { adminToken, settings } = useStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [notesInput, setNotesInput] = useState('');

  const loadBookings = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/bookings', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadBookings();
  }, [adminToken]);

  const updateBookingStatus = async (id: string, status: string, internalNotes?: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status, internalNotes }),
      });
      if (res.ok) {
        await loadBookings();
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking({ ...selectedBooking, status: status as any, internalNotes });
        }
      }
    } catch {
      alert('Failed to update booking');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus !== 'all' && b.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        b.fullName.toLowerCase().includes(q) ||
        b.whatsapp.includes(q) ||
        b.consultationType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-1">
          Concierge Appointments
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#171717]">
          Styling Consultations ({bookings.length})
        </h1>
        <p className="text-xs text-[#626262] mt-1">
          Manage booked styling appointments and follow up with clients on WhatsApp.
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
            placeholder="Search by client name or phone..."
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
            <option value="all">All Appointments</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-[#E9E6E0] rounded-sm overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#71717A] uppercase tracking-wider border-b border-[#E9E6E0] font-semibold">
              <tr>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Requested Date &amp; Time</th>
                <th className="py-3 px-4">Focus</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E6E0]">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#171717]">
                    <p>{b.fullName}</p>
                    <p className="text-[11px] text-[#71717A]">{b.whatsapp}</p>
                  </td>
                  <td className="py-3 px-4 text-[#171717]">
                    {b.consultationType}
                  </td>
                  <td className="py-3 px-4 text-[#626262] whitespace-nowrap">
                    {b.preferredDate} ({b.preferredTime})
                  </td>
                  <td className="py-3 px-4 text-[#626262]">
                    {b.categoryInterest}
                  </td>
                  <td className="py-3 px-4">
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
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`https://wa.me/${b.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-white bg-[#25D366] hover:bg-[#20b858] rounded-xs"
                        title="Open WhatsApp Chat with Client"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => {
                          setSelectedBooking(b);
                          setNotesInput(b.internalNotes || '');
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-[#171717] hover:text-[#B99A5B] bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs"
                      >
                        View &amp; Manage
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Consultation Booking Details"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-sm shadow-2xl border border-[#E9E6E0] relative animate-fadeIn">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-4 right-4 text-[#71717A] hover:text-[#171717] text-lg font-bold"
              aria-label="Close modal"
            >
              ×
            </button>

            <span className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold block mb-1">
              Appointment File
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#171717] mb-4">
              {selectedBooking.fullName}
            </h2>

            <div className="space-y-2.5 text-xs text-[#626262] bg-[#FAF8F5] p-4 rounded-xs border border-[#E9E6E0] mb-5">
              <p>• <strong>Service:</strong> {selectedBooking.consultationType}</p>
              <p>• <strong>Slot:</strong> {selectedBooking.preferredDate} at {selectedBooking.preferredTime}</p>
              <p>• <strong>WhatsApp:</strong> {selectedBooking.whatsapp}</p>
              {selectedBooking.email && <p>• <strong>Email:</strong> {selectedBooking.email}</p>}
              <p>• <strong>Category Interest:</strong> {selectedBooking.categoryInterest}</p>
              {selectedBooking.preferredStyle && (
                <p>• <strong>Style/Occasion:</strong> {selectedBooking.preferredStyle}</p>
              )}
              {selectedBooking.budgetRange && (
                <p>• <strong>Budget Range:</strong> {selectedBooking.budgetRange}</p>
              )}
              {selectedBooking.notes && (
                <p>• <strong>Client Notes:</strong> {selectedBooking.notes}</p>
              )}
            </div>

            {/* Status Update */}
            <div className="mb-4 text-xs">
              <label className="block font-semibold text-[#171717] mb-1">
                Consultation Status
              </label>
              <div className="flex flex-wrap gap-2">
                {['pending', 'contacted', 'confirmed', 'completed', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => updateBookingStatus(selectedBooking.id, st, notesInput)}
                    className={`px-3 py-1 text-xs font-semibold uppercase rounded-xs border ${
                      selectedBooking.status === st
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
                Internal Stylist Notes
              </label>
              <textarea
                rows={3}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Recommendations shared, confirmed pieces, measurement notes..."
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E6E0] rounded-xs focus:border-[#B99A5B] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <a
                href={`https://wa.me/${selectedBooking.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#25D366] text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-[#20b858]"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Message Client</span>
              </a>

              <button
                onClick={() => {
                  updateBookingStatus(selectedBooking.id, selectedBooking.status, notesInput);
                  setSelectedBooking(null);
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
