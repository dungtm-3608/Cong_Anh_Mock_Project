import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import AuthShell from "../../components/auth/AuthShell";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { signIn } from "../../services/auth";
import { useAuthStore } from "../../store/authStore";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useDocumentTitle("Đăng nhập");

  const onSubmit = handleSubmit(async (values) => {
    try {
      setSubmitting(true);
      const user = await signIn(values);
      setUser(user);
      toast.success("Đăng nhập thành công.");
      navigate("/", { replace: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể đăng nhập.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <AuthShell
      title="Đăng nhập"
      crumb="Đăng nhập"
      switchLabel="Đăng ký"
      switchTo="/dang-ky"
    >
      <section className="border border-(--color-border-soft) bg-white px-6 py-8 shadow-[0_10px_30px_rgba(17,17,17,0.03)] sm:px-8 md:px-12">
        <div className="max-w-4xl">
          <h2
            className="text-3xl uppercase tracking-[0.14em]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Khách hàng đăng nhập
          </h2>
          <p className="mt-3 text-sm text-(--color-muted)">
            Vui lòng nhập thông tin tài khoản để tiếp tục.
          </p>

          <form onSubmit={onSubmit} className="mt-10 space-y-6">
            <div className="grid gap-5">
              <Input
                label="Email *"
                type="email"
                placeholder="Nhập email của bạn"
                error={errors.email?.message}
                labelClassName="text-[11px] tracking-[0.18em] text-(--color-muted)"
                inputClassName="h-11 border-(--color-border-soft) px-4 text-sm focus:border-black"
                {...register("email", {
                  required: "Vui lòng nhập email.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email không hợp lệ.",
                  },
                })}
              />
              <Input
                label="Password *"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                labelClassName="text-[11px] tracking-[0.18em] text-(--color-muted)"
                inputClassName="h-11 border-(--color-border-soft) px-4 text-sm focus:border-black"
                {...register("password", {
                  required: "Vui lòng nhập mật khẩu.",
                  minLength: {
                    value: 6,
                    message: "Mật khẩu tối thiểu 6 ký tự.",
                  },
                })}
              />
            </div>

            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <Button
                variant="dark"
                size="sm"
                type="submit"
                loading={submitting}
                className="px-5 py-3 text-[11px] tracking-[0.24em]"
              >
                Đăng nhập
              </Button>
            </div>

            <p className="text-sm text-(--color-muted)">
              Chưa có tài khoản?{" "}
              <Link
                to="/dang-ky"
                className="text-black underline underline-offset-4"
              >
                Đăng ký ngay
              </Link>
            </p>
          </form>
        </div>
      </section>
    </AuthShell>
  );
}
