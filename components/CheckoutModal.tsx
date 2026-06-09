"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
  type ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";

export interface CheckoutProduct {
  name: string;
  price: string;
}

export interface ShippingDetails {
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

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: CheckoutProduct;
}

const EMPTY_SHIPPING: ShippingDetails = {
  fullName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  countryCode: "US",
};

const COUNTRIES = [
  { code: "US", label: "United States" },
  { code: "CA", label: "Canada" },
  { code: "GB", label: "United Kingdom" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "AU", label: "Australia" },
  { code: "TW", label: "Taiwan" },
  { code: "JP", label: "Japan" },
  { code: "SG", label: "Singapore" },
  { code: "NL", label: "Netherlands" },
  { code: "IT", label: "Italy" },
  { code: "ES", label: "Spain" },
] as const;

function isShippingValid(shipping: ShippingDetails): boolean {
  return (
    shipping.fullName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email.trim()) &&
    shipping.phone.trim().length >= 8 &&
    shipping.addressLine1.trim().length >= 3 &&
    shipping.city.trim().length >= 2 &&
    shipping.state.trim().length >= 1 &&
    shipping.postalCode.trim().length >= 3 &&
    shipping.countryCode.length === 2
  );
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { given_name: parts[0], surname: parts[0] };
  }
  return {
    given_name: parts[0],
    surname: parts.slice(1).join(" "),
  };
}

const inputClass =
  "w-full rounded-lg border border-neutral-800 bg-[#111] px-3 py-2.5 text-sm text-pearl placeholder:text-neutral-600 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30";

