import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../axiosConfig';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Clock, Calendar as CalIcon, ChevronLeft, Loader2, CheckCircle2, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BookingPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [eventError, setEventError] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [fetchingSlots, setFetchingSlots] = useState(false);
  
  const [form, setForm] = useState({ name: '', email: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    api.get('/events').then(res => {
      const found = res.data.find(e => e.slug === slug);
      if (found) setEvent(found);
      else setEventError(true);
    }).catch(() => setEventError(true));
  }, [slug]);

  useEffect(() => {
    if (!selectedDate || !event) return;
    setFetchingSlots(true);
    setSelectedTime('');
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    
    api.get(`/timeslots?date=${dateStr}&event_type_id=${event.id}`)
      .then(res => setSlots(res.data))
      .catch(() => setSlots([]))
      .finally(() => setFetchingSlots(false));
  }, [selectedDate, event]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedTime || !selectedDate) return alert("Select a time");
    
    setBookingLoading(true);
    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    try {
      await api.post('/bookings', {
        event_type_id: event.id,
        name: form.name,
        email: form.email,
        date: dateStr,
        time: selectedTime
      });
      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed. Slot may have been taken.');
      setSelectedDate(new Date(selectedDate.getTime())); // Trigger slot refresh
    } finally {
      setBookingLoading(false);
    }
  };

  if (eventError) return <div className="h-screen flex items-center justify-center p-4 bg-background"><h2 className="text-xl font-bold">Event Not Found</h2></div>;
  if (!event) return <div className="h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;

  if (success) {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4"><ThemeToggle /></div>
        <Card className="w-full max-w-md p-8 text-center flex flex-col items-center border-border shadow-lg rounded-2xl bg-background">
          <div className="w-16 h-16 bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2 tracking-tight">Booking Confirmed</h2>
          <p className="text-muted-foreground mb-8 text-sm">You are scheduled with <span className="font-medium text-foreground">{form.name}</span> for <span className="font-medium text-foreground">{event.title}</span>.</p>
          <div className="bg-muted/50 p-5 rounded-xl w-full mb-8 text-left border border-border/50 shadow-sm">
            <p className="font-semibold text-foreground">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
            <div className="flex items-center gap-4 mt-2 text-muted-foreground">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> {selectedTime.slice(0, 5)}</span>
              <span className="flex items-center gap-1.5"><Globe className="w-4 h-4"/> {localTimezone}</span>
            </div>
          </div>
          <Link to="/" className="w-full">
            <Button className="w-full h-11 shadow-sm" variant="default">Return Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4 md:py-12 relative transition-colors">
      <div className="absolute top-4 right-4 md:top-8 md:right-8">
        <ThemeToggle />
      </div>

      <Card className={cn(
        "w-full transition-all duration-300 overflow-hidden flex flex-col md:flex-row shadow-xl border-border/40 rounded-[24px] bg-background", 
        !selectedTime && selectedDate && slots.length > 0 ? 'max-w-5xl' : 'max-w-4xl'
      )}>
        
        {/* Left Side: Event Details */}
        <div className="md:w-[320px] bg-muted/30 border-r border-border/50 p-6 md:p-8 shrink-0 flex flex-col relative z-10 hidden md:flex">
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-8">Cal.clone</h3>
          <h2 className="text-2xl font-bold text-foreground mb-4 leading-tight">{event.title}</h2>
          <div className="flex items-center gap-2 text-muted-foreground font-medium mb-4 text-sm">
            <Clock className="w-4 h-4" />
            {event.duration} min
          </div>
          <p className="text-sm text-foreground/80 mb-4 leading-relaxed">{event.description}</p>
          
          {selectedDate && selectedTime && (
            <div className="mt-auto pt-6 border-t border-border/50 font-semibold">
              <div className="flex items-center gap-3 mb-2 text-primary">
                <CalIcon className="w-4 h-4" />
                <span className="text-lg">{selectedTime.slice(0, 5)}</span>
              </div>
              <div className="text-sm text-muted-foreground pl-7 font-medium">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </div>
              <div className="text-xs text-muted-foreground pl-7 font-medium mt-1 flex items-center gap-1.5">
                <Globe className="w-3 h-3"/> {localTimezone}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Header (Shows only on mobile) */}
        <div className="md:hidden p-6 border-b border-border/50 bg-muted/10">
           <h2 className="text-xl font-bold text-foreground mb-2">{event.title}</h2>
           <div className="flex items-center gap-2 text-muted-foreground font-medium text-xs">
             <Clock className="w-3.5 h-3.5" />
             {event.duration} min
             {selectedDate && selectedTime && (
               <>
                 <span className="px-1">•</span>
                 <CalIcon className="w-3.5 h-3.5" />
                 {selectedTime.slice(0, 5)}, {format(selectedDate, 'MMM d')}
               </>
             )}
           </div>
        </div>

        {/* Right Side: Flow */}
        <div className="flex-1 bg-background p-6 md:p-8 flex flex-col min-h-[450px]">
          {!selectedTime ? (
             <div className="flex-1 flex flex-col h-full animate-in fade-in duration-300 slide-in-from-right-4">
               <h3 className="text-xl font-bold mb-6 tracking-tight">Select a Date & Time</h3>
               
               <div className="flex flex-col lg:flex-row gap-8 h-full">
                 {/* Calendar UI */}
                 <div className="flex-1 flex justify-center lg:justify-start lg:max-w-[340px]">
                   <Calendar 
                     selectedDate={selectedDate} 
                     onSelect={setSelectedDate}
                     className="border border-border/40 rounded-xl shadow-sm bg-card/50" 
                   />
                 </div>
                 
                 {/* Time Slots */}
                 {selectedDate && (
                   <div className="flex-1 flex flex-col lg:border-l lg:pl-8 border-border/50 animate-in fade-in slide-in-from-left-4 duration-300">
                     <Label className="mb-4 block text-center lg:text-left text-[15px] font-semibold tracking-tight">
                       {format(selectedDate, 'EEEE, MMMM d')}
                     </Label>
                     {fetchingSlots ? (
                       <div className="flex justify-center mt-12"><Loader2 className="w-7 h-7 animate-spin text-muted-foreground" /></div>
                     ) : slots.length === 0 ? (
                       <div className="bg-muted/40 rounded-xl p-6 text-center mt-2 border border-dashed border-border/60">
                         <p className="text-muted-foreground text-sm font-medium">No available times on this date.</p>
                       </div>
                     ) : (
                       <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 overflow-y-auto max-h-[350px] pr-2 pb-2 scrollbar-thin">
                         {slots.map(slot => (
                           <Button 
                             key={slot} 
                             variant="outline"
                             className="h-12 border-border/60 hover:border-primary hover:text-primary transition-all font-semibold rounded-lg shadow-sm"
                             onClick={() => setSelectedTime(slot)}
                           >
                             {slot.slice(0, 5)}
                           </Button>
                         ))}
                       </div>
                     )}
                   </div>
                 )}
               </div>
               
               <div className="mt-8 text-left text-xs text-muted-foreground font-medium flex items-center gap-1.5 opacity-70">
                 <Globe className="w-3.5 h-3.5" /> Time zone: <span className="text-foreground">{localTimezone}</span>
               </div>
             </div>
          ) : (
            <div className="flex-1 max-w-sm mx-auto w-full flex flex-col justify-center animate-in fade-in slide-in-from-right-8 duration-300">
              <div className="flex items-center mb-8 relative">
                <Button variant="ghost" size="icon" onClick={() => setSelectedTime('')} className="absolute -left-12 rounded-full hidden md:inline-flex hover:bg-muted">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedTime('')} className="md:hidden mr-4 h-8 px-2">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <h3 className="text-2xl font-bold tracking-tight">Enter Details</h3>
              </div>
              <form onSubmit={handleBook} className="space-y-5">
                <div className="space-y-2">
                  <Label className="font-semibold text-foreground/80">Full Name *</Label>
                  <Input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Doe" className="h-12 rounded-xl bg-muted/20 border-border/60" />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-foreground/80">Email Address *</Label>
                  <Input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" className="h-12 rounded-xl bg-muted/20 border-border/60" />
                </div>
                <div className="pt-6">
                  <Button type="submit" className="w-full h-12 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all" disabled={bookingLoading}>
                    {bookingLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                    Confirm Booking
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </Card>
      
      {/* Footer minimal */}
      <div className="mt-8 text-center opacity-50 transition-opacity hover:opacity-100">
        <p className="text-[10px] font-bold uppercase tracking-widest text-foreground">Powered by Cal Clone</p>
      </div>
    </div>
  );
}
