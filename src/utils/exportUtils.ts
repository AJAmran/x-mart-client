import { utils, writeFile } from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const exportToExcel = (data: any[], fileName: string) => {
  const worksheet = utils.json_to_sheet(data);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Sheet1");
  writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPDF = (data: any[], fileName: string) => {
  const doc = new jsPDF();
  
  // Add title
  doc.text(`${fileName.toUpperCase()} LIST`, 14, 15);
  
  // Prepare data for the table
  const tableData = data.map((item) => [
    item.name,
    item.email,
    item.mobileNumber,
    item.role,
    item.status,
  ]);

  // Add table
  (doc as any).autoTable({
    head: [['Name', 'Email', 'Phone', 'Role', 'Status']],
    body: tableData,
    startY: 20,
  });

  doc.save(`${fileName}.pdf`);
};