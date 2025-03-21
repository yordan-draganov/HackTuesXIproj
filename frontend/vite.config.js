import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	optimizeDeps: {
		exclude: ["bcryptjs"], // Exclude bcryptjs from optimization
	},
	server: {
		proxy: {
			"/api": "http://localhost:5000",
		},
	},
});
