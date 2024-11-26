export const getDefaultBillingDate = (creditCardBillDay: number): Date => {
  const date = new Date();
  date.setDate(creditCardBillDay);
  date.setMonth(date.getMonth() + 1);

  return date;
};

export const parseBillingDate = (
  billingDate: Date,
  creditCardBillDay: number,
): Date => {
  const date = new Date(billingDate);
  date.setDate(creditCardBillDay);

  return date;
};
