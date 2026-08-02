/*
 * Side-effect CSS imports are erased by the bundler, but TypeScript needs to be
 * told they resolve to nothing rather than being a missing module.
 */
declare module '*.css';
