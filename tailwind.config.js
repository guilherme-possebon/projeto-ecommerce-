/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#4442f6',
        hightlight: '#eae8fb',
        bgGray: '#fbfafb',
        // -----------DarkMode--------------
        textDarkMode1: '#f0f', // text-black
        textDarkMode2: '#f0f', // text-white
        textDarkMode3: '#f0f', // text-blue-900
        textDarkMode4: '#f0f', // text-blue-600
        textDarkMode5: '#f0f', // text-blue-700
        textDarkMode6: '#f0f', // text-slate-500
        bgDarkMode1: '#f0f', // bg-blue-900
        bgDarkMode2: '#f0f', // bg-blue-100
        bgDarkMode3: '#f0f', // bg-red-800
        bgDarkMode4: '#f0f', // bg-red-500
        bgDarkMode5: '#f0f', // bg-red-600
        bgDarkMode6: '#f0f', // bg-red-700
        bgDarkMode7: '#f0f', // bg-gray-600
        bgDarkMode8: '#f0f', // bg-violet-50
        bgDarkMode9: '#f0f', // bg-violet-300
        bgDarkMode10: '#f0f', // bg-green-500
        bgDarkMode11: '#f0f', // bg-green-600
        bgDarkMode12: '#f0f' // bg-green-700
      }
    }
  },
  plugins: []
}
