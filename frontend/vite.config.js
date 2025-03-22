import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	optimizeDeps: {
		exclude: ["bcryptjs"],
	},
	server: {
		proxy: {
			"/api": "http://localhost:5000",
		},
	},
});
