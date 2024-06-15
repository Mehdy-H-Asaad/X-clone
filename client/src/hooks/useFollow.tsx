import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useFollow = () => {
	const queryClient = useQueryClient();
	const { mutate: followUnFollow, isPending } = useMutation({
		mutationFn: async (id: string) => {
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
			toast.success("followed");

			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
				queryClient.invalidateQueries({ queryKey: ["authorizedUser"] }),
			]);
		},
		onError: (error: any) => {
			toast.error(error);
		},
	});

	return { isPending, followUnFollow };
};

export default useFollow;
