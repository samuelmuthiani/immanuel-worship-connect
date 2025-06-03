// src/utils/sendEmail.ts
// Utility to send transactional emails using Resend API
// Replace RESEND_API_KEY with your actual API key or use environment variables in production

const RESEND_API_KEY = "YOUR_RESEND_API_KEY"; // TODO: Replace with your real key or use env
const FROM_EMAIL = "no-reply@yourchurch.org"; // Update to your verified sender

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject,
      html
    })
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }
  return response.json();
}
