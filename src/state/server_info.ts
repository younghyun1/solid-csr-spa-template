import { createSignal } from "solid-js";

export const [serverBuildInfo, setServerBuildInfo] = createSignal<{
  built_time?: string;
  name?: string;
  rust_version?: string;
}>({});
