import { useParams} from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import SelectDate from '../SelectDate/SelectDate';
import { toast } from "react-toastify";

const BookingStatusEnum = z.enum(["active", "inactive", "cancelled"]);

// Define the schema for form validation
const bookingSchema = z.object({ // ทำ Schema ก่อน
  booking_time: z.string().min(1, "Date is required"),
});

type BookingFormData = z.infer<typeof bookingSchema>; //กำหนดฟอร์ม

const getRoom = ()=>{
  const searchParams = useSearchParams();
  const room_id = searchParams.get("room_id");
  return room_id
}

export const BookingForm = ({room_id}) => {
  const {data:session, status} = useSession()//get user
  const customer_id = session?.user.id
  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>({ //นำฟอร์มเข้ามาใช้ โดยที่กำหนดข้อมูลตา่งๆในฟอร์มเป็น BookingFormData
    resolver: zodResolver(bookingSchema),
  });
  const onSubmit: SubmitHandler<BookingFormData> = async (data: BookingFormData) => {
    if(!room_id || !customer_id){
      toast.error('there is no room id or customer id')
    }
    const newdata = {
      customer_id:customer_id,
      room_id:room_id,
      booking_time:data.booking_time
    }
    console.log("Form Data:", newdata);
    const url = `/api/bookroom?customer_id=${customer_id}&room_id=${room_id}&booking_time=${encodeURIComponent(data.booking_time)}`
    try {
      const response = await fetch(url, {
        method:'POST',
      });
      const result = await response.json()
      if (response.ok) {
        toast.success("Booking successful!");
        // Handle further logic, e.g., clear form or navigate to another page
      } else {
        toast.error(result.error || "Error booking room");
      }

    } catch (error) {
      console.log(error)
    }
    
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gray-100/50 p-4 sm:p-0 w-full">
      <form onSubmit={handleSubmit(onSubmit)} 
      className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-xs sm:max-w-md"
      >
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">เลือกวันจองห้อง</h3>
        <SelectDate register={register}/>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 sm:py-3 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors font-semibold mt-4 sm:mt-6"
        >
          ยืนยันการจอง
        </button>
      </form>
    </div>
  );
};

export default BookingForm;