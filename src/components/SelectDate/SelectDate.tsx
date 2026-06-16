import React from 'react';
import { UseFormRegister } from 'react-hook-form';

interface SelectDateProps {
  register: UseFormRegister<any>;
}

const SelectDate: React.FC<SelectDateProps> = ({ register }) => {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4 mb-4 sm:mb-6">
      <div>
        <label htmlFor="date" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          เลือกวันที่ต้องการจอง
        </label>
        <input
          type="date"
          id="date"
          min={today}
          {...register("booking_date")}
          className="w-full px-2 sm:px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_time" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            เวลาเริ่มต้น
          </label>
          <input
            type="time"
            id="start_time"
            {...register("start_time")}
            className="w-full px-2 sm:px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label htmlFor="end_time" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            เวลาสิ้นสุด
          </label>
          <input
            type="time"
            id="end_time"
            {...register("end_time")}
            className="w-full px-2 sm:px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>
    </div>
  );
};

export default SelectDate;