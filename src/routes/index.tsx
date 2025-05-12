import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Post, db } from "@/db";
import { Link, createFileRoute, useRouter} from "@tanstack/react-router";
import { EllipsisIcon } from "lucide-react";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const router = useRouter();

	const { isLoading, error, data } = db.useQuery({ posts: {} });
	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div className="text-red-500 p-4">Error: {error.message}</div>;
	}
	const { posts } = data;
	return (
		<div className="min-h-screen  flex-col space-y-4 p-10">
			<div>
				<h2 className="tracking-wide text-5xl text-gray-300">Posts</h2>
			</div>

			<div className=" max-w-xs w-full">
				<Button onClick={() => router.navigate({ to: "/posts/create" })}>
					Create Post
				</Button>
				<PostList posts={posts} />
			</div>
		</div>
	);
}

function deletePost(post: Post) {
	db.transact(db.tx.posts[post.id].delete());
}

function PostList({ posts }: { posts: Post[] }) {
	return (
		<div className="mt-5">
			{posts.map((post) => (
				<div
					key={post.id}
					className="flex items-center h-20 hover:bg-gray-100 px-3"
				>
					<div className="w-full">
						<div>{post.title}</div>
						<div>{post.status}</div>
					</div>
				
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<EllipsisIcon className="w-4 h-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem asChild>
								<Link to="/posts/$id" params={{ id: post.id }}>
									View
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>Delete</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			))}
		</div>
	);
}
