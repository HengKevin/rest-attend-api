import { Injectable, NotFoundException } from '@nestjs/common';
import { Workbook } from 'exceljs';
import * as path from 'path';

interface Historic {
  id: number;
  date: string;
  level: string;
  checkIn: string;
  checkOut: string;
  attendanceStatus: string;
  checkOutStatus: string;
  userId: number;
  name: string;
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
      { header: 'Level', key: 'level', width: 20 },
      { header: 'Check In', key: 'checkIn', width: 20 },
      { header: 'Check Out', key: 'checkOut', width: 20 },
      { header: 'Attendance Status', key: 'attendanceStatus', width: 20 },
      { header: 'Check Out Status', key: 'checkOutStatus', width: 20 },
      { header: 'ID', key: 'userId', width: 20 },
      { header: 'Name', key: 'name', width: 20 },
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
    level: string,
  ): Promise<string> {
    if (!data) {
      throw new NotFoundException('No data found');
    }
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(level);

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

    const exportPath = path.resolve(__dirname, level + '.xlsx');
    await workbook.xlsx.writeFile(exportPath);
    return exportPath;
  }
}
