import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Hook
export const useLogout = () => {
    const { clearAuth } = useAuthStore();
    const router = useRouter();

    return useMutation({
        mutationFn: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        },
        onSuccess: () => {
            clearAuth();
            toast.success("Logged out successfully!");
            router.push("/login");
        },
        onError: (error: Error) => {
            toast.error(`Error logging out: ${error.message}`);
        },
    });
};
