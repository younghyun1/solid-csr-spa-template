import type { RouteSectionProps } from "@solidjs/router";
import TopBar from "./TopBar";
import { JSX } from "solid-js";

export default function Layout(props: RouteSectionProps): JSX.Element {
  return (
    <>
      <TopBar />
      <main>{props.children}</main>
    </>
  );
}
