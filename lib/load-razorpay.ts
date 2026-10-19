export interface RazorpayInstance {
  on(event: "payment.failed", handler: (response: { error?: { description?: string } }) => void): void
  open(): void
}

type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayInstance

function razorpayGlobal(): RazorpayConstructor | undefined {
  return (window as unknown as { Razorpay?: RazorpayConstructor }).Razorpay
}

/** Loads Razorpay's checkout.js once in the browser. Resolves false if it cannot load. */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false)
    if (razorpayGlobal()) return resolve(true)
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

/** Opens a Razorpay checkout. Call only after loadRazorpayScript() resolved true. */
export function createRazorpayCheckout(options: Record<string, unknown>): RazorpayInstance {
  const Razorpay = razorpayGlobal()
  if (!Razorpay) throw new Error("Razorpay checkout is not loaded.")
  return new Razorpay(options)
}
