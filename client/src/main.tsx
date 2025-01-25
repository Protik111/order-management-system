import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#1DA57A",
          },
        }}
      >
        <Toaster position="top-center" richColors />
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>
);
