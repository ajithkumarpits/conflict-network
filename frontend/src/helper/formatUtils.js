export const getAgreementText =(row) =>{
  if (!row.agreement) {
    return "no agreement";
  } else {
    if (row.peace_agreement) {
      return "peace agreement";
    } else {
      return "ceasefire";
    }
  }
}



export const getDateString = (year, month, day, precision_date) => {
  if (!year) return '----';

  if (precision_date === 1) {
    // Full date (day, month, year known)
    const paddedDay = String(day || 1).padStart(2, '0');
    const paddedMonth = String(month || 1).padStart(2, '0');
    return `${paddedDay}/${paddedMonth}/${year}`;
  }

  if (precision_date === 2) {
    // Only month and year known
    const paddedMonth = String(month || 1).padStart(2, '0');
    return `${paddedMonth}/${year}`;
  }

  if (precision_date === 3) {
    // Only year known
    return `${year}`;
  }
  return '----';
};


export const getSortableDate = (row, type) => {
  const year = type === 'start' ? row.start_year : row.end_year;
  const month = type === 'start' ? row.start_month : row.end_month;
  const day = type === 'start' ? row.start_day : row.end_day;
  const precision_date = row.precision_date;

  if (!year) return new Date(0);

  if (precision_date === 1) {
    return new Date(year, (month || 1) - 1, day || 1);
  } else if (precision_date === 2) {
    return new Date(year, (month || 1) - 1, 1);
  } else if (precision_date === 3) {
    return new Date(year, 0, 1);
  }
  return new Date(0);
};


export const createDateSortType = (type) => (rowA, rowB) => {
  const a = rowA.original;
  const b = rowB.original;

  const dateA = getSortableDate(a, type);
  const dateB = getSortableDate(b, type);

  return dateA - dateB;
};