'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Lock, ShieldPlus } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { registerAdmin } from "@/API/admin";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(1, "Please select a role"),
  adminRights: z.array(z.string()),
});

type FormData = z.infer<typeof formSchema>;

const roles = [
  "System Administrator",
  "Security Manager",
  "Content Manager",
  "User Manager",
  "Report Analyst",
];

const adminRightOptions = [
  "User Management",
  "Security Settings",
  "System Configuration",
  "Content Management",
  "Report Generation",
];

const AdminForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adminRights: [],
    },
  });

  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    try {
      await registerAdmin(data)
      // console.log("Form submitted:", data);
     toast.success("Form submitted successfully!");
     router.push("/admin/administrator")
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error((error as string) ?? "Error submitting");
    }
  };

  const labelClass = "text-htb-muted font-mono text-[11px] uppercase tracking-widest font-semibold mb-1.5 block";
  const inputClass = "w-full pl-10 pr-4 py-2 border border-htb-border bg-htb-bg text-htb-text text-sm rounded-md focus:ring-1 focus:ring-neon/40 focus:border-neon/60 hover:border-htb-border-hover transition-all placeholder:text-htb-text-dim placeholder:font-mono placeholder:text-xs";

  return (
    <div className="flex items-center justify-center py-4">
      <div className="w-full min-w-xl panel px-7 py-6 space-y-5">

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label className={labelClass}>Email ID</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-htb-text-dim pointer-events-none" />
                <input
                  {...register("email")}
                  type="email"
                  className={inputClass}
                  placeholder="Enter Email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-danger font-mono">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-htb-text-dim pointer-events-none" />
                <input
                  {...register("password")}
                  type="password"
                  className={inputClass}
                  placeholder="Enter Password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-danger font-mono">{errors.password.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Administrator Name Field */}
              <div>
                <label className={labelClass}>Administrator Name</label>
                <input
                  {...register("name")}
                  type="text"
                  className="w-full px-4 py-2 text-sm border border-htb-border bg-htb-bg text-htb-text rounded-md focus:ring-1 focus:ring-neon/40 focus:border-neon/60 hover:border-htb-border-hover transition-all placeholder:text-htb-text-dim placeholder:font-mono placeholder:text-xs"
                  placeholder="Enter Name"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-danger font-mono">{errors.name.message}</p>
                )}
              </div>

              {/* Role Selection */}
              <div>
                <label className={labelClass}>Role</label>
                <div className="relative">
                  <ShieldPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-htb-text-dim pointer-events-none" />
                  <select
                    {...register("role")}
                    className="w-full pl-10 pr-4 text-sm py-2 text-htb-text border border-htb-border bg-htb-bg rounded-md focus:ring-1 focus:ring-neon/40 focus:border-neon/60 hover:border-htb-border-hover transition-all appearance-none font-mono uppercase tracking-wider"
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.role && (
                  <p className="mt-1 text-xs text-danger font-mono">{errors.role.message}</p>
                )}
              </div>
            </div>

            {/* Admin Rights */}
            <div className="space-y-3">
              <label className={labelClass}>Admin Rights</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {adminRightOptions.map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-3 p-3 border border-htb-border rounded-md bg-htb-bg/40 hover:border-neon/30 hover:bg-neon/5 transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      {...register("adminRights")}
                      value={option}
                      className="rounded border-htb-border bg-htb-bg text-neon focus:ring-neon/40 accent-neon"
                    />
                    <span className="text-sm text-htb-text">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-neon hover:bg-neon-green-dim hover:shadow-neon-sm hover:-translate-y-0.5 text-white py-2.5 px-4 rounded-md transition-all disabled:opacity-50 font-mono text-xs uppercase tracking-widest font-semibold"
            >
              {isSubmitting ? "Adding..." : "Add Admin"}
            </button>
            <Link href="/administrator" className="flex-1">
              <button
                type="button"
                onClick={() => reset()}
                className="w-full border border-htb-border bg-htb-panel text-htb-muted hover:text-neon hover:border-neon/40 py-2.5 px-4 rounded-md transition-colors font-mono text-xs uppercase tracking-widest font-semibold"
              >
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminForm;