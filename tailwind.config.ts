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
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					hover: 'hsl(var(--primary-hover))',
					active: 'hsl(var(--primary-active))',
					disabled: 'hsl(var(--primary-disabled))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					hover: 'hsl(var(--secondary-hover))',
					active: 'hsl(var(--secondary-active))',
					disabled: 'hsl(var(--secondary-disabled))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
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
				},
				brand: {
					DEFAULT: 'hsl(var(--brand))',
					foreground: 'hsl(var(--brand-foreground))',
					primary: '#7C3AED',
					'primary-hover': '#6D28D9',
					'primary-active': '#5B21B6',
					'primary-disabled': '#A78BFA',
					secondary: '#EC4899',
					'secondary-hover': '#DB2777',
					'secondary-active': '#BE185D',
					'secondary-disabled': '#F9A8D4',
					purple: '#7C3AED',
					pink: '#EC4899',
					blue: '#3B82F6',
					green: '#10B981',
					yellow: '#F59E0B',
					red: '#EF4444',
					orange: '#FB8500',
					gray: {
						50: '#F8FAFC',
						100: '#F1F5F9',
						200: '#E2E8F0',
						300: '#CBD5E1',
						400: '#94A3B8',
						500: '#64748B',
						600: '#475569',
						700: '#334155',
						800: '#1E293B',
						900: '#0F172A',
					}
				},
				status: {
					success: '#10B981',
					'success-light': '#D1FAE5',
					error: '#EF4444',
					'error-light': '#FEE2E2',
					warning: '#F59E0B',
					'warning-light': '#FEF3C7',
					info: '#3B82F6',
					'info-light': '#DBEAFE'
				},
				social: {
					instagram: '#E1306C',
					facebook: '#1877F2',
					twitter: '#1DA1F2',
					youtube: '#FF0000',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' },
				},
				'fade-out': {
					from: { opacity: '1' },
					to: { opacity: '0' },
				},
				'slide-in-right': {
					from: { transform: 'translateX(100%)' },
					to: { transform: 'translateX(0)' },
				},
				'slide-out-left': {
					from: { transform: 'translateX(0)' },
					to: { transform: 'translateX(-100%)' },
				},
				'slide-up': {
					from: { transform: 'translateY(10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' },
				},
				'slide-down': {
					from: { transform: 'translateY(-10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' },
				},
				'scale-in': {
					from: { transform: 'scale(0.95)', opacity: '0' },
					to: { transform: 'scale(1)', opacity: '1' },
				},
				'scale-out': {
					from: { transform: 'scale(1)', opacity: '1' },
					to: { transform: 'scale(0.95)', opacity: '0' },
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' },
				},
				'appear': {
					'0%': { 
						opacity: '0', 
						transform: 'translateY(10px)' 
					},
					'100%': { 
						opacity: '1', 
						transform: 'translateY(0)' 
					},
				},
				'appear-zoom': {
					'0%': { 
						opacity: '0', 
						transform: 'scale(0.98)' 
					},
					'100%': { 
						opacity: '1', 
						transform: 'scale(1)' 
					},
				},
				'fadeInUp': {
					'0%': { 
						opacity: '0', 
						transform: 'translateY(30px)' 
					},
					'100%': { 
						opacity: '1', 
						transform: 'translateY(0)' 
					},
				},
				'fadeInLeft': {
					'0%': { 
						opacity: '0', 
						transform: 'translateX(-30px)' 
					},
					'100%': { 
						opacity: '1', 
						transform: 'translateX(0)' 
					},
				},
				'fadeInRight': {
					'0%': { 
						opacity: '0', 
						transform: 'translateX(30px)' 
					},
					'100%': { 
						opacity: '1', 
						transform: 'translateX(0)' 
					},
				},
				'fadeInScale': {
					'0%': { 
						opacity: '0', 
						transform: 'scale(0.9)' 
					},
					'100%': { 
						opacity: '1', 
						transform: 'scale(1)' 
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-out-left': 'slide-out-left 0.3s ease-out',
				'slide-up': 'slide-up 0.3s ease-out',
				'slide-down': 'slide-down 0.3s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'scale-out': 'scale-out 0.3s ease-out',
				'pulse-slow': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'appear': 'appear 0.5s ease-out forwards',
				'appear-zoom': 'appear-zoom 0.8s ease-out forwards',
				'fadeInUp': 'fadeInUp 0.7s ease-out forwards',
				'fadeInLeft': 'fadeInLeft 0.7s ease-out forwards',
				'fadeInRight': 'fadeInRight 0.7s ease-out forwards',
				'fadeInScale': 'fadeInScale 0.7s ease-out forwards',
			},
			transitionProperty: {
				'height': 'height',
				'spacing': 'margin, padding',
				'width': 'width',
				'position': 'top, right, bottom, left',
			},
			transitionTimingFunction: {
				'bounce-start': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
				'bounce-end': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
			},
			transitionDuration: {
				'fast': '150ms',
				'normal': '250ms',
				'slow': '350ms',
				'slower': '500ms',
				'slowest': '700ms',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
