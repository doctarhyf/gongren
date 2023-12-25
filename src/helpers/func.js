export function formatFrenchDate(inputDate) {
  // Assuming inputDate is either a JavaScript Date object or a date string
  const date = new Date(inputDate);

  // Format the date using the French locale
  const formattedDate = date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return formattedDate;
}

export const FFD = formatFrenchDate;
