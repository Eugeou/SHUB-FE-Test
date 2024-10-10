"use client";

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import Image from 'next/image';
import { Button, DatePicker } from 'antd';

import dayjs, { Dayjs } from 'dayjs';

// Schema validation sử dụng Yup
const schema = yup.object().shape({
  date: yup.date().required('Vui lòng chọn thời gian'),
  quantity: yup
    .number()
    .typeError('Số lượng phải là một số')
    .positive('Số lượng phải lớn hơn 0')
    .required('Vui lòng nhập số lượng'),
  pump: yup.string().required('Vui lòng chọn trụ'),
  revenue: yup
    .number()
    .typeError('Doanh thu phải là một số')
    .positive('Doanh thu phải lớn hơn 0')
    .required('Vui lòng nhập doanh thu'),
  unitPrice: yup
    .number()
    .typeError('Đơn giá phải là một số')
    .positive('Đơn giá phải lớn hơn 0')
    .required('Vui lòng nhập đơn giá'),
});

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log('Dữ liệu giao dịch:', data);
    alert('Giao dịch đã được cập nhật thành công!');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className=" max-w-sm w-3/4 mx-auto mt-10 rounded-md">
        <div className='flex justify-between shadow-lg p-2 mb-8'>
            <div className='flex flex-col w-2/3 h-auto'>
                <div className='flex items-center mb-4 w-10'>
                    <Image src='/arrow.png' alt="left arrow" width={10} height={10} />
                    <h3 className='text-sm font-semibold ml-2'>Đóng</h3>
                </div>
                
                <h1 className="text-2xl font-semibold mb-4">Nhập giao dịch</h1>

            </div>

            <Button
                type='primary'
                className="bg-blue-500 text-white text-sm p-4 rounded-md hover:bg-blue-600"
                onClick={handleSubmit(onSubmit)}
                >
                Cập nhật
            </Button>
            
        </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Thời gian */}
        <div className='border border-gray-300 rounded-md p-2'>
          <label className="block text-sm font-semibold text-gray-400 ml-2">Thời gian</label>
          <DatePicker
            showTime
            value={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setValue('date', date?.toDate() || new Date()); // Set giá trị cho react-hook-form
            }}
            format="YYYY/MM/DD HH:mm:ss"
            className="w-full p-2"
            required
            bordered={false}
          />
          {errors.date && <p className="text-red-500 text-sm ml-2">{errors.date.message}</p>}
        </div>

        {/* Số lượng */}
        <div className='border border-gray-300 rounded-md p-2'>
          <label className="block text-sm font-semibold text-gray-400 ml-2">Số lượng</label>
          <input
            type="number"
            {...register('quantity')}
            className="w-full rounded-md p-2 focus:border-none"
            min={0}
            
          />
          {errors.quantity && <p className="text-red-500 text-sm ml-2">{errors.quantity.message}</p>}
        </div>

        {/* Trụ */}
        <div className='border border-gray-300 rounded-md p-2'>
          <label className="block text-sm font-semibold text-gray-400 ml-2">Trụ</label>
          <select {...register('pump')} className="w-full rounded-md p-2 transition ease-in-out duration-300 focus:border-none">
            <option className='text-gray-300' value="">Chọn trụ</option>
            <option value="Trụ 1">Trụ 1</option>
            <option value="Trụ 2">Trụ 2</option>
            <option value="Trụ 3">Trụ 3</option>
          </select>
          {errors.pump && <p className="text-red-500 text-sm ml-2">{errors.pump.message}</p>}
        </div>

        {/* Doanh thu */}
        <div className='border border-gray-300 rounded-md p-2'>
          <label className="block text-sm font-semibold text-gray-400 ml-2">Doanh thu</label>
          <input
            type="number"
            {...register('revenue')}
            className="w-full rounded-md p-2"
            min={0}
          />
          {errors.revenue && <p className="text-red-500 text-sm ml-2">{errors.revenue.message}</p>}
        </div>

        {/* Đơn giá */}
        <div className='border border-gray-300 rounded-md p-2'>
          <label className="block text-sm font-semibold text-gray-400 ml-2">Đơn giá</label>
          <input
            type="number"
            {...register('unitPrice')}
            className="w-full rounded-md p-2"
            min={0}
          />
          {errors.unitPrice && <p className="text-red-500 text-sm ml-2">{errors.unitPrice.message}</p>}
        </div>

      </form>
    </div>
    </main>
  );
}