function ShippingForm({
  shipping,
  onChange,
}: {
  shipping: ShippingDetails;
  onChange: (next: ShippingDetails) => void;
}) {
  const set = (field: keyof ShippingDetails, value: string) => {
    onChange({ ...shipping, [field]: value });
  };

  return (
    <div className="space-y-3 text-left">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
        Shipping Details
      </p>

      <div>
        <label className="mb-1 block text-xs text-muted">Recipient Name *</label>
        <input
          type="text"
          autoComplete="name"
          className={inputClass}
          placeholder="Full name"
          value={shipping.fullName}
          onChange={(e) => set("fullName", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-muted">Email *</label>
          <input
            type="email"
            autoComplete="email"
            className={inputClass}
            placeholder="you@email.com"
            value={shipping.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Phone *</label>
          <input
            type="tel"
            autoComplete="tel"
            className={inputClass}
            placeholder="+1 555 000 0000"
            value={shipping.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-muted">Address Line 1 *</label>
        <input
          type="text"
          autoComplete="address-line1"
          className={inputClass}
          placeholder="Street address"
          value={shipping.addressLine1}
          onChange={(e) => set("addressLine1", e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-muted">Address Line 2</label>
        <input
          type="text"
          autoComplete="address-line2"
          className={inputClass}
          placeholder="Apt, suite, unit (optional)"
          value={shipping.addressLine2}
          onChange={(e) => set("addressLine2", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-muted">City *</label>
          <input
            type="text"
            autoComplete="address-level2"
            className={inputClass}
            value={shipping.city}
            onChange={(e) => set("city", e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">State / Province *</label>
          <input
            type="text"
            autoComplete="address-level1"
            className={inputClass}
            value={shipping.state}
            onChange={(e) => set("state", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-muted">Postal Code *</label>
          <input
            type="text"
            autoComplete="postal-code"
            className={inputClass}
            value={shipping.postalCode}
            onChange={(e) => set("postalCode", e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Country *</label>
          <select
            className={inputClass}
            autoComplete="country"
            value={shipping.countryCode}
            onChange={(e) => set("countryCode", e.target.value)}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function PayPalLoadError() {
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-5 text-left">
      <p className="text-sm font-semibold text-red-300">PayPal 無法載入</p>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        請至{" "}
        <a
          href="https://developer.paypal.com/dashboard/applications/sandbox"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-2"
        >
          PayPal Developer
        </a>{" "}
        複製有效的 Sandbox Client ID 到 <code className="text-pearl">.env.local</code> 後重啟 dev server。
      </p>
    </div>
  );
}

function buildPayPalOrderPayload(product: CheckoutProduct, shipping: ShippingDetails) {
  return {
    intent: "CAPTURE" as const,
    application_context: {
      shipping_preference: "SET_PROVIDED_ADDRESS" as const,
      user_action: "PAY_NOW" as const,
    },
    payer: {
      email_address: shipping.email.trim(),
      name: splitName(shipping.fullName),
    },
    purchase_units: [
      {
        description: product.name,
        amount: {
          currency_code: "USD",
          value: product.price,
        },
        shipping: {
          name: { full_name: shipping.fullName.trim() },
          address: {
            address_line_1: shipping.addressLine1.trim(),
            ...(shipping.addressLine2.trim()
              ? { address_line_2: shipping.addressLine2.trim() }
              : {}),
            admin_area_2: shipping.city.trim(),
            admin_area_1: shipping.state.trim(),
            postal_code: shipping.postalCode.trim(),
            country_code: shipping.countryCode,
          },
        },
      },
    ],
  };
}

function PayPalButtonsInner({
  product,
  shipping,
  shippingReady,
  onSuccess,
}: {
  product: CheckoutProduct;
  shipping: ShippingDetails;
  shippingReady: boolean;
  onSuccess: () => void;
}) {
  const [{ isResolved, isPending, isRejected }] = usePayPalScriptReducer();
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  if (isRejected) {
    return <PayPalLoadError />;
  }

  if (isPending || !isResolved) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-neutral-800 bg-[#111] py-8">
        <div className="flex items-center gap-3 text-sm text-muted">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-600 border-t-accent" />
          Loading PayPal…
        </div>
      </div>
    );
  }

  if (!shippingReady) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-[#111] px-4 py-6 text-center">
        <p className="text-sm text-muted">
          Complete all required shipping fields above to unlock PayPal checkout.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {isCapturing && (
        <div className="flex items-center justify-center gap-3 rounded-xl border border-accent/30 bg-accent/5 py-4 text-sm text-pearl">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-600 border-t-accent" />
          正在確認付款，請稍候…
        </div>
      )}

      {paymentError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-left">
          <p className="text-sm font-semibold text-red-300">付款未完成</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">{paymentError}</p>
        </div>
      )}

      <div className="overflow-hidden rounded-xl">
        <PayPalButtons
          key={`${product.name}-${product.price}-${shipping.postalCode}-${shipping.email}`}
          disabled={isCapturing}
          style={{
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
            height: 48,
          }}
          createOrder={async (_data, actions) => {
            setPaymentError(null);
            try {
              return await actions.order.create(buildPayPalOrderPayload(product, shipping));
            } catch (err) {
              console.error("[paypal createOrder]", err);
              setPaymentError(
                "無法建立訂單。請確認地址格式正確（美國地址請填州別縮寫如 CA、NY），或改用 PayPal 帳號付款。",
              );
              throw err;
            }
          }}
          onApprove={async (data, actions) => {
            setPaymentError(null);
            setIsCapturing(true);
            try {
              const result = await actions.order?.capture();
              const status = result?.status;
              if (status === "COMPLETED") {
                console.info("[paypal] Payment completed", data.orderID);
                try {
                  await fetch("/api/order-notify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      orderId: data.orderID,
                      product,
                      shipping,
                    }),
                  });
                } catch (notifyErr) {
                  console.error("[order-notify]", notifyErr);
                }
                onSuccess();
                return;
              }
              setPaymentError(
                `付款狀態異常（${status ?? "unknown"}）。請至 PayPal Sandbox 商家後台 Activity 確認是否扣款成功。`,
              );
            } catch (err) {
              console.error("[paypal capture]", err);
              setPaymentError(
                "付款確認失敗。若 PayPal 視窗已顯示成功，請到 Sandbox 商家帳號的 Activity 查看；否則請換測試卡或改用 PayPal 帳號重試。",
              );
            } finally {
              setIsCapturing(false);
            }
          }}
          onCancel={() => {
            setPaymentError("已取消付款。可重新點擊 PayPal 或刷卡按鈕再試一次。");
          }}
          onError={(err) => {
            console.error("[paypal]", err);
            setPaymentError(
              "PayPal 發生錯誤。Sandbox 測試請用官方測試卡 4032030000000000，或登入 Sandbox 個人帳號付款。",
            );
          }}
        />
      </div>
    </div>
  );
}

function PayPalSection({
  product,
  shipping,
  shippingReady,
  onSuccess,
}: {
  product: CheckoutProduct;
  shipping: ShippingDetails;
  shippingReady: boolean;
  onSuccess: () => void;
}) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim();

  if (!clientId) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-[#111] px-4 py-6 text-center">
        <p className="text-sm text-muted">
          PayPal not configured. Set{" "}
          <code className="text-accent">NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> in{" "}
          <code className="text-accent">.env.local</code>.
        </p>
      </div>
    );
  }

  const paypalOptions: ReactPayPalScriptOptions = {
    clientId,
    currency: "USD",
    intent: "capture",
    components: "buttons",
    enableFunding: "card",
  };

  return (
    <PayPalScriptProvider options={paypalOptions} deferLoading={false}>
      <PayPalButtonsInner
        product={product}
        shipping={shipping}
        shippingReady={shippingReady}
        onSuccess={onSuccess}
      />
    </PayPalScriptProvider>
  );
}

export default function CheckoutModal({
  isOpen,
  onClose,
  product,
}: CheckoutModalProps) {
  const router = useRouter();
  const [shipping, setShipping] = useState<ShippingDetails>(EMPTY_SHIPPING);
  const shippingReady = isShippingValid(shipping);

  const handlePayPalSuccess = useCallback(() => {
    onClose();
    router.push("/success");
  }, [onClose, router]);

  useEffect(() => {
    if (!isOpen) {
      setShipping(EMPTY_SHIPPING);
      return;
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={onClose}
              aria-hidden
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="checkout-title"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-[#0a0a0a] shadow-2xl shadow-black/60"
            >
              <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-64 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

              <div className="relative overflow-y-auto p-6 sm:p-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-neutral-800 hover:text-pearl"
                  aria-label="Close checkout"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="mb-6 text-center">
                  <p className="mb-2 text-xs font-medium tracking-[0.25em] text-accent uppercase">
                    Secure Checkout
                  </p>
                  <h2
                    id="checkout-title"
                    className="text-xl font-black tracking-tight text-pearl sm:text-2xl"
                  >
                    Complete Your Pre-Order
                  </h2>
                  <p className="mt-2 text-sm text-muted">{product.name}</p>
                  <p className="mt-1 text-2xl font-bold text-pearl">
                    ${product.price}{" "}
                    <span className="text-sm font-normal text-muted">USD</span>
                  </p>
                </div>

                <ShippingForm shipping={shipping} onChange={setShipping} />

                <div className="mt-6">
                  <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                    Payment
                  </p>
                  {isOpen && (
                    <PayPalSection
                      product={product}
                      shipping={shipping}
                      shippingReady={shippingReady}
                      onSuccess={handlePayPalSuccess}
                    />
                  )}
                </div>

                <p className="mt-6 text-center text-[11px] leading-relaxed text-muted">
                  256-bit SSL encryption · 30-day risk-free guarantee · Free
                  worldwide priority shipping
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
