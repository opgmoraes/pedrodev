import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import "./styles.css";

const container = document.getElementById("root")!;
const application = (
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
if (container.dataset.prerendered === "true") ReactDOM.hydrateRoot(container, application);
else ReactDOM.createRoot(container).render(application);
