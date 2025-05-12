import { createFileRoute } from "@tanstack/react-router";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { type Post, db } from "@/db";
import {
	BlockNoteEditor,
	type PartialBlock,
} from "@blocknote/core";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute('/posts/$id')({
  component: RouteComponent,
})

function RouteComponent() {
	const isDirty = useRef(false);

  const params = Route.useParams()

  const newId = params.id

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
				...(isDirty.current ? {} : { createdAt: Date.now() }),
			}),
		);
	}

	const [initialContent, setInitialContent] = useState<
		PartialBlock[] | undefined | "loading"
	>("loading");

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
    console.log("data?.posts[0]?.content", data?.posts[0]?.content)
    if(initialContent === "loading" || initialContent === undefined) {
      const content = data?.posts[0]?.content;
      const parsedContent = content
        ? (JSON.parse(content) as PartialBlock[])
        : undefined;
      setInitialContent(parsedContent);
    }
	}, [data?.posts[0]?.content]);

	const editor = useMemo(() => {
		if (initialContent === "loading") {
			return undefined;
		}
		return BlockNoteEditor.create({ initialContent });
	}, [initialContent]);

	if (isLoading || editor === undefined) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	const title = data?.posts[0]?.title || "";
	const subtitle = data?.posts[0]?.subtitle || "";

	return (
		<div className="min-h-screen flex flex-col items-center py-12">
			<div className="w-full max-w-7xl border border-gray-200 py-10">
				<div className="ml-13">
					<input
						type="text"
						placeholder="Title"
						className="w-full text-2xl font-bold mb-2 border-none outline-none bg-transparent placeholder-gray-400"
						value={title}
						onChange={(e) => onChange({ title: e.target.value })}
					/>
					<input
						type="text"
						placeholder="Subtitle"
						className="w-full text-lg font-medium mb-6 border-none outline-none bg-transparent placeholder-gray-400 text-gray-500"
						value={subtitle}
						onChange={(e) => onChange({ subtitle: e.target.value })}
					/>
				</div>

				<BlockNoteView
					onChange={() => {
						onChange({ content: JSON.stringify(editor.document) });
					}}
					editor={editor}
				/>
			</div>
		</div>
	);
}

