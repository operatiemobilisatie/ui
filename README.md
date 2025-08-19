# OM/UI
A collection of [React](https://react.dev/) components for OM websites and applications, most components are build on [Radix/UI](https://radix-ui.com/). It uses [TailwindCSS](https://tailwindcss.com/) and therefore also exports a `tailwind.config.js` preset, configured with all the official OM colors. As most projects are build using [Next.js](https://nextjs.org/) this library will be fully compatible with it. This library also has [TypeScript](https://www.typescriptlang.org/) support.

## Storybook
You can view the available components in Storybook [here](https://operatiemobilisatie.github.io/ui/).

## Versions
Major versions are not backwards compatible and are for now reserverd for Tailwindcss upgrades.
- **Tailwind v3**
  ```bash
  npm i @operatiemobilisatie/ui@1.x.x 
  ```
- **Tailwind v4**
  ```bash
  npm i @operatiemobilisatie/ui@latest
  ```

## Usage
Make sure you've imported the OM/UI styles into your `globals.css` or `main.css`:
```css
/* app/globals.css */
@import "tailwindcss";
@import "@operatiemobilisatie/ui/css";
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
