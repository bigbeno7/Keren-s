const ils = new Intl.NumberFormat("he-IL", {
  style: "currency",
  currency: "ILS",
  maximumFractionDigits: 0,
});

/** "‏18,900 ₪" — Hebrew locale formatting, shekel sign after the number. */
export const formatPrice = (n: number) => ils.format(n);

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
