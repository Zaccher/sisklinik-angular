import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}
  generateExcel(header: string[], data: any[], fileName: string): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    // Add headers
    const headersFromData = Object.keys(data[0]);
    worksheet.addRow(header);
    // Add data
    data.forEach((item) => {
      const row : any[] = [];
      headersFromData.forEach((header) => {
        row.push(item[header]);
      });
      worksheet.addRow(row);
    });
    // Save the workbook to a blob
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${fileName}.xlsx`);
    });
  }
}
