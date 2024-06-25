import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	UserProps,
	editImgProps,
	editProfileProps,
} from "../../../../types/Types";
import toast from "react-hot-toast";
import { QUERY_KEYS } from "../QueryKeys";

export const useSuggestedUsers = () => {
	const {
		data: suggestedUsers,
		isLoading,
		refetch,
		isRefetching,
	} = useQuery<UserProps[]>({
		queryKey: [QUERY_KEYS.SUGGESTED_USERS],
		queryFn: async () => {
			try {
				const res = await fetch("/api/users/suggested");

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error: any) {
				throw new Error(error);
			}
		},
	});
	return { suggestedUsers, isLoading, refetch, isRefetching };
};

export const useFollow = () => {
	const queryClient = useQueryClient();
	const { mutate: followUnFollow, isPending } = useMutation({
		mutationFn: async (id: string): Promise<any> => {
			try {
				const res = await fetch(`/api/users/follow/${id}`, {
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
			Promise.all([
				queryClient.invalidateQueries({
					queryKey: [QUERY_KEYS.SUGGESTED_USERS],
				}),
				queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUTH_USER] }),
			]);
		},
		onError: (error: any) => {
			toast.error(error);
		},
	});

	return { isPending, followUnFollow };
};

export const useGetUserProfile = (username: string | undefined) => {
	const {
		data: user,
		isLoading,
		isRefetching,
		refetch,
	} = useQuery({
		queryKey: [QUERY_KEYS.USER_PROFILE],
		queryFn: async () => {
			try {
				const res = await fetch(`/api/users/profile/${username}`);

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Someting went wrong");

				return data;
			} catch (error: any) {
				throw new Error(error);
			}
		},
	});

	return { user, isLoading, isRefetching, refetch };
};

export const useGetUserProfilePosts = (username: string | undefined) => {
	const {
		data: userPosts,
		refetch: refetchUserPosts,
		isRefetching: isRefetchingPosts,
		isPending: isGettingPosts,
	} = useQuery({
		queryKey: ["profilePosts"],
		queryFn: async () => {
			try {
				const res = await fetch(`/api/posts/userposts/${username}`);
				const data = await res.json();

				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error: any) {
				throw new Error(error.message);
			}
		},
	});

	return { userPosts, refetchUserPosts, isGettingPosts, isRefetchingPosts };
};

export const useUpdateProfile = () => {
	const queryClient = useQueryClient();
	const { mutateAsync: updateProfile, isPending: isUpdating } = useMutation({
		mutationFn: async (formData: editProfileProps | editImgProps) => {
			try {
				const res = await fetch(`/api/users/update`, {
					method: "POST",
					headers: {
						"Content-type": "application/json",
					},
					body: JSON.stringify(formData),
				});

				const data = await res.json();

				if (!res.ok) throw new Error(data.error || "Something went wrong");

				return data;
			} catch (error: any) {
				throw new Error(error.message);
			}
		},

		onSuccess: () => {
			Promise.all([
				queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUTH_USER] }),
				queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_PROFILE] }),
			]);
		},
		onError: (error: any) => toast.error(error.message),
	});

	return { updateProfile, isUpdating };
};
