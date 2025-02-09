import { useForm, SubmitHandler } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "./../../components/Input/Input";
import Selects from "./../../components/Input/Selects";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const FormSchema = z
  .object({
    firstname: z
      .string()
      .min(1, "name must be more than 1")
      .max(100, "max character for name is 100 ")
      .regex(new RegExp("^[a-zA-Z]+$"), "no special character"),
    lastname: z
      .string()
      .min(1, "name must be more than 1")
      .max(100, "max character for name is 100 ")
      .regex(new RegExp("^[a-zA-Z]+$"), "no special character"),
    email: z.string().email("invalid email address"),
    password: z.string().min(8, "ต้องมีมากกว่า 8").max(32, "มีมากสุดแค่ 32"),
    ConPassword: z.string(),
    customer_type: z.string(),
    phone_number: z
      .string()
      .min(4, "must be more than 4")
      .max(16, "bro are you serious?")
      .regex(new RegExp("^[0-9]"), "only for number"),
    date_of_birth: z.coerce.date(),
  })
  .refine((data) => data.password === data.ConPassword, {
    message: "password doesn't match",
  });

const registerForm = () => {
    const route = useRouter()
      const {
        register,
        handleSubmit,
    
        formState: { errors, isSubmitting },
      } = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema),
      });
    
      const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
        try {
          const datetimeLocal = values.date_of_birth;
          
          const localDate = new Date(datetimeLocal);
        
          const utcDatetime = localDate.toISOString();
          
          
          console.log("submitted", utcDatetime)
          toast.success("sign up success")
          console.log(values);
          route.push('/')
        } catch (error) {
          console.log(error);
        }
      };
  return (
    <div>registerForm</div>
  )
}
export default registerForm