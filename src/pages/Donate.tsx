import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Youtube } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const mpesaPaybill = '247247';
const mpesaAccount = '200470';
const equityAccount = '1234567890';
const equityName = 'Immanuel Worship Centre';
const bankName = 'Equity Bank';
const bankBranch = 'Nairobi West';
const swiftCode = 'EQBLKENA';
const montageUrl = 'https://www.youtube.com/embed/1V_xRb0x9aw';

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

const Donate = () => {
  const [form, setForm] = useState({ name: '', org: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleThanksSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const { error: dbError } = await (supabase as any).from('donor_thank_yous').insert([
        { name: form.name, org: form.org, message: form.message, submitted_at: new Date().toISOString() }
      ]);
      if (dbError) throw dbError;
      setForm({ name: '', org: '', message: '' });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err: any) {
      setError('Submission failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-iwc-blue/10 via-white/80 to-iwc-orange/10 py-10 px-4 flex flex-col items-center">
      <div className="max-w-3xl w-full mx-auto space-y-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-iwc-blue drop-shadow mb-4">Support Our Mission</h1>
        <p className="text-lg md:text-xl text-center text-gray-700 mb-8">Your generosity empowers us to serve, inspire, and transform lives. Every gift makes a difference!</p>
        {/* Payment Methods */}
        <section className="bg-white/90 rounded-2xl shadow-xl p-8 space-y-6 border border-iwc-blue/10">
          <h2 className="text-2xl font-bold mb-4 text-iwc-blue">Ways to Give</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Mpesa Paybill:</span>
                <span className="font-mono text-lg">{mpesaPaybill}</span>
                <button onClick={() => copyToClipboard(mpesaPaybill)} className="ml-2 text-iwc-blue underline">Copy</button>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Mpesa Account Number:</span>
                <span className="font-mono text-lg">{mpesaAccount}</span>
                <button onClick={() => copyToClipboard(mpesaAccount)} className="ml-2 text-iwc-blue underline">Copy</button>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Online (Card):</span>
                <a href="https://donate.stripe.com/test_00g7uQ0wQ0wQ0wQ0wQ" target="_blank" rel="noopener noreferrer" className="ml-2 text-iwc-blue underline">Donate via Stripe</a>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Bank Name:</span>
                <span className="font-mono text-lg">{bankName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Branch:</span>
                <span className="font-mono text-lg">{bankBranch}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Account Name:</span>
                <span className="font-mono text-lg">{equityName}</span>
                <button onClick={() => copyToClipboard(equityName)} className="ml-2 text-iwc-blue underline">Copy</button>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Account Number:</span>
                <span className="font-mono text-lg">{equityAccount}</span>
                <button onClick={() => copyToClipboard(equityAccount)} className="ml-2 text-iwc-blue underline">Copy</button>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">SWIFT Code:</span>
                <span className="font-mono text-lg">{swiftCode}</span>
                <button onClick={() => copyToClipboard(swiftCode)} className="ml-2 text-iwc-blue underline">Copy</button>
              </div>
            </div>
          </div>
        </section>

        {/* Sponsor Button & Dialog */}
        <section className="flex justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full text-lg shadow transition-colors focus:outline-none">
                <Youtube className="w-7 h-7 mr-2" /> Sponsor Our Children
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl w-full">
              <div className="aspect-w-16 aspect-h-9 w-full">
                <iframe
                  src={montageUrl}
                  title="Sponsor Our Children Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-80 rounded"
                />
              </div>
            </DialogContent>
          </Dialog>
        </section>

        {/* Thank You Form (Admin Only) */}
        <section className="bg-white/90 rounded-2xl shadow-xl p-8 border border-iwc-blue/10">
          <h2 className="text-2xl font-bold mb-4 text-iwc-blue">Send a Thank You (Visible to Admin Only)</h2>
          <form onSubmit={handleThanksSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name (optional)"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="text"
              name="org"
              placeholder="Organization (optional)"
              value={form.org}
              onChange={e => setForm({ ...form, org: e.target.value })}
              className="w-full px-4 py-2 border rounded"
            />
            <textarea
              name="message"
              placeholder="Message (optional)"
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-2 border rounded min-h-[80px]"
            />
            <button
              type="submit"
              className="bg-iwc-orange hover:bg-iwc-red text-white font-bold px-6 py-2 rounded-md w-full"
              disabled={submitted}
            >
              {submitted ? 'Thank You Sent!' : 'Send Thank You'}
            </button>
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          </form>
          <div className="mt-6 text-sm text-gray-500 text-center">Your message will only be visible to the admin for privacy and security.</div>
        </section>
      </div>
    </div>
  );
};

export default Donate;
