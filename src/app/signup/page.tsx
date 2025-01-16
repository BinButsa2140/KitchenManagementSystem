"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "./../../components/Input/Input";
import Selects from "./../../components/Input/Selects";
import { toast } from "react-toastify";

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
      .regex(new RegExp("^[1-9]"), "only for number"),
    date_of_birth: z.coerce.date(),
  })
  .refine((data) => data.password === data.ConPassword, {
    message: "password doesn't match",
  });

type FormSchemaType = z.infer<typeof FormSchema>;

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    watch,
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
    } catch (error) {
      console.log(error);
    }
  };

  const roles = [
    {
      label: "customer",
      value: "customer",
    },
    {
      label: "chef",
      value: "chef",
    },
  ];

  return (
    <>
      <div className="min-h-screen flex justify-center items-center">
        <div className="shadow-md border-2 p-5 flex flex-col">
          <h1 className="text-3xl font-bold mb-5 text-center">Signup</h1>
          <form className="flex flex-col" 
          onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 space-x-3">
              <Input
                label="firstname"
                name="firstname"
                type="text"
                placeholder="Firstname"
                register={register}
                error={errors?.firstname?.message}
                disable={isSubmitting}
              ></Input>
              <Input
                label="lastname"
                name="lastname"
                type="text"
                placeholder="lastname"
                register={register}
                error={errors?.lastname?.message}
                disable={isSubmitting}
              ></Input>
            </div>
            <div className="grid grid-cols-2 space-x-3">
              <Input
                label="phone number"
                name="phone_number"
                type="string"
                placeholder="phone number"
                register={register}
                error={errors?.phone_number?.message}
                disable={isSubmitting}
              ></Input>
              <Selects
                name="customer_type"
                label="Roles"
                register={register}
                error={errors?.customer_type?.message}
                disable={isSubmitting}
                options={roles}
              />
            </div>
            <Input
              label="date of birth"
              name="date_of_birth"
              type="datetime-local"
              placeholder="date_of_birth"
              register={register}
              error={errors?.date_of_birth?.message}
              disable={isSubmitting}
            ></Input>
            <Input
              label="email"
              name="email"
              type="text"
              placeholder="email"
              register={register}
              error={errors?.email?.message}
              disable={isSubmitting}
            ></Input>
            <Input
              label="password"
              name="password"
              type="password"
              placeholder="password"
              register={register}
              error={errors?.password?.message}
              disable={isSubmitting}
            ></Input>
            <Input
              label="Confirm Password"
              name="ConPassword"
              type="password"
              placeholder="Confirm Password"
              register={register}
              error={errors?.ConPassword?.message}
              disable={isSubmitting}
            ></Input>

            <div className="w-full mt-5 flex justify-center items-center">
              <button
                className="p-3 border border-gray-300 hover:bg-purple-600 hover:text-slate-50
              rounded-md ease-linear transition-all w-1/2
              "
                type="submit"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
