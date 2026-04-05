import { withUt } from "uploadthing/tw";
import animatePlugin from "tailwindcss-animate";

export default withUt({
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                tight: ["'Inter Tight'", "system-ui", "sans-serif"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "gradient-silver": "linear-gradient(180deg, #ffffff 0%, #a1a1aa 100%)",
                "gradient-hyper": "linear-gradient(135deg, #00f2ff, #0070f3)",
                "gradient-violet": "linear-gradient(135deg, #8b5cf6, #c084fc)",
                "edge-light": "linear-gradient(to bottom right, rgba(255,255,255,0.18), transparent, rgba(139,92,246,0.12))",
                "matte-blue": "linear-gradient(135deg, hsl(220, 50%, 70%), hsl(220, 60%, 50%))",
                "mesh-blue": "radial-gradient(ellipse at top left, rgba(0,242,255,0.15), transparent 50%), radial-gradient(ellipse at bottom right, rgba(139,92,246,0.15), transparent 50%)",
            },
            colors: {
                "hyper-blue":      "#00f2ff",
                "electric-violet": "#8b5cf6",
                "obsidian":        "#020202",
                primary_heading: "hsl(var(--primary-heading))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    "1": "hsl(var(--chart-1))",
                    "2": "hsl(var(--chart-2))",
                    "3": "hsl(var(--chart-3))",
                    "4": "hsl(var(--chart-4))",
                    "5": "hsl(var(--chart-5))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                "2xl": "1.5rem",
                "3xl": "2rem",
                "4xl": "2.5rem",
            },
            backdropBlur: {
                xs: "2px",
                "3xl": "48px",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to:   { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to:   { height: "0" },
                },
                "border-beam": {
                    "0%":   { "offset-distance": "0%" },
                    "100%": { "offset-distance": "100%" },
                },
                shimmer: {
                    "0%":   { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(100%)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%":      { transform: "translateY(-8px)" },
                },
                "marquee-dark": {
                    "0%":   { transform: "translateX(0)" },
                    "100%": { transform: "translateX(-50%)" },
                },
                "pulse-glow": {
                    "0%, 100%": { boxShadow: "0 0 20px rgba(0,242,255,0.2)" },
                    "50%":      { boxShadow: "0 0 40px rgba(0,242,255,0.5), 0 0 60px rgba(139,92,246,0.3)" },
                },
                "blur-fade-in": {
                    "0%":   { filter: "blur(12px)", opacity: "0" },
                    "100%": { filter: "blur(0px)",  opacity: "1" },
                },
            },
            animation: {
                "accordion-down":  "accordion-down 0.2s ease-out",
                "accordion-up":    "accordion-up 0.2s ease-out",
                "border-beam":     "border-beam 4s linear infinite",
                shimmer:           "shimmer 2s ease-in-out infinite",
                float:             "float 3s ease-in-out infinite",
                "marquee-dark":    "marquee-dark 20s linear infinite",
                "pulse-glow":      "pulse-glow 2s ease-in-out infinite",
                "blur-fade-in":    "blur-fade-in 0.6s ease-out forwards",
            },
        },
    },
    plugins: [animatePlugin],
});
