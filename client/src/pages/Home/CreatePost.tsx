import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CreatePostProps, UserProps } from "../../types/Types";

const CreatePost = () => {
	const [text, setText] = useState<string>("");
	const [img, setImg] = useState<string | ArrayBuffer | null>(null);

	const imgRef = useRef<HTMLInputElement | null>(null);

	const { data: authUser } = useQuery<UserProps>({
		queryKey: ["authorizedUser"],
	});
	const queryClient = useQueryClient();
	const {
		mutate: createPost,
		isPending,
		error,
		isError,
	} = useMutation({
		mutationFn: async ({ img, text }: CreatePostProps) => {
			try {
				const res = await fetch("/api/posts/create", {
					method: "POST",
					headers: {
						"Content-type": "application/json",
					},
					body: JSON.stringify({ img, text }),
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error: any) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			setText("");
			setImg(null);
			toast.success("Added new post");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		createPost({ img, text });
	};

	const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	if (!authUser) return null;

	return (
		<div className="flex p-4 items-start gap-4 border-b border-gray-700">
			<div className="avatar">
				<div className="w-8 rounded-full">
					<img src={authUser.profileImg || "/avatar-placeholder.png"} />
				</div>
			</div>
			<form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
				<textarea
					className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800"
					placeholder="What is happening?!"
					value={text}
					onChange={e => setText(e.target.value)}
				/>
				{img && (
					<div className="relative w-72 mx-auto">
						<div
							className="absolute top-0 right-0 text-white bg-gray-800 rounded-full cursor-pointer"
							onClick={() => {
								setImg(null);
								if (imgRef.current) {
									imgRef.current.value = "";
								}
							}}
						>
							<IoCloseSharp size={20} />
						</div>
						<img
							src={img as string}
							className="w-full mx-auto h-72 object-contain rounded"
							alt="Uploaded"
						/>
					</div>
				)}

				<div className="flex justify-between border-t py-2 border-t-gray-700">
					<div className="flex gap-1 items-center">
						<div
							className="fill-primary cursor-pointer"
							onClick={() => imgRef.current?.click()}
						>
							<CiImageOn size={24} />
						</div>
						<div className="fill-primary w-5 h-5 cursor-pointer text-blue-400">
							<BsEmojiSmileFill size={20} />
						</div>
					</div>
					<input type="file" hidden ref={imgRef} onChange={handleImgChange} />
					<button className="btn btn-primary rounded-full btn-sm text-white px-4">
						{isPending ? "Posting..." : "Post"}
					</button>
				</div>
				{isError && <div className="text-red-500">{error.message}</div>}
			</form>
		</div>
	);
};

export default CreatePost;
