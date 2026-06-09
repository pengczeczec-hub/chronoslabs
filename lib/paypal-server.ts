const PAYPAL_API_BASE =
  process.env.PAYPAL_MODE === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim();
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are not configured.");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error(`PayPal auth failed (${response.status}).`);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("PayPal auth response missing access token.");
  }

  return data.access_token;
}

export interface VerifiedPayPalOrder {
  orderId: string;
  status: string;
  amount: string;
  currency: string;
  payerEmail?: string;
  captureId?: string;
}

export async function verifyPayPalOrder(
  orderId: string,
  expectedAmount: string,
): Promise<VerifiedPayPalOrder> {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`PayPal order lookup failed (${response.status}).`);
  }

  const order = (await response.json()) as {
    id?: string;
    status?: string;
    payer?: { email_address?: string };
    purchase_units?: Array<{
      amount?: { value?: string; currency_code?: string };
      payments?: {
        captures?: Array<{ id?: string; status?: string }>;
      };
    }>;
  };

  const status = order.status ?? "UNKNOWN";
  if (status !== "COMPLETED") {
    throw new Error(`PayPal order status is ${status}, expected COMPLETED.`);
  }

  const unit = order.purchase_units?.[0];
  const amount = unit?.amount?.value;
  const currency = unit?.amount?.currency_code ?? "USD";

  if (!amount || amount !== expectedAmount) {
    throw new Error("PayPal order amount does not match the product price.");
  }

  const captureId = unit?.payments?.captures?.[0]?.id;

  return {
    orderId: order.id ?? orderId,
    status,
    amount,
    currency,
    payerEmail: order.payer?.email_address,
    captureId,
  };
}
