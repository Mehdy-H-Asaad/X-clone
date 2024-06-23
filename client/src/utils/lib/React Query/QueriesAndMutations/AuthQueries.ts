import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UserProps, formProps, loginProps } from "../../../../types/Types";
import { QUERY_KEYS } from "../QueryKeys";

export const useSignUp = () => {
	const queryClient = useQueryClient();
	const {
		mutate: signUp,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: async (formData: formProps) => {
			const { email, username, fullname, password } = formData;
			try {
				const res = await fetch("/api/auth/signup", {
					method: "POST",
					headers: {
						"Content-type": "application/json",
					},
					body: JSON.stringify({ email, username, fullname, password }),
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error: any) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Account created successfully");
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUTH_USER] });
		},
	});
	return { signUp, isPending, isError, error };
};

export const useLogin = () => {
	const queryClient = useQueryClient();
	const {
		mutate: login,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: async (loginForm: loginProps) => {
			const { username, password } = loginForm;
			try {
				const res = await fetch("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-type": "application/json",
					},
					body: JSON.stringify({ username, password }),
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error: any) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUTH_USER] });
		},
	});

	return { login, error, isError, isPending };
};

export const useLogOut = () => {
	const queryClient = useQueryClient();
	const { mutate: logout } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/auth/logout", {
					method: "POST",
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error: any) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			queryClient.setQueryData([QUERY_KEYS.AUTH_USER], null);
		},
	});
	return { logout };
};

export const useAuthUser = () => {
	const { data: AuthorizedUser } = useQuery<UserProps>({
		queryKey: [QUERY_KEYS.AUTH_USER],
	});

	return { AuthorizedUser };
};
