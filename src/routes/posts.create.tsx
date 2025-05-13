import { Editor } from "@/components/editor";
import { type Post, db } from "@/db";
import { id } from "@instantdb/react";
import { ActionIcon } from "@mantine/core";
import { Loader } from "@mantine/core";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
import { useRef } from "react";

export const Route = createFileRoute("/posts/create")({
	component: RouteComponent,
});

const newId = id();

function RouteComponent() {
	const isDirty = useRef(false);

	const { isLoading, error, data } = db.useQuery({
		posts: {
			$: {
				where: {
					id: newId,
				},
			},
		},
	});

	function onChange(data: Partial<Post>) {
		db.transact(
			db.tx.posts[newId].update({
				...data,
				...(isDirty.current
					? {}
					: { createdAt: Date.now(), type: "free", status: "draft" }),
			}),
		);
	}
	const navigate = useNavigate();

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Loader size="lg" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center h-screen">
				Error: {error.message}
			</div>
		);
	}

	const title = data?.posts[0]?.title || "";
	const subtitle = data?.posts[0]?.subtitle || "";

	return (
		<div className="min-h-screen flex flex-col items-center p-10">
			<div className="flex justify-between w-full">
				<ActionIcon
					onClick={() => navigate({ to: "/" })}
					variant="default"
					size="xl"
					radius="xl"
				>
					<ArrowLeftIcon className="w-5 h-5" />
				</ActionIcon>
			</div>
			<div className="w-full max-w-3xl">
				<div>
					<div className="ml-13">
						<input
							placeholder="Title"
							className="w-full text-3xl font-bold mb-2 border-none outline-none bg-transparent placeholder-gray-400 resize-none overflow-hidden"
							value={title}
							onChange={(e) => onChange({ title: e.target.value })}
						/>
						<input
							placeholder="Subtitle"
							className="w-full text-lg font-medium mb-6 border-none outline-none bg-transparent placeholder-gray-400 text-gray-500 resize-none overflow-hidden"
							value={subtitle}
							onChange={(e) => onChange({ subtitle: e.target.value })}
						/>
					</div>

					<Editor
						initialValue={data?.posts[0]?.content || ""}
						onChange={(data) => {
							onChange({ content: data });
						}}
					/>
				</div>
			</div>
		</div>
	);
}
