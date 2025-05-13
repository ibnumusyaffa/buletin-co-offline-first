import { type Post, db } from "@/db";
import { ActionIcon, Badge, Button, Group, Loader, Menu, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import dayjs from "dayjs";
import { EllipsisIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useRef } from "react";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const router = useRouter();

	const { isLoading, error, data } = db.useQuery({ posts: {} });

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
	const { posts } = data;
	return (
		<div className="min-h-screen  flex-col space-y-4 p-10">
			<div>
				<h2 className="tracking-wide text-5xl text-gray-800">Posts</h2>
			</div>

			<div className=" max-w-3xl w-full">
				<Button onClick={() => router.navigate({ to: "/posts/create" })}>
					Create Post
				</Button>
				<PostList posts={posts} />
			</div>
		</div>
	);
}

function deletePost(id: string) {
	db.transact(db.tx.posts[id].delete());
}

function PostList({ posts }: { posts: Post[] }) {
	const [opened, { open, close }] = useDisclosure(false);
	const currentId = useRef<string | null>(null);
	return (
		<div className="mt-5">
			{posts.map((post) => (
				<div
					key={post.id}
					className="flex items-center h-28 px-3 hover:bg-gray-100 rounded-md transition-all duration-100"
				>
					<div className="w-full">
						<div className="font-medium text-lg text-gray-800">
							{post.title}
						</div>
						<div className=" text-gray-700">{post.subtitle}</div>
						<div className="flex space-x-2 items-center mt-3">
							<Badge variant="outline">{post.status}</Badge>
							<div className="text-gray-500 text-sm">
								{dayjs(post.createdAt).format("MMM D, YYYY")}
							</div>
						</div>
					</div>

					<Modal opened={opened} onClose={close} title="Delete Post">
						Are you sure you want to delete this post? This action cannot be
						undone.
						<Group mt="lg" justify="flex-end">
							<Button onClick={close} variant="default">
								Cancel
							</Button>
							<Button
								onClick={() => {
									if (currentId.current !== null) {
										deletePost(currentId.current);
										close();
									}
								}}
								color="red"
							>
								Delete
							</Button>
						</Group>
					</Modal>

					<Menu shadow="md" width={200}>
						<Menu.Target>
							<ActionIcon variant="default" radius="xl">
								<EllipsisIcon className="w-4 h-4" />
							</ActionIcon>
						</Menu.Target>

						<Menu.Dropdown>
							<Menu.Item
								component={Link}
								to="/posts/$id"
								// @ts-ignore
								params={{ id: post.id }}
								leftSection={<PencilIcon className="w-4 h-4" />}
							>
								Edit
							</Menu.Item>
							<Menu.Item
								onClick={()=>{
									currentId.current = post.id;
									open();
								}}
								color="red"
								leftSection={<TrashIcon className="w-4 h-4" />}
							>
								Delete
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				</div>
			))}
		</div>
	);
}
