"use client";

import { Button, Checkbox, Input, cn } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  LuArrowRight,
  LuCircleAlert,
  LuCircleHelp,
  LuEye,
  LuEyeOff,
  LuLock,
  LuMail,
} from "react-icons/lu";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    mode: "onTouched",
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setSubmitError(null);
    try {
      // TODO: replace with real call to POST /api/auth/login
      await new Promise((r) => setTimeout(r, 700));
      if (data.password === "fail") {
        throw new Error("Invalid email or password.");
      }
      router.push("/admin");
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Sign in failed. Please try again.",
      );
    }
  };

  const emailReg = register("email", {
    required: "Email address is required",
    pattern: {
      value: EMAIL_PATTERN,
      message: "Please enter a valid email address",
    },
  });

  const passwordReg = register("password", {
    required: "Password is required",
    minLength: { value: 6, message: "Must be at least 6 characters" },
  });

  return (
    <div className="flex min-h-screen">
      <AuthBrandPanel />

      <section className="relative flex w-full items-center justify-center overflow-hidden bg-background p-4 lg:w-1/2 lg:bg-surface lg:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 lg:hidden"
        >
          <div className="aurora-blob-1 absolute -right-32 -top-32 h-[360px] w-[360px] rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-3xl" />
          <div className="aurora-blob-2 absolute -bottom-32 -left-24 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-gold/15 to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-[440px]">
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[#040e3d] text-white shadow-lg">
              <Image
                src="/images/ra-logo.png"
                alt="RA logo"
                width={22}
                height={22}
                className="rounded-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              Royal Ambassadors
            </h1>
            <h3 className="text-xl font-bold tracking-tight text-primary">
              Pentecost Baptist Association
            </h3>
          </div>

          <div className="rounded-2xl border border-text-dark/[0.05] bg-surface p-6 shadow-[0_1px_2px_rgba(27,36,82,0.04),0_8px_24px_rgba(27,36,82,0.06)] sm:p-8">
            <header className="mb-6 sm:mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                Welcome Back
              </h2>
              <p className="mt-1.5 text-sm text-text-muted">
                Access the Institutional Administration Portal.
              </p>
            </header>

            {submitError && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2 rounded-lg border border-rose-200/60 bg-rose-50 px-3 py-2.5 text-sm text-rose-700"
              >
                <LuCircleAlert size={16} className="mt-0.5 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              <Input
                {...emailReg}
                type="email"
                label="Email Address"
                labelPlacement="outside"
                placeholder="admin@pba.org"
                variant="bordered"
                radius="md"
                size="lg"
                autoComplete="email"
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
                startContent={<LuMail size={16} className="text-text-muted" />}
                classNames={inputCx}
              />

              <Input
                {...passwordReg}
                type={showPassword ? "text" : "password"}
                label={
                  <div className="flex w-full items-center justify-between gap-2">
                    <span>Password</span>
                    <Link
                      href="/forgot-password"
                      className="text-[11px] font-semibold text-primary transition-colors hover:text-gold"
                    >
                      Forgot password?
                    </Link>
                  </div>
                }
                labelPlacement="outside"
                placeholder="••••••••"
                variant="bordered"
                radius="md"
                size="lg"
                autoComplete="current-password"
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
                startContent={<LuLock size={16} className="text-text-muted" />}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-text-muted transition-colors hover:text-text-dark focus:outline-none focus-visible:text-text-dark"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <LuEyeOff size={16} />
                    ) : (
                      <LuEye size={16} />
                    )}
                  </button>
                }
                classNames={inputCx}
              />

              <Checkbox
                {...register("remember")}
                size="sm"
                radius="sm"
                color="warning"
                classNames={{
                  label: "text-sm text-text-muted",
                }}
              >
                Remember this device
              </Checkbox>

              <Button
                type="submit"
                radius="md"
                size="lg"
                isLoading={isSubmitting}
                endContent={
                  !isSubmitting ? <LuArrowRight size={18} /> : undefined
                }
                className={cn(
                  "group w-full bg-primary py-3 text-base font-semibold text-white shadow-md transition-all",
                  "hover:bg-[#040e3d] active:scale-[0.99]",
                )}
              >
                {isSubmitting ? "Signing in…" : "Sign In"}
              </Button>
            </form>

            <footer className="mt-8 border-t border-text-dark/[0.05] pt-5 text-center">
              <p className="text-sm text-text-muted">
                Authorized personnel only.
              </p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-text-muted/70">
                System Version 4.2.0-stable
              </p>
            </footer>
          </div>

          <div className="mt-5 flex justify-center">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-primary"
            >
              <LuCircleHelp size={14} />
              Need assistance with your account?
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

const inputCx = {
  label: "text-xs font-semibold !text-text-dark",
  inputWrapper: cn(
    "border-text-dark/15 bg-background/40 transition-all",
    "data-[hover=true]:border-text-dark/25 data-[hover=true]:bg-background/60",
    "group-data-[focus=true]:border-gold/60 group-data-[focus=true]:bg-surface",
    "group-data-[focus=true]:ring-4 group-data-[focus=true]:ring-gold/15",
  ),
  input: "text-sm placeholder:text-text-muted",
  errorMessage: "text-xs",
};
