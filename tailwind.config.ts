import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import scrollbar from "tailwind-scrollbar";


export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				// HTB-inspired dark surface palette
				htb: {
					bg: '#0B0F17',
					'bg-deep': '#070A11',
					panel: '#111927',
					'panel-hover': '#162033',
					'panel-2': '#1A2332',
					border: 'rgba(255,255,255,0.06)',
					'border-hover': 'rgba(159,239,0,0.35)',
					muted: '#A4B1CD',
					'text-dim': '#6B7A99',
					text: '#E6EDF7',
				},
				neon: {
					DEFAULT: '#9FEF00',
					green: '#9FEF00',
					'green-dim': '#7BC400',
					'green-soft': 'rgba(159,239,0,0.12)',
					'green-glow': 'rgba(159,239,0,0.45)',
				},
				// retain violet for "premium tier" accent
				purple: {
					DEFAULT: '#7E22CE',
					100: '#7E22CE1A',
					300: '#C084FC',
					500: '#A855F7',
					600: '#9333EA',
					700: '#7E22CE',
				},
				// status (tuned for dark bg)
				success: '#9FEF00',
				warn: '#FFAF00',
				danger: '#FF3E3E',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: '0.5rem',
				md: '0.375rem',
				sm: '0.125rem'
			},
			fontFamily: {
				sans: ['var(--font-geist-sans)', 'Manrope', 'system-ui', 'sans-serif'],
				mono: ['"JetBrains Mono"', 'var(--font-geist-mono)', 'ui-monospace', 'monospace'],
				display: ['var(--font-geist-sans)', 'Manrope', 'system-ui', 'sans-serif'],
			},
			letterSpacing: {
				'wider-2': '0.15em',
				'widest-2': '0.25em',
			},
			boxShadow: {
				'neon': '0 0 0 1px rgba(159,239,0,0.5), 0 0 24px rgba(159,239,0,0.25)',
				'neon-sm': '0 0 0 1px rgba(159,239,0,0.4), 0 0 12px rgba(159,239,0,0.15)',
				'neon-lg': '0 0 0 1px rgba(159,239,0,0.6), 0 0 48px rgba(159,239,0,0.35)',
				'panel': '0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset',
				'panel-lg': '0 12px 48px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) inset',
				'violet-glow': '0 0 0 1px rgba(168,85,247,0.5), 0 0 24px rgba(168,85,247,0.3)',
			},
			backgroundImage: {
				'grid-pattern':
					'linear-gradient(rgba(159,239,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(159,239,0,0.05) 1px, transparent 1px)',
				'grid-pattern-dim':
					'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
				'radial-glow':
					'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(159,239,0,0.15), transparent 70%)',
				'radial-glow-violet':
					'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(126,34,206,0.18), transparent 70%)',
				'hex-pattern':
					"url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='46' viewBox='0 0 40 46'><path d='M20 0L40 11.5v23L20 46 0 34.5v-23z' fill='none' stroke='rgba(159,239,0,0.06)' stroke-width='1'/></svg>\")",
				'panel-gradient':
					'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)',
			},
			backgroundSize: {
				'grid-sm': '24px 24px',
				'grid-md': '40px 40px',
				'grid-lg': '64px 64px',
			},
			screens: {
				'3xl': '1920px',
				'4xl': '2560px',
				'min-400': '400px',
				'min-500': '500px',
				'min-600': '600px',
				'min-700': '700px',
				'min-800': '800px',
				'min-900': '900px',
				'min-1000': '1000px',
				'min-1100': '1100px',
				'min-1200': '1200px',
				'min-1300': '1300px',
				'min-1400': '1400px',
				'max-400': '400px'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'scanline': {
					'0%': { transform: 'translateY(-100%)' },
					'100%': { transform: 'translateY(100%)' }
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 0 1px rgba(159,239,0,0.4), 0 0 12px rgba(159,239,0,0.15)' },
					'50%': { boxShadow: '0 0 0 1px rgba(159,239,0,0.7), 0 0 32px rgba(159,239,0,0.45)' }
				},
				'grid-fade': {
					'0%, 100%': { opacity: '0.6' },
					'50%': { opacity: '1' }
				},
				'terminal-blink': {
					'0%, 49%': { opacity: '1' },
					'50%, 100%': { opacity: '0' }
				},
				'slide-up-fade': {
					from: { opacity: '0', transform: 'translateY(8px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'shine': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(200%)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'scanline': 'scanline 6s linear infinite',
				'glow-pulse': 'glow-pulse 2.4s ease-in-out infinite',
				'grid-fade': 'grid-fade 6s ease-in-out infinite',
				'terminal-blink': 'terminal-blink 1s step-end infinite',
				'slide-up-fade': 'slide-up-fade 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
				'shine': 'shine 1.5s ease-in-out',
			}
		}
	},
	plugins: [animate, scrollbar],
} satisfies Config;
