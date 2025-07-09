import { onCleanup, onMount, createEffect } from "solid-js";
import type { JSX } from "solid-js";
import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";
import { theme } from "../state/theme"; // Import the theme signal

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  options?: EasyMDE.Options;
  textareaClass?: string;
}

export default function MarkdownEditor(
  props: MarkdownEditorProps,
): JSX.Element {
  let textareaRef: HTMLTextAreaElement | undefined;
  let mde: EasyMDE | undefined;

  onMount(() => {
    mde = new EasyMDE({
      element: textareaRef!,
      initialValue: props.value ?? "",
      ...props.options,
      spellChecker: false,
      status: false,
      // autoDownloadFontAwesome is true by default, so we can remove the line.
    });
    // Sync from editor to parent
    mde.codemirror.on("change", () => {
      props.onChange(mde!.value());
    });
  });

  onCleanup(() => {
    if (mde) mde.toTextArea();
    mde = undefined;
  });

  // NEW: Add an effect to apply dark theme styles
  createEffect(() => {
    const editorEl = textareaRef?.nextElementSibling;
    if (editorEl) {
      if (theme() === "dark") {
        editorEl.classList.add("easymde-dark");
      } else {
        editorEl.classList.remove("easymde-dark");
      }
    }
  });

  return (
    <textarea
      ref={textareaRef}
      class={
        props.textareaClass ??
        "w-full min-h-[180px] border border-gray-300 dark:border-gray-700 rounded"
      }
      value={props.value}
      autocomplete="off"
    />
  );
}
