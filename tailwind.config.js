/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)', // UKPN light gray
        input: 'var(--color-input)', // white
        ring: 'var(--color-ring)', // UKPN deep red
        background: 'var(--color-background)', // white
        foreground: 'var(--color-foreground)', // black
        primary: {
          DEFAULT: 'var(--color-primary)', // UKPN deep red #A60B0B
          foreground: 'var(--color-primary-foreground)', // white
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', // UKPN light gray #F4F4F4
          foreground: 'var(--color-secondary-foreground)', // black
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', // UKPN deep red
          foreground: 'var(--color-destructive-foreground)', // white
        },
        muted: {
          DEFAULT: 'var(--color-muted)', // UKPN light gray #F4F4F4
          foreground: 'var(--color-muted-foreground)', // medium gray
        },
        accent: {
          DEFAULT: 'var(--color-accent)', // UKPN orange #FF9900
          foreground: 'var(--color-accent-foreground)', // black
        },
        popover: {
          DEFAULT: 'var(--color-popover)', // white
          foreground: 'var(--color-popover-foreground)', // black
        },
        card: {
          DEFAULT: 'var(--color-card)', // white
          foreground: 'var(--color-card-foreground)', // black
        },
        success: {
          DEFAULT: 'var(--color-success)', // green for success
          foreground: 'var(--color-success-foreground)', // white
        },
        warning: {
          DEFAULT: 'var(--color-warning)', // UKPN orange variant #F2994B
          foreground: 'var(--color-warning-foreground)', // black
        },
        error: {
          DEFAULT: 'var(--color-error)', // UKPN deep red
          foreground: 'var(--color-error-foreground)', // white
        },
        surface: 'var(--color-surface)', // white
        'text-primary': 'var(--color-text-primary)', // black
        'text-secondary': 'var(--color-text-secondary)', // gray
        // UKPN specific colors
        'ukpn-red': 'var(--color-ukpn-red)', // #A60B0B
        'ukpn-orange': 'var(--color-ukpn-orange)', // #FF9900
        'ukpn-orange-alt': 'var(--color-ukpn-orange-alt)', // #F2994B
        'ukpn-gray-light': 'var(--color-ukpn-gray-light)', // #F4F4F4
        'ukpn-gray-medium': 'var(--color-ukpn-gray-medium)', // #EAEAEA
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      borderRadius: {
        lg: '8px',
        md: '6px',
        sm: '4px',
      },
      boxShadow: {
        'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'elevation-2': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      transitionDuration: {
        '200': '200ms',
        '150': '150ms',
      },
      transitionTimingFunction: {
        'ease-out': 'ease-out',
        'ease-in-out': 'ease-in-out',
      },
      zIndex: {
        'navigation': '1000',
        'dropdown': '1010',
        'floating': '1020',
        'modal': '1030',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}