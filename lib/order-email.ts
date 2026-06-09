import { Resend } from "resend";

export interface OrderEmailProduct {
  name: string;
  price: string;
}

export interface OrderEmailShipping {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
}

export interface OrderEmailPayload {
  product: OrderEmailProduct;
  shipping: OrderEmailShipping;
  orderId: string;
  captureId?: string;
  payerEmail?: string;
}

const COUNTRY_LABELS: Record<string, string> = {
  US: "United States",
  CA: "Canada",
  GB: "United Kingdom",
  DE: "Germany",
  FR: "France",
  AU: "Australia",
  TW: "Taiwan",
  JP: "Japan",
  SG: "Singapore",
  NL: "Netherlands",
  IT: "Italy",
  ES: "Spain",
};

function formatAddress(shipping: OrderEmailShipping): string {
  const country = COUNTRY_LABELS[shipping.countryCode] ?? shipping.countryCode;
  const lines = [
    shipping.fullName,
    shipping.addressLine1,
    shipping.addressLine2 || null,
    `${shipping.city}, ${shipping.state} ${shipping.postalCode}`,
    country,
    `Phone: ${shipping.phone}`,
    `Email: ${shipping.email}`,
  ].filter(Boolean);

  return lines.join("\n");
}

function buildMerchantEmailHtml(payload: OrderEmailPayload): string {
  const { product, shipping, orderId, captureId, payerEmail } = payload;
  const address = formatAddress(shipping).replace(/\n/g, "<br>");

  return `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; color: #111;">
      <h2 style="margin: 0 0 16px;">新訂單通知 — Chronos Labs</h2>
      <p style="margin: 0 0 20px; color: #444;">有一筆 PayPal 付款已完成，請安排出貨。</p>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr><td style="padding: 8px 0; color: #666;">產品</td><td style="padding: 8px 0;"><strong>${product.name}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #666;">金額</td><td style="padding: 8px 0;"><strong>$${product.price} USD</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #666;">PayPal 訂單</td><td style="padding: 8px 0;">${orderId}</td></tr>
        ${captureId ? `<tr><td style="padding: 8px 0; color: #666;">Capture ID</td><td style="padding: 8px 0;">${captureId}</td></tr>` : ""}
        ${payerEmail ? `<tr><td style="padding: 8px 0; color: #666;">PayPal 帳號</td><td style="padding: 8px 0;">${payerEmail}</td></tr>` : ""}
      </table>
      <h3 style="margin: 0 0 8px;">收件資訊</h3>
      <p style="margin: 0 0 20px; line-height: 1.6;">${address}</p>
      <p style="margin: 0; font-size: 12px; color: #888;">此信由 Chronos Labs 結帳系統自動發送。</p>
    </div>
  `;
}

function buildCustomerEmailHtml(payload: OrderEmailPayload): string {
  const { product, shipping, orderId } = payload;

  return `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; color: #111;">
      <h2 style="margin: 0 0 16px;">Thank you for your pre-order!</h2>
      <p style="margin: 0 0 16px; color: #444;">
        Hi ${shipping.fullName}, we've received your payment. Your order is being processed.
      </p>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr><td style="padding: 8px 0; color: #666;">Product</td><td style="padding: 8px 0;"><strong>${product.name}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Amount</td><td style="padding: 8px 0;"><strong>$${product.price} USD</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Order ID</td><td style="padding: 8px 0;">${orderId}</td></tr>
      </table>
      <p style="margin: 0 0 8px; color: #444;">
        We'll ship to the address you provided. Questions? Reply to this email.
      </p>
      <p style="margin: 16px 0 0; font-size: 12px; color: #888;">Chronos Labs · CYBER_GLOW</p>
    </div>
  `;
}

export async function sendOrderEmails(payload: OrderEmailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const merchantEmail = process.env.ORDER_NOTIFICATION_EMAIL?.trim();
  const fromEmail =
    process.env.RESEND_FROM_EMAIL?.trim() ?? "Chronos Labs <onboarding@resend.dev>";

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }
  if (!merchantEmail) {
    throw new Error("ORDER_NOTIFICATION_EMAIL is not configured.");
  }

  const resend = new Resend(apiKey);

  const merchantResult = await resend.emails.send({
    from: fromEmail,
    to: merchantEmail,
    subject: `[Chronos Labs] 新訂單 — ${payload.product.name} — $${payload.product.price}`,
    html: buildMerchantEmailHtml(payload),
  });

  if (merchantResult.error) {
    throw new Error(merchantResult.error.message);
  }

  const customerEmail = payload.shipping.email.trim();
  if (customerEmail && customerEmail !== merchantEmail) {
    const customerResult = await resend.emails.send({
      from: fromEmail,
      to: customerEmail,
      subject: `Your Chronos Labs order — ${payload.product.name}`,
      html: buildCustomerEmailHtml(payload),
    });

    if (customerResult.error) {
      console.error("[order-email] Customer confirmation failed:", customerResult.error.message);
    }
  }
}
