const SelectDate = ({register}) => {
  const today = new Date().toISOString().split('T')[0]
  return (
    <div className="mb-4 sm:mb-6">
    <label htmlFor="date" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
      เลือกวันที่ต้องการจอง
    </label>
    <div className="relative">
      <input
        type="date"
        id="date"
        min={today}
        {...register("booking_time")}
        className="w-full px-2 sm:px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
  </div>
  )
}
export default SelectDate