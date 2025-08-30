import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:80",
                changeOrigin: true,
                secure: false,
            },
        },
    },
    define: {
        "import.meta.env.VITE_CLIENT_VERSION": JSON.stringify(process.env.npm_package_version),
    },
})
