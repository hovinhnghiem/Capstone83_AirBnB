import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginApi } from "@/services/auth.api";
import { useAuthStore } from "@/store/auth.slice";
import { useNavigate , Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

const schema = z.object({
  email: z.string().email("Email không hợp lệ").nonempty("Email không được để trống"),
  password: z
    .string()
    .min(6, "Mật khẩu ít nhất 6 ký tự")
    .max(32, "Tối đa 32 ký tự")
    .nonempty("Mật khẩu không được để trống"),
});

type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: LoginForm) => loginApi(values),
    onSuccess: (data: any) => {
      if (data) {
        setUser(data);
        navigate(data.role === "ADMIN" ? "/admin/dashboard" : "/", { replace: true });
      }
    },
    onError: (err) => {
      console.error("❌ Login failed:", err);
    },
  });

  const onSubmit = (values: LoginForm) => mutation.mutate(values);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input type="email" placeholder="Email" {...register("email")} />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Input type="password" placeholder="Password" {...register("password")} />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? "Logging in..." : "Login"}
            </Button>
        
            <Button asChild variant="outline" className="w-full">
              <Link to="/auth/register">Create an account</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
