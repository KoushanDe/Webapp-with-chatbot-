import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, Loader2, Search, Sun, Moon, Sunrise, ArrowRight } from 'lucide-react';
import { sendToWebhook, generateSessionId } from '../services/chatService';
import { BookingFormData } from '../types';
import { SERVICES } from '../constants';

interface BookingSectionProps {
  prefilledService?: string | null;
}

// Specific list of slots to check against backend (includes gaps for breaks)
const PROMPT_SLOTS_LIST = "09:00 AM, 09:30 AM, 10:00 AM, 10:30 AM, 11:00 AM, 11:30 AM, 12:00 PM, 12:30 PM, 1:00 PM, 01:30 PM, 02:00 PM, 02:30 PM, 03:00 PM, 03:30 PM, 04:00 PM, 04:30 PM, 05:00 PM, 05:30 PM";

export const BookingSection: React.FC<BookingSectionProps> = ({ prefilledService }) => {
  const [activeTab, setActiveTab] = useState<'check' | 'book'>('check');
  const [checkDate, setCheckDate] = useState('');
  const [availabilityResponse, setAvailabilityResponse] = useState<string | null>(null);
  const [parsedSlots, setParsedSlots] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [bookingResponseMsg, setBookingResponseMsg] = useState('');
  
  const [sessionId] = useState(generateSessionId());

  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    service: SERVICES[0].name,
    notes: ''
  });

  // Watch for prefilled service prop changes
  useEffect(() => {
    if (prefilledService) {
      setFormData(prev => ({ ...prev, service: prefilledService }));
      setActiveTab('book');
    }
  }, [prefilledService]);

  // Generate continuous slots from 9:00 AM to 5:30 PM for UI display
  const generateAllTimeSlots = () => {
    const slots = [];
    // 9 AM to 5 PM start hours (so 5:30 PM is the last slot)
    const startHour = 9;
    const endHour = 17; // 17:00 is 5 PM
    
    for (let h = startHour; h <= endHour; h++) {
        // :00
        const d1 = new Date(2000, 0, 1, h, 0);
        slots.push(d1.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
        
        // :30
        const d2 = new Date(2000, 0, 1, h, 30);
        slots.push(d2.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    }
    return slots;
  };

  // Use generated slots for the dropdown and grid (9am - 5:30pm)
  const timeOptions = generateAllTimeSlots();

  // Helper to normalize time string to "hh:mm AM/PM"
  const normalizeTime = (timeStr: string): string | null => {
      // Create a dummy date to let JS parse the time string
      const d = new Date(`2000/01/01 ${timeStr}`);
      if (isNaN(d.getTime())) return null;
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const parseSlotsFromResponse = (text: string): string[] => {
    const lines = text.split('\n');
    const availableSlots: string[] = [];
    const timeRegex = /\b((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm])?|([01]?[0-9]|2[0-3]):[0-5][0-9])\b/;

    // Strict parsing strategy
    let foundStructuredResponse = false;

    for (const line of lines) {
        const upperLine = line.toUpperCase();
        
        // Check for time in the line
        const match = line.match(timeRegex);
        if (match) {
            // If the line explicitly says UNAVAILABLE or BOOKED, we skip it.
            // Note: We check this BEFORE checking for 'AVAILABLE' because 'UNAVAILABLE' contains 'AVAILABLE'
            if (upperLine.includes('UNAVAILABLE') || upperLine.includes('BOOKED')) {
                foundStructuredResponse = true;
                continue;
            }

            // If the line says AVAILABLE (and passed the check above), we treat it as valid.
            if (upperLine.includes('AVAILABLE')) {
                foundStructuredResponse = true;
                const normalized = normalizeTime(match[0]);
                if (normalized) availableSlots.push(normalized);
            }
        }
    }

    // Fallback: If the AI didn't return the structured "Time - Status" format 
    // (e.g., just returned a comma-separated list of available times), run the loose regex.
    if (!foundStructuredResponse && availableSlots.length === 0) {
        const looseMatches = text.match(/\b((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm])?|([01]?[0-9]|2[0-3]):[0-5][0-9])\b/g);
        if (looseMatches) {
            return Array.from(new Set(looseMatches.map(m => normalizeTime(m)).filter((t): t is string => t !== null)));
        }
    }
    
    // Sort chronologically
    return Array.from(new Set(availableSlots)).sort((a, b) => {
        const da = new Date(`2000/01/01 ${a}`);
        const db = new Date(`2000/01/01 ${b}`);
        return da.getTime() - db.getTime();
    });
  };

  const categorizeSlots = (slots: string[]) => {
      const morning: string[] = [];
      const afternoon: string[] = [];
      const evening: string[] = [];

      slots.forEach(slot => {
          const d = new Date(`2000/01/01 ${slot}`);
          const hour = d.getHours();
          
          if (hour < 12) {
              morning.push(slot);
          } else if (hour >= 12 && hour < 17) {
              afternoon.push(slot);
          } else {
              evening.push(slot);
          }
      });

      return { morning, afternoon, evening };
  };

  const handleCheckAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkDate) return;

    setHasChecked(false); // Reset UI to clear previous results
    setAvailabilityResponse(null);
    setParsedSlots([]);

    // Check for Sunday (Clinic Closed)
    // new Date('YYYY-MM-DD') parses as UTC midnight, so getUTCDay() is safe and consistent
    const dateObj = new Date(checkDate);
    const dayOfWeek = dateObj.getUTCDay(); // 0 is Sunday
    
    if (dayOfWeek === 0) {
        setAvailabilityResponse("The clinic is closed on Sundays. Please select a different date.");
        setHasChecked(true); // Ensure message shows
        return; 
    }

    setIsChecking(true);

    // Prompt specifically requesting the structured format required by our parser
    const prompt = `Check for availability of 30-minute appointment slots on ${checkDate} at ${PROMPT_SLOTS_LIST}. Adjust for timezone before checking.
    
    IMPORTANT: Return the availability in this strict format for each slot:
    "HH:MM AM/PM - AVAILABLE" or "HH:MM AM/PM - BOOKED"
    `;

    try {
      const response = await sendToWebhook({
        sessionId,
        message: prompt
      });
      
      const slots = parseSlotsFromResponse(response);
      setParsedSlots(slots);
      setHasChecked(true);

      if (slots.length === 0) {
        // If parsed slots are empty but we got a response, it might be "No slots available" text
        setAvailabilityResponse(response.length > 100 ? "No slots available for this date." : response);
      }

    } catch (error) {
      setAvailabilityResponse("Sorry, we couldn't fetch the slots right now. Please try again.");
      setHasChecked(true);
    } finally {
      setIsChecking(false);
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooking(true);
    setBookingStatus('idle');

    // Strict instructions for the AI to classify the outcome
    const prompt = `I would like to book an appointment.
    Name: ${formData.name}
    Phone: ${formData.phone}
    Email: ${formData.email}
    Service: ${formData.service}
    Date: ${formData.date}
    Time: ${formData.time}
    Notes: ${formData.notes}
    
    Action: Check availability and book if possible.
    
    RESPONSE FORMAT INSTRUCTIONS:
    1. Perform the booking action.
    2. Determine if the booking was SUCCESSFUL (slot secured) or FAILED (slot taken, closed, or error).
    3. If SUCCESSFUL, start your response strictly with: "BOOKING_SUCCESS"
    4. If FAILED, start your response strictly with: "BOOKING_FAILURE"
    5. Follow the status tag immediately with a professional, concise message addressed to the patient.
    `;

    try {
      const response = await sendToWebhook({
        sessionId,
        message: prompt
      });

      setBookingResponseMsg(response);

      // 1. Priority Check: Explicit Status Tags (AI Sentiment Analysis)
      if (response.includes('BOOKING_SUCCESS') || response.includes('BOOKING_CONFIRMED')) {
          setBookingStatus('success');
          setIsBooking(false);
          return;
      }

      if (response.includes('BOOKING_FAILURE')) {
          setBookingStatus('error');
          setIsBooking(false);
          return;
      }

      // 2. Fallback: Keyword Matching (Only if AI ignores the tags)
      const lowerResp = response.toLowerCase();
      
      const negativePhrases = [
          'already booked', 
          'not available', 
          'unavailable', 
          'taken', 
          'full', 
          'unfortunately', 
          'sorry', 
          'error', 
          'choose another',
          'try again',
          'try a different'
      ];
      
      const positivePhrases = [
          'confirm', 
          'successfully booked', 
          'appointment is booked',
          'scheduled', 
          'reserved', 
          'set',
          'success',
          'looking forward'
      ];

      const isNegative = negativePhrases.some(phrase => lowerResp.includes(phrase));
      
      // If NOT negative, check for positive signals. 
      const isPositive = positivePhrases.some(phrase => lowerResp.includes(phrase)) || 
                         (lowerResp.includes('booked') && !isNegative);

      const isSuccess = !isNegative && isPositive;

      if (isSuccess) {
        setBookingStatus('success');
      } else {
        setBookingStatus('error');
      }

    } catch (error) {
      setBookingStatus('error');
      setBookingResponseMsg("Connection error. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectSlot = (time: string) => {
      setFormData(prev => ({
          ...prev,
          date: checkDate,
          time: time
      }));
      setActiveTab('book');
  };

  // Categorize ALL possible time options, not just the available ones
  const { morning, afternoon, evening } = categorizeSlots(timeOptions);

  const SlotGroup = ({ title, slots, icon: Icon }: { title: string, slots: string[], icon: any }) => (
      slots.length > 0 ? (
          <div className="mb-6">
              <h5 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Icon size={16} className="text-dental-teal" /> {title}
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {slots.map((slot, idx) => {
                      const isAvailable = parsedSlots.includes(slot);
                      return (
                        <button
                            key={idx}
                            onClick={() => isAvailable && selectSlot(slot)}
                            disabled={!isAvailable}
                            className={`px-3 py-3 rounded-lg border font-medium text-sm flex items-center justify-center transition-all duration-200 ${
                                isAvailable 
                                ? 'bg-white border-dental-teal/30 text-dental-teal hover:bg-dental-teal hover:text-white shadow-sm hover:shadow-md cursor-pointer transform hover:-translate-y-0.5'
                                : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-70'
                            }`}
                        >
                            {slot}
                        </button>
                      );
                  })}
              </div>
          </div>
      ) : null
  );

  return (
    <section id="booking" className="py-20 bg-dental-light/30 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Book Your Visit</h2>
          <div className="w-20 h-1 bg-dental-teal mx-auto rounded-full" />
          <p className="mt-4 text-gray-600">Check availability or schedule your appointment instantly.</p>
        </div>

        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row min-h-[600px]">
          
          {/* Tabs / Sidebar */}
          <div className="bg-dental-teal md:w-1/3 p-8 text-white flex flex-col justify-center">
             <h3 className="text-2xl font-serif font-bold mb-6">How can we help?</h3>
             <div className="space-y-4">
               <button 
                 onClick={() => setActiveTab('check')}
                 className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-300 flex items-center gap-3 ${activeTab === 'check' ? 'bg-white text-dental-teal shadow-lg translate-x-2' : 'bg-teal-700/50 hover:bg-teal-700 text-teal-100'}`}
               >
                 <Search size={20} />
                 <span className="font-semibold">Check Slots</span>
               </button>
               
               <button 
                 onClick={() => setActiveTab('book')}
                 className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-300 flex items-center gap-3 ${activeTab === 'book' ? 'bg-white text-dental-teal shadow-lg translate-x-2' : 'bg-teal-700/50 hover:bg-teal-700 text-teal-100'}`}
               >
                 <Calendar size={20} />
                 <span className="font-semibold">Book Now</span>
               </button>
             </div>
             <p className="mt-8 text-sm text-teal-200 opacity-80">
               *For immediate emergencies, please use the chat widget or call us directly.
             </p>
          </div>

          {/* Content Area */}
          <div className="md:w-2/3 p-8 md:p-12 relative flex flex-col">
            
            {/* CHECK SLOTS VIEW */}
            {activeTab === 'check' && (
              <div className="animate-fade-in-up flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
                  <Clock className="text-dental-teal" /> See Available Times
                </h3>
                <p className="text-gray-500 mb-6">Select a date to see what openings Dr. Smith has.</p>
                
                <form onSubmit={handleCheckAvailability} className="flex flex-col sm:flex-row gap-4 items-end mb-6">
                   <div className="w-full">
                     <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                     <input 
                       type="date" 
                       value={checkDate}
                       onChange={(e) => {
                           setCheckDate(e.target.value);
                           // Reset checking state if date changes to avoid mismatch
                           setHasChecked(false);
                           setParsedSlots([]);
                           setAvailabilityResponse(null);
                       }}
                       min={new Date().toISOString().split('T')[0]}
                       className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-dental-teal focus:border-transparent outline-none"
                       required
                     />
                   </div>
                   <button 
                     type="submit"
                     disabled={isChecking}
                     className="px-6 py-3 bg-dental-teal text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                   >
                     {isChecking ? <Loader2 className="animate-spin" /> : 'Check'}
                   </button>
                </form>

                {/* Loading Status Text */}
                {isChecking && (
                    <div className="p-4 bg-dental-light/50 text-dental-teal rounded-lg flex items-center gap-3 animate-pulse mb-4">
                        <Loader2 className="animate-spin" size={18} />
                        <span className="font-medium">Finding available slots...</span>
                    </div>
                )}

                {/* Slots Grid Display - Shows ALL slots (greying out unavailable) */}
                {hasChecked && !isChecking && (
                    <div className="mt-4 animate-fade-in-up space-y-2 overflow-y-auto pr-2 max-h-[400px]">
                        <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 py-2 border-b border-gray-100">
                            <h4 className="font-bold text-gray-800">Schedule for {new Date(checkDate).toLocaleDateString()}:</h4>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${parsedSlots.length > 0 ? 'text-dental-teal bg-dental-light' : 'text-red-500 bg-red-50'}`}>
                                {parsedSlots.length} openings
                            </span>
                        </div>
                        
                        <SlotGroup title="Morning" slots={morning} icon={Sunrise} />
                        <SlotGroup title="Afternoon" slots={afternoon} icon={Sun} />
                        <SlotGroup title="Evening" slots={evening} icon={Moon} />
                        
                        {parsedSlots.length === 0 && (
                             <p className="text-red-500 text-sm mt-4 text-center font-medium">
                                 {availabilityResponse || "No slots available for this date. Please try another day."}
                             </p>
                        )}
                        <p className="text-xs text-gray-400 mt-6 text-center">Grey slots are already booked.</p>
                    </div>
                )}
              </div>
            )}

            {/* BOOK NOW VIEW */}
            {activeTab === 'book' && (
              <div className="animate-fade-in-up h-full">
                {bookingStatus === 'success' ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2 animate-bounce">
                      <CheckCircle className="text-green-600" size={40} />
                    </div>
                    
                    <h3 className="text-3xl font-serif font-bold text-gray-900">Booking Confirmed!</h3>
                    
                    <p className="text-gray-500">
                        Find more details about your appointment in your email inbox.
                    </p>

                    {/* Structured Confirmation Card (Hidden raw backend message) */}
                    <div className="w-full max-w-md bg-dental-light/30 p-6 rounded-xl border border-dental-teal/20 mt-4 text-left shadow-sm">
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Patient</p>
                                <p className="text-gray-900 font-semibold">{formData.name}</p>
                             </div>
                             <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Service</p>
                                <p className="text-gray-900 font-semibold">{formData.service}</p>
                             </div>
                             <div className="col-span-2 border-t border-gray-200 pt-3 mt-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">When</p>
                                <p className="text-dental-teal font-bold text-lg">
                                    {formData.date} <span className="text-gray-400 font-normal">at</span> {formData.time}
                                </p>
                             </div>
                        </div>
                    </div>

                    <button 
                      onClick={() => {
                         setBookingStatus('idle');
                         setFormData(prev => ({ ...prev, notes: '' }));
                      }}
                      className="mt-6 px-8 py-3 bg-dental-teal text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl"
                    >
                      Book Another Appointment
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <Calendar className="text-dental-teal" /> Request Appointment
                    </h3>
                    
                    {bookingStatus === 'error' && (
                      <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start gap-3">
                         <AlertCircle className="shrink-0 mt-0.5" size={18} />
                         <div>
                           <p className="font-bold">Slot Unavailable / Issue</p>
                           {/* Static error message, hiding raw backend text */}
                           <p className="text-sm mt-1">
                               The selected time slot is unfortunately unavailable. Please choose a different time.
                           </p>
                         </div>
                      </div>
                    )}

                    <form onSubmit={handleBookAppointment} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                          <input 
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-dental-teal outline-none"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                          <input 
                            name="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-dental-teal outline-none"
                            placeholder="+971 50 123 4567"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Service</label>
                          <select 
                            name="service"
                            value={formData.service}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-dental-teal outline-none"
                          >
                            {SERVICES.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                          <input 
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-dental-teal outline-none"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preferred Date</label>
                           <input 
                             name="date"
                             type="date"
                             required
                             value={formData.date}
                             onChange={handleInputChange}
                             min={new Date().toISOString().split('T')[0]}
                             className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-dental-teal outline-none"
                           />
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preferred Time</label>
                           <select 
                             name="time"
                             required
                             value={formData.time}
                             onChange={handleInputChange}
                             className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-dental-teal outline-none"
                           >
                             <option value="">Select Time</option>
                             {timeOptions.map(t => (
                                 <option key={t} value={t}>{t}</option>
                             ))}
                           </select>
                         </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Notes / Symptoms</label>
                        <textarea 
                          name="notes"
                          rows={2}
                          value={formData.notes}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-dental-teal outline-none"
                          placeholder="Any specific pain or questions?"
                        />
                      </div>

                      <button 
                        type="submit"
                        disabled={isBooking}
                        className="w-full py-4 bg-dental-teal text-white font-bold text-lg rounded-xl hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isBooking ? (
                          <>
                            <Loader2 className="animate-spin" /> Processing...
                          </>
                        ) : (
                          "Confirm Appointment Request"
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};