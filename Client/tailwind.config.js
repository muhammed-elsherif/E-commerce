/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}",
  "./pages/**/*.{html,js,jsx,ts,tsx}",
  "./components/**/*.{html,js,jsx,ts,tsx}",
];
export const darkMode = "class";
export const theme = {
  extend: {},
};
export const plugins = [
  // require('@tailwindcss/forms'),
  require("tailwindcss"),
  require("autoprefixer"),
  // require('@tailwindcss/aspect-ratio'),
];
