
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { registerApi } from "@/services/auth.api";


export const registerSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự").max(32, "Tối đa 32 ký tự"),
  phone: z.string().min(8, "Số điện thoại không hợp lệ").max(15, "Số điện thoại không hợp lệ"),
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh không hợp lệ (yyyy-mm-dd)"),
  gender: z.enum(["true", "false"]),
  role: z.enum(["ADMIN", "USER"]), 
});

export type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      birthday: "",
      gender: "true",
      role: "USER", 
    },
  });

  const mutation = useMutation({
    mutationFn: (value: RegisterForm) =>
      registerApi({
        name: value.name,
        email: value.email,
        password: value.password,
        phone: value.phone,
        birthday: value.birthday,
        gender: value.gender === "true",
        role: value.role,
      }),
    onSuccess: () => {
      navigate("/auth/login", { replace: true });
    },
    onError: (err) => {
      console.error("❌ Register failed:", err);
    },
  });

const onSubmit: SubmitHandler<RegisterForm> = (value) => {
  mutation.mutate(value);
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <Input placeholder="Full Name" {...register("name")} />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <Input type="email" placeholder="Email" {...register("email")} />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <Input type="tel" placeholder="Phone Number" {...register("phone")} />
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
            </div>

            {/* Birthday */}
            <div>
              <Input type="date" placeholder="Birthday" {...register("birthday")} />
              {errors.birthday && (
                <p className="mt-1 text-sm text-red-500">{errors.birthday.message}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <select
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                {...register("gender")}
              >
                <option value="false">Female</option>
                <option value="true">Male</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <select
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                {...register("role")}
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
              {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>}
            </div>

            {/* Password */}
            <div>
              <Input type="password" placeholder="Password" {...register("password")} />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Actions */}
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating account..." : "Register"}
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link to="/auth/login">Already have an account? Login</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
