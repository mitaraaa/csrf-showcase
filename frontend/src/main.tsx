import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./contexts/authProvider";
import "./index.scss";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <Theme
        accentColor="jade"
        hasBackground
        appearance="dark"
        panelBackground="translucent"
      >
        <RouterProvider router={router} />
      </Theme>
    </AuthProvider>
  </React.StrictMode>
);
