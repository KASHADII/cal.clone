import React, { useState, useEffect } from 'react';
import api from '../axiosConfig';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const DAYS = [
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' },
  { id: 0, name: 'Sunday' },
];

export default function Availability() {
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const res = await api.get('/availability');
      const dbSched = res.data;
      const initialMap = {};
      
      DAYS.forEach(day => {
        const found = dbSched.find(d => d.day_of_week === day.id);
        if (found) {
          initialMap[day.id] = {
            active: true,
            start_time: found.start_time.slice(0,5),
            end_time: found.end_time.slice(0,5)
          };
        } else {
          initialMap[day.id] = {
            active: day.id >= 1 && day.id <= 5,
            start_time: '09:00',
            end_time: '17:00'
          };
        }
      });
      setSchedule(initialMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (id) => {
    setSchedule(prev => ({ ...prev, [id]: { ...prev[id], active: !prev[id].active } }));
  };

  const handleChange = (id, field, value) => {
    setSchedule(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const day of Object.values(DAYS)) {
        const payload = schedule[day.id];
        if (payload.active) {
          await api.post('/availability', {
            day_of_week: day.id,
            start_time: payload.start_time,
            end_time: payload.end_time,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          });
        }
      }
      alert('Availability updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save availability.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Availability</h1>
        <p className="text-muted-foreground">Configure your weekly recurring schedule.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Working Hours</CardTitle>
          <CardDescription>Set the days and times you are available for meetings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {DAYS.map(day => (
            <div key={day.id} className="flex items-center gap-4 py-3 border-b last:border-0 hover:bg-muted/30 px-2 rounded-md transition-colors">
              <div className="flex items-center gap-2 w-32">
                <input 
                  type="checkbox" 
                  checked={schedule[day.id].active} 
                  onChange={() => handleToggle(day.id)}
                  className="w-4 h-4 rounded border-input"
                />
                <Label className="text-base font-medium cursor-pointer" onClick={() => handleToggle(day.id)}>{day.name}</Label>
              </div>
              
              {schedule[day.id].active ? (
                <div className="flex items-center gap-3">
                  <Input 
                    type="time" 
                    value={schedule[day.id].start_time}
                    onChange={(e) => handleChange(day.id, 'start_time', e.target.value)}
                    className="w-32"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input 
                    type="time" 
                    value={schedule[day.id].end_time}
                    onChange={(e) => handleChange(day.id, 'end_time', e.target.value)}
                    className="w-32"
                  />
                </div>
              ) : (
                <div className="text-muted-foreground text-sm italic py-2">Unavailable</div>
              )}
            </div>
          ))}
          <div className="pt-6">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
