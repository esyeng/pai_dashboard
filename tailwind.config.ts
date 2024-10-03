import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 90deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
        colors: {
            "sandy-brown": "#fc9f5bff",
            "light-coral": "#ed7b84ff",
            "vista-blue": "#72a1e5ff",
            "tropical-indigo": "#9883e5ff",
            "tea-green": "#c4f4c7ff",
            "chocolate-cosmos": "#4c212aff",
            "caribbean-current": "#0d5c63ff",
            "mint": "#5fbb97ff",
            "sunset": "#f2d0a4ff",
            "ecru": "#a69658ff",
            "ecru-2": "#d9b26fff",
            "jasmine": "#fadf7fff",
            "vanilla": "#f2e29fff",
        },
    },
    plugins: [],
};
export default config;
