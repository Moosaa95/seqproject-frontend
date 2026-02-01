import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, AlertCircle, Plus, Search } from 'lucide-react';
import { useAppDispatch } from '@/lib/store/hooks';
import { clearBooking } from '@/lib/store/slices/bookingsSlice';
import { useGetPropertiesQuery } from '@/lib/store/api/propertyApi';
import { useCreateBookingMutation } from '@/lib/store/api/adminApi';

interface AdminBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface BookingFormData {
  property_id: string;
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  special_requests?: string;
}

export default function AdminBookingModal({ isOpen, onClose, onSuccess }: AdminBookingModalProps) {
  const dispatch = useAppDispatch();
  const { data: propertiesData, isLoading: propertiesLoading } = useGetPropertiesQuery({}, { skip: !isOpen });
  const [createBooking, { isLoading: loading, error: apiError, isSuccess: success, data: bookingData }] = useCreateBookingMutation();
  const currentBooking = bookingData;
  const error = apiError ? (('data' in (apiError as any) ? (apiError as any).data.message || 'Failed to create booking' : 'Failed to create booking')) : null;

  const items = propertiesData?.results || [];
  const properties = items;

  const [searchTerm, setSearchTerm] = useState('');
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);

  const [formData, setFormData] = useState<BookingFormData>({
    property_id: '',
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    special_requests: '',
  });

  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  // Handle successful booking
  useEffect(() => {
    if (success && currentBooking) {
      setTimeout(() => {
        handleCleanup();
        onSuccess?.();
      }, 2000);
    }
  }, [success, currentBooking, onSuccess]);

  const handleCleanup = () => {
    setFormData({
      property_id: '',
      name: '',
      email: '',
      phone: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      special_requests: '',
    });
    setSelectedProperty(null);
    setSearchTerm('');
    // dispatch(clearBooking()); // No longer needed if not using slice state for result
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.property_id) {
      alert('Please select a property');
      return;
    }

    try {
      await createBooking({
        property_id: formData.property_id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        check_in: formData.checkIn,
        check_out: formData.checkOut,
        guests: formData.guests,
        special_requests: formData.special_requests,
      }).unwrap();
    } catch (err) {
      console.error('Failed to create booking:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  const handlePropertySelect = (property: any) => {
    setSelectedProperty(property);
    setFormData(prev => ({ ...prev, property_id: property.id }));
    setSearchTerm(property.title);
    setShowPropertyDropdown(false);
  };

  const filteredProperties = (properties || []).filter((property) =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto border border-gray-200"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl flex items-center justify-between z-10">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Create Booking for Client</h2>
                  <p className="text-sm text-gray-600 mt-0.5">Book an apartment on behalf of a client</p>
                </div>
                <button
                  onClick={handleCleanup}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-red-900">Booking Error</h3>
                      <p className="text-sm text-red-700 mt-1 whitespace-pre-line">{error}</p>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {success && currentBooking && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3">
                    <AlertCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-green-900">Booking Created Successfully</h3>
                      <p className="text-sm text-green-700 mt-1 whitespace-pre-line">
                        Booking ID: {currentBooking.booking_id}{'\n'}
                        Total Amount: {currentBooking.currency}{parseFloat(currentBooking.total_amount).toLocaleString()}{'\n'}
                        Nights: {currentBooking.nights}
                      </p>
                    </div>
                  </div>
                )}

                {/* Property Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Select Property *
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowPropertyDropdown(true);
                      }}
                      onFocus={() => setShowPropertyDropdown(true)}
                      placeholder="Search for a property..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                    />

                    {/* Property Dropdown */}
                    {showPropertyDropdown && (
                      <div className="absolute z-20 mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {propertiesLoading ? (
                          <div className="p-4 text-center text-gray-500">Loading properties...</div>
                        ) : filteredProperties.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">No properties found</div>
                        ) : (
                          filteredProperties.map((property) => (
                            <button
                              key={property.id}
                              type="button"
                              onClick={() => handlePropertySelect(property)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-semibold text-gray-900">{property.title}</div>
                              <div className="text-sm text-gray-600">{property.location}</div>
                              <div className="text-sm text-emerald-600 font-medium mt-1">
                                {property.currency}{parseFloat(property.price).toLocaleString()}/night
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  {selectedProperty && (
                    <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="text-sm font-semibold text-emerald-900">{selectedProperty.title}</div>
                      <div className="text-xs text-emerald-700">{selectedProperty.location}</div>
                    </div>
                  )}
                </div>

                {/* Client Information */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Client Information</h3>

                  {/* Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Full name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter client's full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  {/* Email and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="client@email.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+234 800 000 0000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Booking Details</h3>

                  {/* Dates */}
                  <div className="border border-gray-300 rounded-xl p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                          Check-in *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                          <input
                            type="date"
                            name="checkIn"
                            value={formData.checkIn}
                            onChange={handleChange}
                            required
                            min={today}
                            className="w-full pl-10 pr-3 py-2 border-0 focus:ring-0 text-sm font-medium text-gray-900"
                          />
                        </div>
                      </div>
                      <div className="border-l border-gray-300 pl-4">
                        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                          Checkout *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                          <input
                            type="date"
                            name="checkOut"
                            value={formData.checkOut}
                            onChange={handleChange}
                            required
                            min={formData.checkIn || today}
                            className="w-full pl-10 pr-3 py-2 border-0 focus:ring-0 text-sm font-medium text-gray-900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="border border-gray-300 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900">
                          Guests *
                        </label>
                        <p className="text-xs text-gray-500 mt-0.5">Maximum 10 guests</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, guests: Math.max(1, prev.guests - 1) }))}
                          className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                        >
                          <span className="text-gray-600 font-medium">−</span>
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-900">{formData.guests}</span>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, guests: Math.min(10, prev.guests + 1) }))}
                          className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                        >
                          <span className="text-gray-600 font-medium">+</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      name="special_requests"
                      value={formData.special_requests}
                      onChange={handleChange}
                      placeholder="Any special requests or notes..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400 resize-none"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200 -mx-6 px-6 -mb-6 pb-6 mt-6">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleCleanup}
                      className="flex-1 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || success}
                      className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Creating Booking...' : success ? 'Booking Created!' : 'Create Booking'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
