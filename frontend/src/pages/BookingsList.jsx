import React, { useState, useEffect } from 'react';
import api from '../axiosConfig';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar as CalIcon, Clock, User, Trash } from 'lucide-react';

export default function BookingsList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      setBookings(bookings.filter(b => b.id !== id));
      await api.delete(`/bookings/${id}`);
    } catch (error) {
      console.error('Error cancelling booking', error);
      fetchBookings();
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const upcoming = bookings.filter(b => b.date >= todayStr);
  const past = bookings.filter(b => b.date < todayStr);

  const renderBooking = (b, isPast = false) => {
    const localDate = new Date(`${b.date}T${b.time}`); 
    const timeStr = localDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = localDate.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

    return (
      <Card key={b.id} className={`overflow-hidden transition-all ${isPast ? 'opacity-60 bg-muted/30 border-muted' : 'border-border shadow-sm'}`}>
        <div className="flex border-l-4" style={{ borderColor: isPast ? 'hsl(var(--muted-foreground))' : 'hsl(var(--primary))'}}>
          <CardContent className="flex flex-col md:flex-row md:items-center justify-between w-full p-6">
            <div className="space-y-4 md:space-y-0 md:flex flex-1 gap-8">
              <div className="w-56">
                <p className="text-sm font-semibold mb-1 truncate">{b.event_title}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3"/> {b.duration} mins</p>
              </div>
              <div className="flex-1 border-l pl-8 border-border">
                <div className="flex items-center gap-2 mb-1.5 text-sm font-medium">
                  <CalIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>{dateStr} at <span className="font-semibold">{timeStr}</span></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4 shrink-0" />
                  <span className="font-medium text-foreground">{b.name}</span> <span className="truncate max-w-[150px] inline-block">({b.email})</span>
                </div>
              </div>
            </div>
            
            {!isPast && (
              <div className="mt-4 md:mt-0 flex shrink-0 ml-4">
                <Button variant="outline" size="sm" onClick={() => handleCancel(b.id)} className="text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors border-destructive/30">
                  <Trash className="w-3.5 h-3.5 mr-2" /> Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground">Manage your upcoming and past events.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 border rounded-xl border-dashed">
          <p className="text-muted-foreground">No bookings found.</p>
        </div>
      ) : (
        <div className="space-y-10 mt-6">
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">Upcoming 
              <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">{upcoming.length}</span>
            </h3>
            <div className="space-y-4">
              {upcoming.length > 0 ? upcoming.map(b => renderBooking(b, false)) : <p className="text-muted-foreground text-sm italic py-4 bg-muted/40 text-center rounded-md border border-dashed">No upcoming bookings. Enjoy your free time!</p>}
            </div>
          </div>

          {past.length > 0 && (
          <div>
             <h3 className="text-xl font-semibold mb-6 text-muted-foreground flex items-center gap-2">Past 
              <span className="bg-muted text-muted-foreground text-xs font-bold px-2.5 py-1 rounded-full">{past.length}</span>
             </h3>
            <div className="space-y-4">
              {past.map(b => renderBooking(b, true))}
            </div>
          </div>
          )}
        </div>
      )}
    </div>
  );
}
