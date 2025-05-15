import type { RouteSectionProps } from "@solidjs/router";
import TopBar from "./TopBar";
import { JSX } from "solid-js";

export default function Layout(props: RouteSectionProps): JSX.Element {
  return (
    <>
      <TopBar />
      <main class="transition-colors duration-90 bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 min-h-screen">{props.children}</main>
    </>
  );
}
