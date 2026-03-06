
import React, { useEffect, useState } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Trash2, Eye, Download, Pencil } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

const RSVPS_PER_PAGE = 5;

interface EventRegistration {
  id: string;
  name: string;
  email: string;
  phone?: string;
  event_id: string;
  registered_at: string;
  [key: string]: string | undefined;
}

const RSVPAdminTable = () => {
  const [rsvps, setRsvps] = useState<EventRegistration[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalRSVP, setModalRSVP] = useState<EventRegistration | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRSVP, setEditRSVP] = useState<EventRegistration | null>(null);

  const fetchRsvps = async () => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .order('registered_at', { ascending: false });
      if (!error && data) setRsvps(data);
      else setRsvps([]);
    } catch {
      setRsvps([]);
    }
  };

  useEffect(() => {
    fetchRsvps();
  }, []);

  function arrayToCSV(rows: EventRegistration[], headers: string[]): string {
    const escape = (v: string | undefined) => '"' + String(v).replace(/"/g, '""') + '"';
    return [headers.join(','), ...rows.map(row => headers.map(h => escape(row[h] ?? '')).join(','))].join('\r\n');
  }
  function downloadCSV(filename: string, csv: string) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = rsvps.filter(rsvp =>
    Object.values(rsvp).some(val => String(val).toLowerCase().includes(search.toLowerCase()))
  );

  const handleEditRSVP = (idx: number) => {
    setEditRSVP(filtered[idx]);
    setShowEditModal(true);
  };
  const handleSaveEditRSVP = async () => {
    if (editRSVP && editRSVP.id) {
      await supabase.from('event_registrations').update(editRSVP).eq('id', editRSVP.id);
      await fetchRsvps();
    }
    setShowEditModal(false);
  };

  const handleDeleteSelected = async () => {
    for (const idx of selected) {
      const rsvp = filtered[idx];
      if (rsvp && rsvp.id) {
        await supabase.from('event_registrations').delete().eq('id', rsvp.id);
      }
    }
    await fetchRsvps();
    setSelected([]);
  };

  const handleDeleteSingle = async (rsvp: EventRegistration, idx: number) => {
    if (rsvp.id) {
      await supabase.from('event_registrations').delete().eq('id', rsvp.id);
      await fetchRsvps();
      setSelected(selected.filter(idx2 => idx2 !== idx));
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          type="text"
          placeholder="Search RSVPs..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="border rounded p-2 w-48"
          aria-label="Search RSVPs"
        />
        <button
          className="bg-primary text-primary-foreground rounded px-3 py-1 text-sm"
          onClick={() => {
            const csv = arrayToCSV(filtered, Object.keys(filtered[0] || {}));
            downloadCSV('rsvps.csv', csv);
          }}
          aria-label="Export RSVPs as CSV"
        >Export CSV</button>
        {selected.length > 0 && (
          <button
            className="bg-destructive text-destructive-foreground rounded px-3 py-1 text-sm"
            onClick={handleDeleteSelected}
            aria-label="Delete selected RSVPs"
          >Delete Selected</button>
        )}
      </div>
      {rsvps.length === 0 && (
        <div className="flex justify-center py-12" aria-live="polite">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" role="status">
            <span className="sr-only">Loading RSVPs...</span>
          </div>
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border border-border" tabIndex={0} aria-label="RSVPs Table Wrapper">
        <table className="w-full text-left border-t border-border" aria-label="RSVPs Table" role="table">
          <thead>
            <tr>
              <th scope="col" className="p-2"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={e => setSelected(e.target.checked ? filtered.map((_, i) => i) : [])} aria-label="Select all RSVPs" /></th>
              {Object.keys(filtered[0] || {}).map(key => <th key={key} scope="col" className="p-2 text-xs uppercase text-muted-foreground">{key}</th>)}
              <th scope="col" className="p-2 text-xs uppercase text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && rsvps.length > 0 ? (
              <tr>
                <td colSpan={Object.keys(filtered[0] || {}).length + 2} className="text-center py-8 text-muted-foreground" aria-live="polite">
                  No RSVPs found.
                </td>
              </tr>
            ) : filtered
              .slice((page - 1) * RSVPS_PER_PAGE, page * RSVPS_PER_PAGE)
              .map((rsvp, i) => (
                <tr key={rsvp.id || i} className="border-t border-border hover:bg-muted/50 transition-colors" tabIndex={0}>
                  <td className="p-2"><input type="checkbox" checked={selected.includes(i)} onChange={e => setSelected(e.target.checked ? [...selected, i] : selected.filter(idx => idx !== i))} aria-label={`Select RSVP ${i + 1}`} /></td>
                  {Object.values(rsvp).map((val, j) => <td key={j} className="p-2 text-sm text-foreground">{String(val)}</td>)}
                  <td className="p-2 flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button aria-label="View RSVP" onClick={() => { setModalRSVP(rsvp); setShowModal(true); }} className="text-primary p-1 rounded hover:bg-muted"><Eye className="h-4 w-4" /></button>
                      </TooltipTrigger>
                      <TooltipContent>View details</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button aria-label="Edit RSVP" onClick={() => handleEditRSVP(i)} className="text-primary p-1 rounded hover:bg-muted"><Pencil className="h-4 w-4" /></button>
                      </TooltipTrigger>
                      <TooltipContent>Edit</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button aria-label="Delete RSVP" onClick={() => handleDeleteSingle(rsvp, i)} className="text-destructive p-1 rounded hover:bg-muted"><Trash2 className="h-4 w-4" /></button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 border border-border rounded disabled:opacity-50 text-sm" aria-label="Previous page">Prev</button>
        <span className="text-sm text-muted-foreground py-1" aria-live="polite">Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page * RSVPS_PER_PAGE >= filtered.length} className="px-2 py-1 border border-border rounded disabled:opacity-50 text-sm" aria-label="Next page">Next</button>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-label="RSVP Details Modal" tabIndex={-1} onKeyDown={e => { if (e.key === 'Escape') setShowModal(false); }}>
          <div className="bg-card border border-border rounded-xl shadow-lg p-6 min-w-[300px] max-w-[90vw]" tabIndex={0}>
            <h3 className="font-bold text-lg mb-2 text-foreground">RSVP Details</h3>
            {modalRSVP && Object.entries(modalRSVP).map(([k, v]) => (
              <div key={k} className="text-sm text-foreground"><b className="text-muted-foreground">{k}:</b> {String(v)}</div>
            ))}
            <button className="mt-4 bg-primary text-primary-foreground rounded px-4 py-2 text-sm" onClick={() => setShowModal(false)} autoFocus>Close</button>
          </div>
        </div>
      )}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit RSVP</DialogTitle>
          </DialogHeader>
          {editRSVP && (
            <form onSubmit={e => { e.preventDefault(); handleSaveEditRSVP(); }} className="space-y-2">
              {Object.entries(editRSVP).map(([k, v]) => (
                <div key={k}>
                  <label className="block text-sm font-medium text-muted-foreground mb-1" htmlFor={`edit-${k}`}>{k}</label>
                  <input id={`edit-${k}`} className="border border-border rounded p-2 w-full bg-background text-foreground" value={typeof v === 'string' || typeof v === 'number' ? v : ''} onChange={e => setEditRSVP((prev) => prev ? ({ ...prev, [k]: e.target.value }) : null)} />
                </div>
              ))}
              <DialogFooter>
                <button type="button" className="bg-muted text-muted-foreground rounded px-4 py-2 mr-2 text-sm" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="bg-primary text-primary-foreground rounded px-4 py-2 text-sm">Save</button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RSVPAdminTable;
