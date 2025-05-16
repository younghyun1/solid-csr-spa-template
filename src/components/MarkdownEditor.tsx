import { onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";
import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  options?: EasyMDE.Options;
  textareaClass?: string;
}

export default function MarkdownEditor(props: MarkdownEditorProps): JSX.Element {
  let textareaRef: HTMLTextAreaElement | undefined;
  let mde: EasyMDE | undefined;

  onMount(() => {
    mde = new EasyMDE({
      element: textareaRef!,
      autoDownloadFontAwesome: false,
      initialValue: props.value ?? "",
      ...props.options,
      spellChecker: false,
      status: false,
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

  // Always reflect prop.value if it changes externally
  // (Note: EasyMDE is not Reactive, so do this only if value is controlled externally)
  // Potential enhancement: createEffect(() => { if (mde && mde.value() !== props.value) mde.value(props.value); });

  return (
    <textarea
      ref={textareaRef}
      class={props.textareaClass ?? "w-full min-h-[180px] border border-gray-300 dark:border-gray-700 rounded"}
      value={props.value}
      autocomplete="off"
    />
  );
}
