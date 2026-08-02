/*
 * Root barrel.
 *
 * Named re-exports rather than a default namespace object: `export *` stays
 * tree-shakeable, so importing one component does not pull in all twenty-eight.
 * The previous default export forced consumers to write `UI.Button.Button`,
 * which is why the README documented the subpath form instead.
 *
 * There is deliberately no `import "./css/style.css"` here. A side-effect CSS
 * import in the JS entry forces every consumer to have a CSS-capable bundler,
 * which is the single biggest obstacle to using this package outside Next.js.
 * Stylesheets come in explicitly:
 *
 *   import "@operatiemobilisatie/ui/fonts";   // optional, self-hosted webfonts
 *   @import "@operatiemobilisatie/ui/css";    // tokens and utilities
 *
 * Every component is also reachable on its own subpath, e.g.
 * `@operatiemobilisatie/ui/button`, which is what keeps a server component from
 * pulling in a "use client" boundary it does not need.
 */

export * from './components/accordion';
export * as Alert from './components/alert';
export * from './components/alert-dialog';
export * as Avatar from './components/avatar';
export * from './components/badge';
export * from './components/button';
export * as Card from './components/card';
export * from './components/checkbox';
export * from './components/dialog';
export * from './components/dropdown-menu';
export * from './components/icons';
export * from './components/input';
export * from './components/kicker';
export * from './components/label';
export * from './components/logo';
export * from './components/progress';
export * from './components/radio-button';
export * as RadioCards from './components/radio-cards';
export * as RadioGroup from './components/radio-group';
export * from './components/select';
export * from './components/skeleton';
export * from './components/slider';
export * from './components/spinner';
export * from './components/switch';
export * as Tabs from './components/tabs';
export * from './components/textarea';
export * from './components/toast';
export * from './components/toaster';
export * from './components/tooltip';

export * from './lib/utils';
export * from './lib/hooks';
export * from './lib/use-toast';
export * from './lib/ag-grid';
