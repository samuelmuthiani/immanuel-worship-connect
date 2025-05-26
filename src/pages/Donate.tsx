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

const copyToClipboard = (text: string, setCopied: (v: string) => void) => {
  navigator.clipboard.writeText(text);
  setCopied(text);
  setTimeout(() => setCopied(''), 2000);
};

const Donate = () => {
  const [form, setForm] = useState({ name: '', org: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState('');

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
    <>
      <main className="min-h-screen bg-gradient-to-t from-iwc-blue/10 via-white/80 to-iwc-orange/10 py-10 px-4 flex flex-col items-center">
        <div className="max-w-5xl w-full mx-auto space-y-8">
          <header className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-iwc-blue drop-shadow mb-2">Support Our Mission</h1>
            <p className="text-lg md:text-xl text-gray-700">Your generosity empowers us to serve, inspire, and transform lives. Every gift makes a difference!</p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left Panel: Donation Methods */}
            <section aria-labelledby="donation-methods" className="space-y-6">
              <h2 id="donation-methods" className="text-2xl font-bold text-iwc-blue mb-2">Ways to Give</h2>
              {/* Mpesa Card */}
              <div className="bg-white rounded-xl shadow-lg border border-iwc-blue/10 p-6 space-y-4 transition hover:scale-[1.02] hover:shadow-xl">
                <h3 className="text-lg font-semibold text-green-700 flex items-center">M-Pesa Paybill</h3>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Paybill Number:</span>
                  <span className="font-mono text-lg" aria-label="Mpesa Paybill">{mpesaPaybill}</span>
                  <button
                    className={`ml-2 px-2 py-1 rounded text-xs font-semibold border border-green-600 text-green-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition ${copied === mpesaPaybill ? 'bg-green-100' : ''}`}
                    onClick={() => copyToClipboard(mpesaPaybill, setCopied)}
                    aria-label="Copy Paybill Number"
                  >
                    {copied === mpesaPaybill ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Account Number:</span>
                  <span className="font-mono text-lg" aria-label="Mpesa Account">{mpesaAccount}</span>
                  <button
                    className={`ml-2 px-2 py-1 rounded text-xs font-semibold border border-green-600 text-green-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition ${copied === mpesaAccount ? 'bg-green-100' : ''}`}
                    onClick={() => copyToClipboard(mpesaAccount, setCopied)}
                    aria-label="Copy Account Number"
                  >
                    {copied === mpesaAccount ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              {/* Bank Card */}
              <div className="bg-white rounded-xl shadow-lg border border-iwc-blue/10 p-6 space-y-4 transition hover:scale-[1.02] hover:shadow-xl">
                <h3 className="text-lg font-semibold text-blue-700 flex items-center">Bank Transfer</h3>
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
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Account Number:</span>
                  <span className="font-mono text-lg" aria-label="Bank Account">{equityAccount}</span>
                  <button
                    className={`ml-2 px-2 py-1 rounded text-xs font-semibold border border-blue-600 text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${copied === equityAccount ? 'bg-blue-100' : ''}`}
                    onClick={() => copyToClipboard(equityAccount, setCopied)}
                    aria-label="Copy Bank Account Number"
                  >
                    {copied === equityAccount ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">SWIFT Code:</span>
                  <span className="font-mono text-lg" aria-label="SWIFT Code">{swiftCode}</span>
                  <button
                    className={`ml-2 px-2 py-1 rounded text-xs font-semibold border border-blue-600 text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${copied === swiftCode ? 'bg-blue-100' : ''}`}
                    onClick={() => copyToClipboard(swiftCode, setCopied)}
                    aria-label="Copy SWIFT Code"
                  >
                    {copied === swiftCode ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              {/* Card/Online Option */}
              <div className="bg-white rounded-xl shadow-lg border border-iwc-blue/10 p-6 space-y-4 transition hover:scale-[1.02] hover:shadow-xl">
                <h3 className="text-lg font-semibold text-purple-700 flex items-center">Online (Card)</h3>
                <a
                  href="https://donate.stripe.com/test_00g7uQ0wQ0wQ0wQ0wQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
                  aria-label="Donate via Stripe"
                >
                  Donate via Stripe
                </a>
              </div>
            </section>

            {/* Right Panel: Thank You Form (Admin Only) */}
            <section aria-labelledby="thank-you-form" className="bg-white rounded-xl shadow-lg border border-iwc-blue/10 p-6 flex flex-col space-y-4 animate-fade-in">
              <h2 id="thank-you-form" className="text-2xl font-bold text-iwc-blue mb-2">Send a Thank You (Admin Only)</h2>
              <form onSubmit={handleThanksSubmit} className="space-y-3" aria-label="Thank You Form">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name (optional)</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-iwc-blue"
                  autoComplete="off"
                />
                <label htmlFor="org" className="block text-sm font-medium text-gray-700">Organization (optional)</label>
                <input
                  id="org"
                  type="text"
                  name="org"
                  value={form.org}
                  onChange={e => setForm({ ...form, org: e.target.value })}
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-iwc-blue"
                  autoComplete="off"
                />
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message (optional)</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2 border rounded min-h-[80px] focus:ring-2 focus:ring-iwc-blue"
                />
                <button
                  type="submit"
                  className="bg-iwc-orange hover:bg-iwc-red text-white font-bold px-6 py-2 rounded-md w-full transition-colors focus:outline-none focus:ring-2 focus:ring-iwc-orange"
                  disabled={submitted}
                >
                  {submitted ? 'Thank You Sent!' : 'Send Thank You'}
                </button>
                <div aria-live="polite" className="h-6">
                  {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
                  {submitted && !error && <div className="text-green-600 text-sm mt-1">Thank you for your message!</div>}
                </div>
              </form>
              <div className="mt-2 text-xs text-gray-500 text-center">Your message will only be visible to the admin for privacy and security.</div>
            </section>
          </div>
          {/* Sponsor Our Children - CTA below contact form */}
          <section className="flex justify-center mt-10">
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 hover:from-red-700 hover:to-yellow-500 text-white font-extrabold py-4 px-8 rounded-2xl text-2xl shadow-xl transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 border-4 border-white" aria-label="Sponsor Our Children">
                  <Youtube className="w-8 h-8 mr-3" aria-label="YouTube" /> Sponsor Our Children
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
        </div>
      </main>
    </>
  );
};

export default Donate;
