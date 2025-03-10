import { useUser } from "@clerk/nextjs";

export const useCheckRole = () => {
  const { user } = useUser();

  const checkUserRole = (): 'admin' | 'user' | null => {
    if (!user) return null;
    return user.publicMetadata.role as 'admin' | 'user' || 'user';
  };

  return { checkUserRole, user };
}; 