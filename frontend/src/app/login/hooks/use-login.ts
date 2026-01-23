import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// DTOs
interface LoginDTO {
  email: string;
  password: string;
}

interface IUser {
  id: string;
  email: string;
  type: "ADMIN";
  createdAt: string;
  updatedAt: string;
}

// API Function
const login = async (credentials: LoginDTO): Promise<IUser> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) throw error;
  if (!data.session || !data.user) throw new Error("Login failed - no session");

  // Fetch user details from public.users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (userError) throw userError;

  return {
    id: userData.id,
    email: userData.email,
    type: userData.type as "ADMIN",
    createdAt: userData.created_at,
    updatedAt: userData.updated_at,
  };
};

// Hook
export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation<IUser, Error, LoginDTO>({
    mutationFn: login,
    onSuccess: async (user) => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setAuth({
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          user,
        });
      }
      toast.success("Logged in successfully!");
      router.push("/purposes");
    },
    onError: (error) => {
      toast.error(`Error logging in: ${error.message}`);
    },
  });
};
