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
  ArrowRight, 
  Home,
  UserCheck,
  Users
} from "lucide-react";
import { useState } from "react";

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
      console.error(" Register failed:", err);
    },
  });

  const onSubmit: SubmitHandler<RegisterForm> = (value) => {
    mutation.mutate(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-rose-200 to-pink-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-red-200 to-rose-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-pink-200 to-red-200 rounded-full opacity-10 blur-2xl"></div>
      </div>

      {/* Back to Home Button */}
      <Link 
        to="/"
        className="absolute top-6 left-6 flex items-center space-x-2 text-gray-600 hover:text-rose-600 transition-colors group"
      >
        <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="font-medium">Về trang chủ</span>
      </Link>

      <div className="w-full max-w-lg relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
            <UserCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Tạo tài khoản mới
          </h1>
          <p className="text-gray-600">Tham gia cộng đồng của chúng tôi ngay hôm nay</p>
        </div>

        {/* Register Card */}
        <Card className="backdrop-blur-lg bg-white/80 border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="pb-6 pt-8 px-8">
            <CardTitle className="text-2xl font-bold text-gray-800 text-center">
              Đăng ký
            </CardTitle>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Họ và tên</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input 
                    placeholder="Nguyễn Văn A"
                    className="pl-12 h-12 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-rose-400 bg-white/70 backdrop-blur-sm transition-all duration-200"
                    {...register("name")} 
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center space-x-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    <span>{errors.name.message}</span>
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input 
                    type="email" 
                    placeholder="example@gmail.com"
                    className="pl-12 h-12 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-rose-400 bg-white/70 backdrop-blur-sm transition-all duration-200"
                    {...register("email")} 
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center space-x-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    <span>{errors.email.message}</span>
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Số điện thoại</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input 
                    type="tel" 
                    placeholder="0123456789"
                    className="pl-12 h-12 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-rose-400 bg-white/70 backdrop-blur-sm transition-all duration-200"
                    {...register("phone")} 
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-500 flex items-center space-x-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    <span>{errors.phone.message}</span>
                  </p>
                )}
              </div>

              {/* Birthday Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Ngày sinh</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input 
                    type="date" 
                    className="pl-12 h-12 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-rose-400 bg-white/70 backdrop-blur-sm transition-all duration-200"
                    {...register("birthday")} 
                  />
                </div>
                {errors.birthday && (
                  <p className="text-sm text-red-500 flex items-center space-x-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    <span>{errors.birthday.message}</span>
                  </p>
                )}
              </div>

              {/* Gender and Role Fields */}
              <div className="grid grid-cols-2 gap-4">
                {/* Gender */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Giới tính</label>
                  <div className="relative">
                    <select
                      className="w-full h-12 pl-4 pr-10 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-rose-400 bg-white/70 backdrop-blur-sm transition-all duration-200 appearance-none text-gray-700"
                      {...register("gender")}
                    >
                      <option value="false">Nữ</option>
                      <option value="true">Nam</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.gender && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      <span>{errors.gender.message}</span>
                    </p>
                  )}
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Vai trò</label>
                  <div className="relative">
                    <select
                      className="w-full h-12 pl-4 pr-10 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-rose-400 bg-white/70 backdrop-blur-sm transition-all duration-200 appearance-none text-gray-700"
                      {...register("role")}
                    >
                      <option value="USER">Người dùng</option>
                      <option value="ADMIN">Quản trị viên</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.role && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      <span>{errors.role.message}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Mật khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-12 pr-12 h-12 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:ring-rose-400 bg-white/70 backdrop-blur-sm transition-all duration-200"
                    {...register("password")} 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center space-x-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    <span>{errors.password.message}</span>
                  </p>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-3 py-2">
                <input type="checkbox" className="w-4 h-4 text-rose-600 border-2 border-gray-300 rounded focus:ring-rose-500 mt-1" />
                <p className="text-sm text-gray-600 leading-relaxed">
                  Tôi đồng ý với{" "}
                  <a href="#" className="text-rose-600 hover:text-rose-700 font-medium">
                    Điều khoản dịch vụ
                  </a>{" "}
                  và{" "}
                  <a href="#" className="text-rose-600 hover:text-rose-700 font-medium">
                    Chính sách bảo mật
                  </a>
                </p>
              </div>

              {/* Register Button */}
              <Button 
                type="submit" 
                disabled={mutation.isPending}
                className="w-full h-12 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {mutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang tạo tài khoản...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Tạo tài khoản</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/80 text-gray-500 font-medium">Hoặc</span>
                </div>
              </div>

              {/* Login Button */}
              <Button 
                asChild 
                variant="outline" 
                className="w-full h-12 border-2 border-gray-200 hover:border-rose-300 hover:bg-rose-50 text-gray-700 font-semibold rounded-xl transition-all duration-200 bg-white/70 backdrop-blur-sm"
              >
                <Link to="/auth/login" className="flex items-center justify-center space-x-2">
                  <span>Đã có tài khoản? Đăng nhập</span>
                </Link>
              </Button>
            </form>

            {/* Social Register */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">Hoặc đăng ký bằng</p>
                <div className="flex space-x-4 justify-center">
                  <button className="flex items-center justify-center w-12 h-12 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group">
                    <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </button>
                  <button className="flex items-center justify-center w-12 h-12 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </button>
                  <button className="flex items-center justify-center w-12 h-12 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-800 hover:bg-gray-50 transition-all duration-200">
                    <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.163-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.751-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.029 12.017.001z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Message */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Bằng cách tạo tài khoản, bạn sẽ nhận được những ưu đãi và thông báo mới nhất từ chúng tôi
          </p>
        </div>
      </div>
    </div>
  );
}