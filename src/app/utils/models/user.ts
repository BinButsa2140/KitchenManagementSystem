export type User = {
  user_id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  user_type: "customer" | "chef" | "employee";
  is_admin: boolean;
  user_status: "active" | "inactive";
  gender?: "male" | "female" | "other";
  department_id?: number;
  created_at: string;
  edited_at: string;
};