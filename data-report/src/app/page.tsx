"use client";

import { useState } from "react";
import { Button, DatePicker } from "antd";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

export default function Home() {
  const [fileData, setFileData] = useState<any[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);


  const handleFileUpload = (file: any) => {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      setFileData(jsonData);

      console.log(jsonData);
    };
    reader.readAsArrayBuffer(file);
    return false; // Để không upload trực tiếp
  };

  // Xử lý chọn thời gian
  const onDateChange: RangePickerProps["onChange"] = (dates) => {
    if (dates) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    }
  };

  
  const handleQuery = () => {
    if (!startDate || !endDate || !fileData.length) return;

    const start = startDate.format("DD/MM/YYYY HH:mm:ss");
    const end = endDate.format("DD/MM/YYYY HH:mm:ss");

    const filteredData = fileData.filter((row: any) => {

      if (!row["Ngày"] || !row["Giờ"]) {
        console.warn("Dữ liệu không đầy đủ cho hàng này:", row);
        return false; 
      }

        const dateTimeString = `${row["Ngày"]?.trim()} ${row["Giờ"]?.trim()}`;
        const dateTime = dayjs(dateTimeString, "DD/MM/YYYY HH:mm:ss");

       
        console.log("Ngày giờ:", dateTimeString, "=>", dateTime.format());

        
        if (!dateTime.isValid()) {
            console.warn(`Ngày giờ không hợp lệ: ${dateTimeString}`);
            return false;
        }

        return dateTime.isBetween(start, end, null, "[]");
    });

    const totalAmount = filteredData.reduce(
        (acc: number, row: any) => acc + (parseFloat(row["Thành tiền (VNĐ)"]) || 0),
        0
    );

    setTotal(totalAmount);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10">
      <div className="flex flex-col items-center justify-center border border-gray-400 rounded-lg p-4 shadow-lg">
      <h1 className="text-xl font-bold mb-5 text-blue-600">Báo cáo giao dịch - Cửa hàng xăng dầu</h1>

      <div className="mb-5">
        <Upload beforeUpload={handleFileUpload} maxCount={1}>
          <Button icon={<UploadOutlined />}>Tải lên báo cáo</Button>
        </Upload>
      </div>

      <div className="mb-5">
        <DatePicker.RangePicker
          showTime={{ format: "HH:mm" }}
          format="DD/MM/YYYY HH:mm:ss"
          onChange={onDateChange}
        />
      </div>

      <div className="mb-5">
        <Button type="primary" onClick={handleQuery} disabled={!fileData.length}>
          Truy vấn
        </Button>
      </div>

      {total !== null && (
        <div className="mt-5">
          <h2 className="text-xl font-semibold text-blue-600">Tổng thành tiền: {total.toLocaleString()} VNĐ</h2>
        </div>
      )}

      </div>
    </div>
  );
}
