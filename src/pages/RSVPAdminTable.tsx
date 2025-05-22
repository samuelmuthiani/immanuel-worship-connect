import React, { useEffect, useState } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { FiTrash2, FiEye, FiDownload, FiEdit } from 'react-icons/fi';
import { getAllRSVPs, saveRSVP } from '@/utils/storage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

const RSVPS_PER_PAGE = 5;

const RSVPAdminTable = () => {
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalRSVP, setModalRSVP] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRSVP, setEditRSVP] = useState<any>(null);

  useEffect(() => {
    // Fetch RSVPs from Supabase (was localStorage)
    (async () => {
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
    })();
  }, []);

  function arrayToCSV(rows: any[], headers: string[]): string {
    const escape = (v: any) => '"' + String(v).replace(/"/g, '""') + '"';
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

  // RSVP editing handler (UI only, localStorage for now, Supabase TODO)
  const handleEditRSVP = (idx: number) => {
    setEditRSVP(filtered[idx]);
    setShowEditModal(true);
  };
  const handleSaveEditRSVP = async () => {
    // Save to Supabase
    if (editRSVP && editRSVP.id) {
      await supabase.from('event_registrations').update(editRSVP).eq('id', editRSVP.id);
      // Refresh list
      const { data } = await supabase.from('event_registrations').select('*').order('registered_at', { ascending: false });
      setRsvps(data || []);
    }
    setShowEditModal(false);
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
          className="bg-iwc-blue text-white rounded px-3 py-1 text-sm"
          onClick={() => {
            const csv = arrayToCSV(filtered, Object.keys(filtered[0] || {}));
            downloadCSV('rsvps.csv', csv);
          }}
          aria-label="Export RSVPs as CSV"
        >Export CSV</button>
        {selected.length > 0 && (
          <button
            className="bg-red-600 text-white rounded px-3 py-1 text-sm"
            onClick={async () => {
              // Delete selected RSVPs from Supabase
              for (const idx of selected) {
                const rsvp = filtered[idx];
                if (rsvp && rsvp.id) {
                  await supabase.from('event_registrations').delete().eq('id', rsvp.id);
                }
              }
              // Refresh list
              const { data } = await supabase.from('event_registrations').select('*').order('registered_at', { ascending: false });
              setRsvps(data || []);
              setSelected([]);
            }}
            aria-label="Delete selected RSVPs"
          >Delete Selected</button>
        )}
      </div>
      {/* Loading Spinner */}
      {rsvps.length === 0 && (
        <div className="flex justify-center py-12" aria-live="polite">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-iwc-blue" role="status">
            <span className="sr-only">Loading RSVPs...</span>
          </div>
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border" tabIndex={0} aria-label="RSVPs Table Wrapper">
        <table className="w-full text-left border-t" aria-label="RSVPs Table" role="table">
          <thead>
            <tr>
              <th scope="col"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={e => setSelected(e.target.checked ? filtered.map((_, i) => i) : [])} aria-label="Select all RSVPs" /></th>
              {Object.keys(filtered[0] || {}).map(key => <th key={key} scope="col">{key}</th>)}
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && rsvps.length > 0 ? (
              <tr>
                <td colSpan={Object.keys(filtered[0] || {}).length + 2} className="text-center py-8" aria-live="polite">
                  <span className="sr-only">No RSVPs found.</span>
                  <span>No RSVPs found.</span>
                </td>
              </tr>
            ) : filtered
              .slice((page-1)*RSVPS_PER_PAGE, page*RSVPS_PER_PAGE)
              .map((rsvp, i) => (
                <tr key={i} className="border-t hover:bg-gray-100 focus-within:bg-blue-50" tabIndex={0} aria-label={`RSVP row ${i+1}`}> 
                  <td><input type="checkbox" checked={selected.includes(i)} onChange={e => setSelected(e.target.checked ? [...selected, i] : selected.filter(idx => idx !== i))} aria-label={`Select RSVP ${i+1}`} /></td>
                  {Object.values(rsvp).map((val, j) => <td key={j} scope="row">{String(val)}</td>)}
                  <td className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button aria-label="View RSVP" onClick={() => { setModalRSVP(rsvp); setShowModal(true); }} className="text-iwc-blue"><FiEye /></button>
                      </TooltipTrigger>
                      <TooltipContent>View details</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button aria-label="Edit RSVP" onClick={() => handleEditRSVP(i)} className="text-green-700"><FiEdit /></button>
                      </TooltipTrigger>
                      <TooltipContent>Edit</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button aria-label="Delete RSVP" onClick={async () => { if (rsvp.id) { await supabase.from('event_registrations').delete().eq('id', rsvp.id); const { data } = await supabase.from('event_registrations').select('*').order('registered_at', { ascending: false }); setRsvps(data || []); setSelected(selected.filter(idx2 => idx2 !== i)); } }} className="text-red-600"><FiTrash2 /></button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-2">
        <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-2 py-1 border rounded disabled:opacity-50" aria-label="Previous page">Prev</button>
        <span aria-live="polite">Page {page}</span>
        <button onClick={() => setPage(p => p+1)}
          disabled={page * RSVPS_PER_PAGE >= filtered.length}
          className="px-2 py-1 border rounded disabled:opacity-50" aria-label="Next page">Next</button>
      </div>
      {/* RSVP Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-label="RSVP Details Modal" tabIndex={-1} onKeyDown={e => { if (e.key === 'Escape') setShowModal(false); }}>
          <div className="bg-white rounded shadow-lg p-6 min-w-[300px] max-w-[90vw]" tabIndex={0}>
            <h3 className="font-bold text-lg mb-2">RSVP Details</h3>
            {modalRSVP && Object.entries(modalRSVP).map(([k, v]) => (
              <div key={k}><b>{k}:</b> {String(v)}</div>
            ))}
            <button className="mt-4 bg-iwc-blue text-white rounded px-4 py-2" onClick={() => setShowModal(false)} autoFocus>Close</button>
          </div>
        </div>
      )}
      {/* RSVP Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent role="dialog" aria-modal="true" aria-label="Edit RSVP Modal" tabIndex={-1} onKeyDown={e => { if (e.key === 'Escape') setShowEditModal(false); }}>
          <DialogHeader>
            <DialogTitle>Edit RSVP</DialogTitle>
          </DialogHeader>
          {editRSVP && (
            <form onSubmit={e => { e.preventDefault(); handleSaveEditRSVP(); }} className="space-y-2">
              {Object.entries(editRSVP).map(([k, v]) => (
                <div key={k}>
                  <label className="block text-sm font-medium text-gray-700" htmlFor={`edit-${k}`}>{k}</label>
                  <input id={`edit-${k}`} className="border rounded p-2 w-full" value={typeof v === 'string' || typeof v === 'number' ? v : ''} onChange={e => setEditRSVP((prev: any) => ({ ...prev, [k]: e.target.value }))} />
                </div>
              ))}
              <DialogFooter>
                <button type="button" className="bg-gray-200 rounded px-4 py-2 mr-2" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="bg-iwc-blue text-white rounded px-4 py-2">Save</button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RSVPAdminTable;

// TODO: Add email notification integration here (e.g., Supabase Functions, SendGrid)
// TODO: When Supabase table 'event_registrations' is available, update/delete in Supabase and fallback to localStorage
