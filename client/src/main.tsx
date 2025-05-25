import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set document title
document.title = "Echo AI - Intelligent Code Assistant";

// Add meta description for SEO
const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'Echo AI is an intelligent coding assistant that helps developers generate clean code, explain algorithms, and debug programs. Perfect for beginners and experienced developers alike.';
document.head.appendChild(metaDescription);

// Add error handling for unhandled rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

// Add error boundary for React errors
window.addEventListener('error', (event) => {
  console.error('Application error:', event.error);
});

try {
  // Initialize Firebase
  import("./lib/firebase").then(() => {
    createRoot(document.getElementById("root")!).render(<App />);
  }).catch((error) => {
    console.error('Firebase initialization error:', error);
    // Render app anyway without Firebase
    createRoot(document.getElementById("root")!).render(<App />);
  });
} catch (error) {
  console.error('Main initialization error:', error);
  createRoot(document.getElementById("root")!).render(<App />);
}
