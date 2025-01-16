"use client";

import Input from "@/components/Input/Input";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";

const FormSchema = z.object({
  //create zod for validation inputs
  email: z
    .string()
    .email("invalid email address")
    .min(2, "first name must be more than 2 ")
    .max(50, "50 is too much "),
  //.regex(new RegExp("^[a-zA-Z]+$"), "no special character"),
  password: z.string(),
  
});
type FormSchemaType = z.infer<typeof FormSchema>; // type for form

const LoginPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
    
    console.log("Submitted values:", values);
    const res: any = await signIn("credentials", {
      redirect:false,
      email: values.email,
      password: values.password,
    });
    if (res?.error) {
      return toast.error(res.error)
    } else {
      return router.push('/profile')
    }
    
  };
  return (
    <div className="min-h-screen  bg-gray-100 flex items-center justify-center">
      <form
        className="flex flex-col space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="email"
          type="email"
          name="email"
          placeholder="enter email please"
          register={register}
          error={errors?.email?.message}
          disable={isSubmitting}
        ></Input>
        <Input
          label="password"
          type="password"
          name="password"
          placeholder="please enter password"
          register={register}
          error={errors?.password?.message}
          disable={isSubmitting}
        ></Input>
        <button type="submit" className="border-2 active:bg-slate-700">
          submit
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
