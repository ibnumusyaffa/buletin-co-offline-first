import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { BlockNoteEditor, type PartialBlock } from "@blocknote/core";
import { useEffect, useMemo, useState } from "react";

export type EditorProps = {
	initialValue: string;
	onChange: (data: string) => void;
};
export function Editor({ initialValue, onChange }: EditorProps) {
	const [initialContent, setInitialContent] = useState<
		PartialBlock[] | undefined | "loading"
	>("loading");

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (initialContent === "loading" || initialContent === undefined) {
			const content = initialValue;
			const parsedContent = content
				? (JSON.parse(content) as PartialBlock[])
				: undefined;
			setInitialContent(parsedContent);
		}
	}, [initialValue]);

	const editor = useMemo(() => {
		if (initialContent === "loading") {
			return undefined;
		}
		return BlockNoteEditor.create({ initialContent: initialContent });
	}, [initialContent]);

	if (editor === undefined) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<BlockNoteView
				editor={editor}
				onChange={() => {
					onChange(JSON.stringify(editor.document));
				}}
			/>
		</div>
	);
}