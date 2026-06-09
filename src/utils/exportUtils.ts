const escapeCSVCell = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  const str = String(value);

  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
};

export const exportToCSV = (data: Record<string, unknown>[], fileName: string) => {
  if (!data || data.length === 0) {
    download(`${fileName}.csv`, new Blob([""], { type: "text/csv;charset=utf-8;" }));

    return;
  }
  const headers = Object.keys(data[0]);
  const lines = [headers.join(",")];

  for (const row of data) {
    lines.push(headers.map((h) => escapeCSVCell(row[h])).join(","));
  }
  download(`${fileName}.csv`, new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" }));
};

export const exportToExcel = exportToCSV;

export const exportToPDF = (data: Record<string, unknown>[], fileName: string) => {
  if (typeof window === "undefined") return;
  window.print();
};

const download = (name: string, blob: Blob) => {
  if (typeof window === "undefined") return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
