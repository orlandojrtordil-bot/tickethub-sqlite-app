// Philippine Peso (₱) currency formatting — the single source of truth for
// every price rendered in the app.
//
// Rules (matching the peso design spec):
//   whole numbers        -> no decimals   ₱640
//   fractional amounts   -> 2 decimals    ₱82.50, ₱607.50
//   explicit `decimals`  -> wins as-is    ₱540.00 (price breakdowns)
//   sign stays left of the symbol         -₱15.00
//
// Prefer this over string literals (`$${price}`) so a currency change never
// has to be chased down across screens again.

export const PESO = "₱";

export function formatPeso(value, decimals) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return decimals === 0 ? `${PESO}0` : `${PESO}0.00`;
  }

  const places =
    decimals === undefined || decimals === null
      ? Number.isInteger(amount)
        ? 0
        : 2
      : decimals;

  const sign = amount < 0 ? "-" : "";
  return `${sign}${PESO}${Math.abs(amount).toFixed(places)}`;
}

export default formatPeso;
