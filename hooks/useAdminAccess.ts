import { useUser } from "@clerk/nextjs";
import { useCheckRole } from "./useCheckRole";
import { isEmailAllowed } from "@/lib/access";

export const useAdminAccess = () => {
  const { user, isLoaded } = useUser();
  const { checkUserRole } = useCheckRole();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress;
  const isAdmin = checkUserRole() === "admin";
  const isPrivilegedAdmin = isAdmin && isEmailAllowed(email);
  return { isAdmin, isPrivilegedAdmin, isLoaded };
};
