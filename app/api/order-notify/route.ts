import { NextResponse } from "next/server";
import { sendOrderEmails, type OrderEmailPayload } from "@/lib/order-email";
import { verifyPayPalOrder } from "@/lib/paypal-server";

function isValidPayload(body: unknown): body is OrderEmailPayload {
  if (!body || typeof body !== "object") return false;

  const { orderId, product, shipping } = body as Record<string, unknown>;

  if (typeof orderId !== "string" || !orderId.trim()) return false;
  if (!product || typeof product !== "object") return false;
  if (!shipping || typeof shipping !== "object") return false;

  const p = product as Record<string, unknown>;
  const s = shipping as Record<string, unknown>;

  return (
    typeof p.name === "string" &&
    typeof p.price === "string" &&
    typeof s.fullName === "string" &&
    typeof s.email === "string" &&
    typeof s.phone === "string" &&
    typeof s.addressLine1 === "string" &&
    typeof s.city === "string" &&
    typeof s.state === "string" &&
    typeof s.postalCode === "string" &&
    typeof s.countryCode === "string"
  );
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!isValidPayload(body)) {
      return NextResponse.json({ error: "Invalid order payload." }, { status: 400 });
    }

    const verified = await verifyPayPalOrder(body.orderId, body.product.price);

    await sendOrderEmails({
      ...body,
      captureId: verified.captureId,
      payerEmail: verified.payerEmail,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Order notification failed.";
    console.error("[order-notify]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
