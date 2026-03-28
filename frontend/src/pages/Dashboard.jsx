import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../axiosConfig';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Plus, Clock, Link as LinkIcon, Copy, Trash, Edit } from 'lucide-react';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ id: null, title: '', description: '', duration: 30, slug: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const openCreateModal = () => {
    setForm({ id: null, title: '', description: '', duration: 30, slug: '' });
    setIsEditing(false);
    setModalOpen(true);
  };

  const openEditModal = (evt) => {
    setForm({ ...evt });
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDuplicate = async (evt) => {
    try {
      await api.post('/events', {
        ...evt,
        title: `${evt.title} (Copy)`,
        slug: `${evt.slug}-copy`
      });
      fetchEvents();
    } catch (err) {
      alert("Failed to duplicate. The slug might already exist.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.slug) return;
    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/events/${form.id}`, form);
      } else {
        await api.post('/events', form);
      }
      setModalOpen(false);
      fetchEvents();
    } catch (error) {
      alert('Failed to save. Ensure the slug is unique.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      setEvents(events.filter(e => e.id !== id));
      await api.delete(`/events/${id}`);
    } catch (error) {
      console.error(error);
      fetchEvents();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-background/50">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Types</h1>
          <p className="text-muted-foreground">Create and manage your meeting types.</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" /> New
        </Button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Event Type' : 'Create Event Type'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update your event details.' : 'Add a new meeting type.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. 15 Min Chat" />
            </div>
            <div className="space-y-2">
              <Label>URL Slug</Label>
              <Input required value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="e.g. 15min" />
            </div>
            <div className="space-y-2">
              <Label>Duration (minutes)</Label>
              <Input type="number" required min="5" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Meeting details..." />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {fetching ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 border rounded-xl border-dashed">
          <p className="text-muted-foreground mb-4">You don't have any event types yet.</p>
          <Button onClick={openCreateModal} variant="outline">Create your first event</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <Card key={evt.id} className="flex flex-col hover:border-primary/50 transition-colors shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex justify-between items-start text-lg">
                  <span className="truncate pr-2">{evt.title}</span>
                </CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px] text-xs">{evt.description || 'No description provided.'}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4 mt-auto">
                <div className="flex flex-col gap-2 text-sm text-foreground/80 font-medium max-w-fit">
                  <div className="flex items-center gap-2 bg-muted px-2 py-1 rounded-md">
                    <Clock className="w-3.5 h-3.5" /> {evt.duration} mins
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground truncate w-full">
                    <LinkIcon className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">/{evt.slug}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t gap-2 justify-between flex-wrap">
                <Link to={`/book/${evt.slug}`} target="_blank" className="flex-1">
                  <Button variant="outline" className="w-full h-8 px-3 text-xs">Preview</Button>
                </Link>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDuplicate(evt)} title="Duplicate">
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditModal(evt)} title="Edit">
                    <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(evt.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" title="Delete">
                    <Trash className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
