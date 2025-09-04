import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type RegisterForm = {
  name: string;
  email: string;
  phone: string;
  birthday: string; 
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const { register, handleSubmit, watch } = useForm<RegisterForm>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      birthday: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: RegisterForm) => {
  
    console.log("Register values:", values);
    if (values.password !== values.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    alert("Form captured! (hook this to your API next)");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Register
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Input placeholder="Full Name" autoComplete="name" {...register("name")} />
            </div>

            <div className="space-y-2">
              <Input type="email" placeholder="Email" autoComplete="email" {...register("email")} />
            </div>

            <div className="space-y-2">
              <Input type="tel" placeholder="Phone Number" autoComplete="tel" {...register("phone")} />
            </div>

            <div className="space-y-2">
              <Input type="date" placeholder="Birthday" {...register("birthday")} />
            </div>

            <div className="space-y-2">
              <Input type="password" placeholder="Password" autoComplete="new-password" {...register("password")} />
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Confirm Password"
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
            </div>

            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
