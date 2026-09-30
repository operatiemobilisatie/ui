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
 *
 * ---
 *
 * The "use client" policy, which the `export * as X` lines below depend on:
 *
 * A module carries the directive only if it *calls a React hook itself*. That
 * is five files -- components/progress, components/select, components/toaster,
 * internal/dialog-popup, lib/hooks -- and nothing else.
 *
 * The reason is `export * as X`. Under rolldown's unbundle mode the namespace
 * object for `X` is constructed inside the module it re-exports, so when that
 * module is a client module the whole object is what crosses the RSC boundary:
 * a server component sees one opaque client reference, `Object.keys()` returns
 * `[]`, every part reads back `undefined`, and rendering one fails with
 * "Element type is invalid ... but got: undefined". Accordion, AlertDialog,
 * Avatar, Slider and Toast all did exactly that until the directives came off.
 *
 * Taking them off is safe because the boundary is already drawn one level down:
 * every Base UI part file ships its own "use client", and Base UI's own barrels
 * are directive-free for precisely this reason. A wrapper that only renders
 * those parts and calls no hook of its own evaluates fine on the server, and
 * each part it re-exports arrives as its own client reference.
 *
 * So: adding a hook to any component file means adding the directive, and if
 * that file backs an `export * as`, the hook belongs in a separate client
 * module instead -- which is what `internal/dialog-popup` is.
 */

export * as Accordion from './components/accordion';
export * as Alert from './components/alert';
export * as AlertDialog from './components/alert-dialog';
export * as Avatar from './components/avatar';
export * from './components/badge';
export * from './components/button';
export * as Card from './components/card';
export * from './components/checkbox';
export * as Dialog from './components/dialog';
export * as DropdownMenu from './components/dropdown-menu';
export * from './components/icons';
export * from './components/input';
export * from './components/kicker';
export * from './components/label';
export * from './components/logo';
export * as Navigation from './components/navigation';
export * from './components/progress';
export * from './components/radio-button';
export * as RadioCards from './components/radio-cards';
export * as RadioGroup from './components/radio-group';
export * from './components/select';
export * from './components/skeleton';
export * as Slider from './components/slider';
export * from './components/spinner';
export * from './components/switch';
export * as Tabs from './components/tabs';
export * from './components/textarea';
export * as Toast from './components/toast';
export * from './components/toaster';
export * as Tooltip from './components/tooltip';

export * from './lib/utils';
export * from './lib/hooks';
export * from './lib/ag-grid';
