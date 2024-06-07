# OM/UI
A collection of [React](https://react.dev/) components for OM websites and applications, most components are build on [Radix/UI](https://radix-ui.com/). It uses [TailwindCSS](https://tailwindcss.com/) and therefore also exports a `tailwind.config.js` preset, configured with all the official OM colors. As most projects are build using [Next.js](https://nextjs.org/) this library will be fully compatible with it. This library also has [TypeScript](https://www.typescriptlang.org/) support.

## Usage
Make sure you've imported the OM/UI styles into your `globals.css` or `main.css`:
```css
// app/globals.css

@import "@operatiemobilisatie/ui/css";
```

Add the OM/UI Tailwind preset to your `tailwind.config.js` and include the library as content:
```js
// tailwind.config.js

import tailwindPreset from "@operatiemobilisatie/ui/tailwindcss";

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    tailwindPreset // OM/UI Tailwind Preset here
  ],
  content: [
    "./node_modules/@operatiemobilisatie/ui/src/**/*.{js,jsx,ts,tsx}" // Define as content like so
  ],
  theme: {
    extend: {},
  }
}
```

Only thing now is to simply import the component and use it!
```js
// app/page.js

import { Button } from '@operatiemobilisatie/ui/button';

export default function Page() {
  return (
      <Button variant="primary" size="lg">God is love!</Button>
  );
}

```

## To Do
- [ ] Publish to NPM
- [ ] Add documentation
