/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-secondary-fixed-variant": "#574500",
        "primary": "#006b5f",
        "on-primary-fixed-variant": "#005047",
        "error": "#ba1a1a",
        "on-primary": "#ffffff",
        "on-tertiary-container": "#912038",
        "primary-fixed": "#62fae3",
        "surface-dim": "#ccdbf3",
        "error-container": "#ffdad6",
        "surface-container-lowest": "#ffffff",
        "outline": "#6b7a76",
        "surface-bright": "#f8f9ff",
        "on-secondary-container": "#6f5900",
        "inverse-surface": "#233144",
        "on-secondary": "#ffffff",
        "inverse-on-surface": "#eaf1ff",
        "tertiary": "#a93349",
        "on-surface": "#0d1c2e",
        "surface-container-low": "#eff4ff",
        "on-background": "#0d1c2e",
        "surface-container-highest": "#d5e3fc",
        "tertiary-fixed-dim": "#ffb2b9",
        "on-tertiary-fixed": "#400010",
        "on-error-container": "#93000a",
        "on-surface-variant": "#3c4a46",
        "on-tertiary-fixed-variant": "#891933",
        "on-secondary-fixed": "#231b00",
        "secondary": "#735c00",
        "surface": "#f8f9ff",
        "secondary-fixed-dim": "#eec200",
        "inverse-primary": "#3cddc7",
        "surface-variant": "#d5e3fc",
        "tertiary-fixed": "#ffdadc",
        "tertiary-container": "#ffa5ae",
        "on-primary-container": "#00574d",
        "primary-fixed-dim": "#3cddc7",
        "surface-tint": "#006b5f",
        "secondary-fixed": "#ffe083",
        "surface-container-high": "#dce9ff",
        "on-tertiary": "#ffffff",
        "on-error": "#ffffff",
        "primary-container": "#2dd4bf",
        "secondary-container": "#fed01b",
        "background": "#f8f9ff",
        "on-primary-fixed": "#00201c",
        "outline-variant": "#bacac5",
        "surface-container": "#e6eeff"
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px"
      },
      spacing: {
        "xs": "4px",
        "lg": "32px",
        "xl": "48px",
        "md": "20px",
        "chat-gap": "12px",
        "sm": "12px",
        "container-max": "1200px",
        "container-chat": "800px",
        "base": "8px"
      },
      fontFamily: {
        "label-md": ["Quicksand"],
        "body-lg": ["Nunito Sans"],
        "label-sm": ["Quicksand"],
        "headline-md": ["Quicksand"],
        "headline-lg-mobile": ["Quicksand"],
        "body-md": ["Nunito Sans"],
        "headline-lg": ["Quicksand"]
      },
      fontSize: {
        "label-md": ["14px", {"lineHeight": "20px", "fontWeight": "700"}],
        "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
        "label-sm": ["12px", {"lineHeight": "16px", "fontWeight": "500"}],
        "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
        "headline-lg-mobile": ["26px", {"lineHeight": "32px", "fontWeight": "700"}],
        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
        "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700"}]
      },
      keyframes: {
        scan: {
          '0%, 100%': { top: '5%' },
          '50%': { top: '95%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        scan: 'scan 3s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
