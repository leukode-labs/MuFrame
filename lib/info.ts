// Facts that are the shop's to decide. Leave a value as null and the site says "we confirm on WhatsApp".
// Fill them in here and every page that mentions them updates.
export const INFO = {
  makeTime: null as string | null,        // e.g. "5 to 7 days"
  deliveryKigali: null as string | null,  // e.g. "RWF 3,000" or "Free"
  deliveryRwanda: null as string | null,  // e.g. "Quoted by distance"
  damageWindow: null as string | null,    // e.g. "within 48 hours"
  updated: "26 November 2026",
};
export const orAsk = (v: string | null) => v ?? "Confirmed on WhatsApp";
