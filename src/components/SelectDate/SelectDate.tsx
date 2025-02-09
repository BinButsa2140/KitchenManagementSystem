const SelectDate = ({register}) => {
  const today = new Date().toISOString().split('T')[0]
  return (
    <div className="mb-6">
    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
      Date
    </label>
    <div className="relative">
      <input
        type="date"
        id="date"
        min={today}
        {...register("booking_time")}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
  )
}
export default SelectDate