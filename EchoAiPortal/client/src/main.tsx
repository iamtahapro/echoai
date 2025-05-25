import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize Firebase before anything else
import "./lib/firebase";

// Set document title
document.title = "Echo AI - Intelligent Code Assistant";

// Add meta description for SEO
const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'Echo AI is an intelligent coding assistant that helps developers generate clean code, explain algorithms, and debug programs. Perfect for beginners and experienced developers alike.';
document.head.appendChild(metaDescription);

createRoot(document.getElementById("root")!).render(<App />);
