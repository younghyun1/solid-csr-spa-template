import { lazy } from "solid-js";
import type { RouteDefinition } from "@solidjs/router";

import Home from "./pages/home";

export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/about",
    component: lazy(() => import("./pages/about")),
  },
  {
    path: "/blog",
    children: [
      {
        path: "/",
        component: lazy(() => import("./pages/posts/List")),
      },
      {
        path: "/new",
        component: lazy(() => import("./pages/posts/New")),
      },
      {
        path: "/:post_id",
        component: lazy(() => import("./pages/posts/View")),
      },
    ],
  },
  {
    path: "/login",
    component: lazy(() => import("./pages/login")),
  },
  {
    path: "/register",
    component: lazy(() => import("./pages/signup")),
  },
  {
    path: "**",
    component: lazy(() => import("./errors/404")),
  },
];
