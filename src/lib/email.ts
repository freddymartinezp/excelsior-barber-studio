const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  barberName: string;
  barberSlug: string;
  barberEmail?: string;
  serviceName: string;
  date: string;
  time: string;
  bookingId: number;
}

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function formatDateDisplay(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

// ─── Customer confirmation email ──────────────────────────────────────────────

function customerEmailHtml(data: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#080A0F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080A0F;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#0D1117;border:1px solid #1E2535;">

        <!-- Header -->
        <tr><td style="padding:32px 32px 24px;border-bottom:1px solid #1E2535;">
          <p style="margin:0;font-size:20px;font-weight:700;letter-spacing:0.15em;color:#ffffff;">EXCELSIOR BARBER STUDIO</p>
          <p style="margin:4px 0 0;font-size:10px;letter-spacing:0.3em;color:#C41E3A;text-transform:uppercase;">Appointment Confirmed</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:28px 32px;">
          <p style="margin:0 0 20px;font-size:15px;color:#C0BDB8;">Hey ${data.customerName},</p>
          <p style="margin:0 0 28px;font-size:15px;color:#8A8680;line-height:1.6;">Your appointment is confirmed. We&apos;ll see you soon.</p>

          <!-- Details box -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1E2535;margin-bottom:28px;">
            ${[
              ["Barber", data.barberName],
              ["Service", data.serviceName],
              ["Date", formatDateDisplay(data.date)],
              ["Time", formatTime(data.time)],
              ["Booking #", `#${data.bookingId}`],
            ].map(([label, value], i, arr) => `
            <tr>
              <td style="padding:12px 16px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#5A5654;width:35%;${i < arr.length - 1 ? "border-bottom:1px solid #1E2535;" : ""}">${label}</td>
              <td style="padding:12px 16px;font-size:13px;color:#ffffff;font-weight:500;${i < arr.length - 1 ? "border-bottom:1px solid #1E2535;" : ""}">${value}</td>
            </tr>`).join("")}
          </table>

          <p style="margin:0 0 8px;font-size:12px;color:#5A5654;">1155 S Havana St Unit 33, Aurora, CO 80012</p>
          <p style="margin:0;font-size:12px;color:#5A5654;">(720) 397-7510</p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 32px;border-top:1px solid #1E2535;">
          <p style="margin:0;font-size:11px;color:#3A3A4A;">© ${new Date().getFullYear()} Excelsior Barber Shop. Built for the culture.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Barber notification email ─────────────────────────────────────────────────

function barberEmailHtml(data: BookingEmailData): string {
  const scheduleUrl = `${SITE_URL}/barber/${data.barberSlug}`;
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#080A0F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080A0F;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#0D1117;border:1px solid #1E2535;">

        <!-- Header -->
        <tr><td style="padding:32px 32px 24px;border-bottom:1px solid #1E2535;">
          <p style="margin:0;font-size:20px;font-weight:700;letter-spacing:0.15em;color:#ffffff;">EXCELSIOR BARBER STUDIO</p>
          <p style="margin:4px 0 0;font-size:10px;letter-spacing:0.3em;color:#C41E3A;text-transform:uppercase;">New Booking — ${data.barberName}</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:28px 32px;">
          <p style="margin:0 0 24px;font-size:15px;color:#C0BDB8;">You have a new appointment, ${data.barberName.split(" ")[0]}.</p>

          <!-- Details -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1E2535;margin-bottom:28px;">
            ${[
              ["Customer", data.customerName],
              ["Service", data.serviceName],
              ["Date", formatDateDisplay(data.date)],
              ["Time", formatTime(data.time)],
            ].map(([label, value], i, arr) => `
            <tr>
              <td style="padding:12px 16px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#5A5654;width:35%;${i < arr.length - 1 ? "border-bottom:1px solid #1E2535;" : ""}">${label}</td>
              <td style="padding:12px 16px;font-size:13px;color:#ffffff;font-weight:500;${i < arr.length - 1 ? "border-bottom:1px solid #1E2535;" : ""}">${value}</td>
            </tr>`).join("")}
          </table>

          <!-- CTA Button -->
          <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr><td style="background:#C41E3A;">
              <a href="${scheduleUrl}" style="display:inline-block;padding:14px 32px;font-size:13px;font-weight:600;letter-spacing:0.08em;color:#ffffff;text-decoration:none;text-transform:uppercase;">
                View My Schedule →
              </a>
            </td></tr>
          </table>

          <p style="margin:20px 0 0;font-size:11px;color:#3A3A4A;text-align:center;">Or go to: ${scheduleUrl}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Main export ───────────────────────────────────────────────────────────────

export async function sendConfirmationEmail(data: BookingEmailData): Promise<void> {
  const scheduleUrl = `${SITE_URL}/barber/${data.barberSlug}`;

  // MVP: log to console. Replace with Resend below when ready.
  console.log("\n📧 [CUSTOMER EMAIL]");
  console.log(`To: ${data.customerEmail}`);
  console.log(`Subject: Your Excelsior Barber Shop Appointment is Confirmed`);
  console.log(`Barber: ${data.barberName} | Service: ${data.serviceName} | ${data.date} @ ${formatTime(data.time)}`);

  if (data.barberEmail) {
    console.log("\n📧 [BARBER EMAIL]");
    console.log(`To: ${data.barberEmail}`);
    console.log(`Subject: New Booking — ${data.customerName} — ${formatTime(data.time)}`);
    console.log(`Schedule link: ${scheduleUrl}`);
  }

  /* ── Uncomment to enable Resend ──────────────────────────────────────────
  import { Resend } from "resend";
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "bookings@yourdomain.com",
    to: data.customerEmail,
    subject: `Your Excelsior Barber Shop Appointment is Confirmed — ${formatDateDisplay(data.date)}`,
    html: customerEmailHtml(data),
  });

  if (data.barberEmail) {
    await resend.emails.send({
      from: "bookings@yourdomain.com",
      to: data.barberEmail,
      subject: `New Booking: ${data.customerName} — ${formatTime(data.time)} on ${formatDateDisplay(data.date)}`,
      html: barberEmailHtml(data),
    });
  }
  ──────────────────────────────────────────────────────────────────────── */

  void customerEmailHtml(data);
  void barberEmailHtml(data);
}
