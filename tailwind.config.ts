
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'montserrat': ['Montserrat', 'sans-serif'],
				'poppins': ['Poppins', 'sans-serif'],
				'open-sans': ['Open Sans', 'sans-serif'],
				'roboto': ['Roboto', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#00A3FF',
					foreground: '#FFFFFF',
					dark: '#8F43FF',
					50: '#E6F2FF',
					100: '#CCE5FF',
					200: '#99CCFF',
					300: '#66B2FF',
					400: '#3399FF',
					500: '#00A3FF',
					600: '#0082CC',
					700: '#006299',
					800: '#004166',
					900: '#002033',
				},
				'primary-dark': '#8F43FF', // Added this line to define primary-dark as a top-level color
				secondary: {
					DEFAULT: '#22FFF7',
					foreground: '#202235',
					50: '#E9FFFD',
					100: '#D4FFF9',
					200: '#A9FFF4',
					300: '#7DFFEE',
					400: '#52FFE9',
					500: '#22FFF7',
					600: '#00D6CE',
					700: '#00A39C',
					800: '#006D68',
					900: '#003634',
				},
				accent: {
					DEFAULT: '#F43C93',
					foreground: '#FFFFFF',
					50: '#FEE5F0',
					100: '#FCCCE1',
					200: '#F999C4',
					300: '#F766A6',
					400: '#F43C93',
					500: '#E91477',
					600: '#BA105F',
					700: '#8C0C47',
					800: '#5D082F',
					900: '#2F0418',
				},
				gray: {
					dark: '#202235',
					light: '#F5F7FB',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' },
				},
				'glow': {
					'0%, 100%': { boxShadow: '0 0 10px rgba(34, 255, 247, 0.5)' },
					'50%': { boxShadow: '0 0 20px rgba(34, 255, 247, 0.8)' },
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-slow': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'glow': 'glow 2s infinite',
			},
			backgroundImage: {
				'gradient-primary': 'linear-gradient(to right, #00A3FF, #8F43FF)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
