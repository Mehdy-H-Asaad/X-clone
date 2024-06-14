import { ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";

import XSvg from "../../../components/svgs/X";

import { MdPassword } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type loginProps = {
	username: string;
	password: string;
};

const LoginPage = () => {
	const [formData, setFormData] = useState<loginProps>({
		username: "",
		password: "",
	});

	const queryClient = useQueryClient();

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		mutate(formData);
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		setFormData({ ...formData, [name]: value });
	};

	const { mutate, isPending, isError, error } = useMutation({
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
			queryClient.invalidateQueries({ queryKey: ["authorizedUser"] });
		},
	});

	return (
		<div className="max-w-screen-xl mx-auto flex h-screen px-10">
			<div className="flex-1 hidden lg:flex items-center  justify-center">
				<XSvg className=" lg:w-2/3 fill-white" />
			</div>
			<div className="flex-1 flex flex-col justify-center items-center">
				<form
					className="lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col"
					onSubmit={handleSubmit}
				>
					<XSvg className="w-24 lg:hidden fill-white" />
					<h1 className="text-4xl font-extrabold text-white">Welcome to X.</h1>
					<label className="input input-bordered rounded flex items-center gap-2">
						<FaUser />
						<input
							type="text"
							className="grow"
							placeholder="Username"
							name="username"
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>
					<div className="flex gap-4 flex-wrap">
						<label className="input input-bordered rounded flex items-center gap-2 flex-1">
							<MdPassword />
							<input
								type="password"
								className="grow"
								placeholder="Password"
								name="password"
								onChange={handleInputChange}
								value={formData.password}
							/>
						</label>
					</div>

					<button className="btn rounded-full btn-primary text-white">
						{isPending ? "loading... " : "Login"}
					</button>
					{isError && <p className="text-red-500">{error.message}</p>}
				</form>
				<div className="flex flex-col lg:w-2/3 gap-2 mt-4">
					<p className="text-white text-lg">Don't have an account?</p>
					<Link to="/signup">
						<button className="btn rounded-full btn-primary text-white btn-outline w-full">
							Sign up
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;
