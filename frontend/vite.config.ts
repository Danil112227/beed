import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import path from "path";
import ckeditor5 from "@ckeditor/vite-plugin-ckeditor5";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		host: "0.0.0.0",
		port: 3000,
		watch: {
			usePolling: true,
		},
	},
	plugins: [
		react(),
		svgr(),
		ckeditor5({ theme: require.resolve("@ckeditor/ckeditor5-theme-lark") }),
	],
	resolve: {
		alias: {
			"@public": path.resolve(__dirname, "./public"),
			"@api": path.resolve(__dirname, "./src/api"),
			"@assets": path.resolve(__dirname, "./src/assets"),
			"@components": path.resolve(__dirname, "./src/components"),
			"@features": path.resolve(__dirname, "./src/features"),
			"@hooks": path.resolve(__dirname, "./src/hooks"),
			"@pages": path.resolve(__dirname, "./src/pages"),
			"@routes": path.resolve(__dirname, "./src/routes"),
			"@styles": path.resolve(__dirname, "./src/styles"),
			"@utils": path.resolve(__dirname, "./src/utils"),
			"@helpers": path.resolve(__dirname, "./src/helpers"),
			"@query": path.resolve(__dirname, "./src/query"),
			"@lib": path.resolve(__dirname, "./src/lib"),
		},
	},
});
