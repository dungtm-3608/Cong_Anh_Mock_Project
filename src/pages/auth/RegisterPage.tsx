import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import AuthShell from "../../components/auth/AuthShell";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { signUp } from "../../services/auth";
import { useAuthStore } from "../../store/authStore";

interface RegisterFormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useAuthStore((state) => state.setUser);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = useWatch({ control, name: "password" }) ?? "";

  useDocumentTitle("Đăng ký");

  const redirectTo =
    typeof location.state === "object" &&
    location.state !== null &&
    "from" in location.state &&
    typeof location.state.from === "string"
      ? location.state.from
      : "/";
  const redirectState = redirectTo === "/" ? undefined : { from: redirectTo };

  const onSubmit = handleSubmit(async (values) => {
    try {
      setSubmitting(true);
      const user = await signUp({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });
      setUser(user);
      toast.success("Đăng ký thành công. Tài khoản đã sẵn sàng để sử dụng.");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể đăng ký tài khoản.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <AuthShell
      title="Đăng ký"
      crumb="Đăng ký"
      switchLabel="Đăng nhập"
      switchTo="/dang-nhap"
      switchState={redirectState}
    >
      <section className="border border-border-soft bg-white px-6 py-8 shadow-[0_10px_30px_rgba(17,17,17,0.03)] sm:px-8 md:px-12">
        <form onSubmit={onSubmit} className="max-w-4xl">
          <div>
            <h2
              className="text-3xl uppercase tracking-[0.14em]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Tạo tài khoản
            </h2>
            <div className="mt-8 grid gap-5">
              <Input
                label="Họ và tên *"
                placeholder="Nguyễn Văn A"
                error={errors.name?.message}
                labelClassName="text-[11px] tracking-[0.18em] text-(--color-muted)"
                inputClassName="h-11 border-(--color-border-soft) px-4 text-sm focus:border-black"
                {...register("name", {
                  required: "Vui lòng nhập họ tên.",
                  minLength: {
                    value: 2,
                    message: "Họ tên tối thiểu 2 ký tự.",
                  },
                })}
              />
              <Input
                label="Email *"
                type="email"
                placeholder="email@example.com"
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
                label="Số điện thoại"
                placeholder="0909..."
                error={errors.phone?.message}
                labelClassName="text-[11px] tracking-[0.18em] text-(--color-muted)"
                inputClassName="h-11 border-(--color-border-soft) px-4 text-sm focus:border-black"
                {...register("phone", {
                  pattern: {
                    value: /^(0|\+84)\d{9,10}$/,
                    message: "Số điện thoại không hợp lệ.",
                  },
                })}
              />
              <Input
                label="Password *"
                type="password"
                placeholder="Tối thiểu 8 ký tự"
                error={errors.password?.message}
                labelClassName="text-[11px] tracking-[0.18em] text-(--color-muted)"
                inputClassName="h-11 border-(--color-border-soft) px-4 text-sm focus:border-black"
                {...register("password", {
                  required: "Vui lòng nhập mật khẩu.",
                  pattern: {
                    value: passwordPattern,
                    message:
                      "Mật khẩu cần ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số.",
                  },
                })}
              />
              <Input
                label="Xác nhận mật khẩu *"
                type="password"
                placeholder="Nhập lại mật khẩu"
                error={errors.confirmPassword?.message}
                labelClassName="text-[11px] tracking-[0.18em] text-(--color-muted)"
                inputClassName="h-11 border-(--color-border-soft) px-4 text-sm focus:border-black"
                {...register("confirmPassword", {
                  required: "Vui lòng xác nhận mật khẩu.",
                  validate: (value) =>
                    value === password || "Mật khẩu xác nhận không khớp.",
                })}
              />
            </div>
          </div>

          <p className="mt-5 text-sm text-muted">
            Điền đầy đủ thông tin để tạo tài khoản mới.
          </p>

          <div className="mt-8 flex flex-wrap justify-end gap-3">
            <Button
              variant="dark"
              size="sm"
              type="submit"
              loading={submitting}
              className="px-5 py-3 text-[11px] tracking-[0.24em]"
            >
              Tạo tài khoản
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="reset"
              className="border-black px-5 py-3 text-[11px] tracking-[0.24em] text-black hover:bg-black hover:text-white"
            >
              Làm mới
            </Button>
          </div>
        </form>
      </section>
    </AuthShell>
  );
}
