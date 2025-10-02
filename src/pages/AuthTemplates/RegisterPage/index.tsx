import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { registerApi } from "@/services/auth.api";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Home,
  UserCheck,
} from "lucide-react";
import { useState } from "react";

export const registerSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự").max(32, "Tối đa 32 ký tự"),
  phone: z.string().min(8, "Số điện thoại không hợp lệ").max(15, "Số điện thoại không hợp lệ"),
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh không hợp lệ (yyyy-mm-dd)"),
  gender: z.enum(["true", "false"]),
});

export type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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
        role: "USER", 
      }),
    onSuccess: () => {
      navigate("/auth/login", { replace: true });
    },
    onError: (err) => {
      console.error(" Register failed:", err);
    },
  });

  const onSubmit: SubmitHandler<RegisterForm> = (value) => {
    mutation.mutate(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center space-x-2 text-gray-600 hover:text-rose-600 transition-colors group cursor-pointer z-20"
      >
        <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="font-medium">Về trang chủ</span>
      </button>

      {/* Content */}
      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
            <UserCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Tạo tài khoản mới
          </h1>
        </div>

        <Card className="backdrop-blur-lg bg-white/80 border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="pb-6 pt-8 px-8">
            <CardTitle className="text-2xl font-bold text-gray-800 text-center">
              Đăng ký
            </CardTitle>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Họ và tên</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    placeholder="Nguyễn Văn A"
                    className="pl-12 h-12 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-rose-400"
                    {...register("name")}
                  />
                </div>
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="email"
                    placeholder="example@gmail.com"
                    className="pl-12 h-12 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-rose-400"
                    {...register("email")}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Số điện thoại</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="tel"
                    placeholder="0123456789"
                    className="pl-12 h-12 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-rose-400"
                    {...register("phone")}
                  />
                </div>
                {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
              </div>

              {/* Birthday */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Ngày sinh</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="date"
                    className="pl-12 h-12 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-rose-400"
                    {...register("birthday")}
                  />
                </div>
                {errors.birthday && <p className="text-sm text-red-500">{errors.birthday.message}</p>}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Giới tính</label>
                <select
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-rose-400"
                  {...register("gender")}
                >
                  <option value="false">Nữ</option>
                  <option value="true">Nam</option>
                </select>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Mật khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-12 pr-12 h-12 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-rose-400"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full h-12 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl"
              >
                {mutation.isPending ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
              </Button>

              <Button asChild variant="outline" className="w-full h-12 mt-4">
                <Link to="/auth/login">Đã có tài khoản? Đăng nhập</Link>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
