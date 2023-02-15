import { Injectable, NotFoundException } from '@nestjs/common';
import { Workbook } from 'exceljs';
import * as path from 'path';

interface Historic {
  id: number;
  date: string;
  location: string;
  checkIn: string;
  checkOut: string;
  attendanceStatus: string;
  checkOutStatus: string;
  userEmail: string;
}

@Injectable()
export class ExcelService {
  async dowloadExcel(data: Historic[]): Promise<string> {
    if (!data) {
      throw new NotFoundException('No data found');
    }
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Attendance');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Check In', key: 'checkIn', width: 20 },
      { header: 'Check Out', key: 'checkOut', width: 20 },
      { header: 'Attendance Status', key: 'attendanceStatus', width: 20 },
      { header: 'Check Out Status', key: 'checkOutStatus', width: 20 },
      { header: 'User Email', key: 'userEmail', width: 20 },
    ];
    for (const item of data) {
      worksheet.addRow({
        ...item,
      });
    }

    const exportPath = path.resolve(__dirname, 'attendance.xlsx');
    await workbook.xlsx.writeFile(exportPath);
    return exportPath;
  }

  async downloadExcelByLocation(
    data: Historic[],
    location: string,
  ): Promise<string> {
    if (!data) {
      throw new NotFoundException('No data found');
    }
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(location);

    worksheet.columns = [
      { header: 'Date', key: 'date', width: 30 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Early', key: 'early', width: 10 },
      { header: 'Late', key: 'late', width: 10 },
      { header: 'Absent', key: 'absent', width: 10 },
    ];

    for (const item of data) {
      worksheet.addRow({
        ...item,
      });
    }

    const exportPath = path.resolve(__dirname, location + '.xlsx');
    await workbook.xlsx.writeFile(exportPath);
    return exportPath;
  }
}
