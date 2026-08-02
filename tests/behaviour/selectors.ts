/*
 * DOM selectors for the Base UI parts under test, kept in one place because
 * Base UI's emitted markup is an implementation detail that a version bump can
 * move. Every one of these was read off the real build rather than guessed.
 *
 * Where a role exists it is preferred over a class, because roles are part of
 * the component's contract and class strings are not. The two exceptions are
 * the dialog and alert-dialog backdrops: Base UI renders *two* presentational
 * divs inside the portal -- an internal pointer-blocking layer and the Backdrop
 * part this library styles -- and only the class tells them apart.
 */

export const PORTAL = '[data-base-ui-portal]';

/*
 * Tooltip Positioner and Popup both carry data-side (that duplication is
 * deliberate in Base UI, so side-aware styling can live on either), so the popup
 * is identified as the nested one.
 */
export const TOOLTIP_POPUP = `${PORTAL} > div[data-side] > div[data-side]`;

export const MENU_POPUP = '[role="menu"]';
export const MENU_ITEM = '[role="menuitem"]';

export const DIALOG_POPUP = '[role="dialog"]:not([aria-modal="false"])';
export const DIALOG_BACKDROP = `${PORTAL} > [role="presentation"][class*="bg-black/80"]`;
export const ALERT_DIALOG_POPUP = '[role="alertdialog"]';

/* Toast.Root is a role="dialog" with aria-modal="false"; the Viewport is the live region. */
export const TOAST = '[role="dialog"][aria-modal="false"]';
export const TOAST_VIEWPORT = '[role="region"][aria-label="Notifications"]';

/*
 * Accordion.Item is a direct child of Root, which is the story's only root
 * element. Anchoring at #storybook-root matters because the Header and the
 * Trigger repeat data-index, so a bare [data-index="0"] matches three elements.
 */
export const accordionItem = (index: number) => `#storybook-root > div > div[data-index="${index}"]`;
export const accordionTrigger = (index: number) => `${accordionItem(index)} > h3 > button`;
export const accordionPanel = (index: number) => `${accordionItem(index)} > [role="region"]`;
export const accordionChevron = (index: number) => `${accordionTrigger(index)} > svg`;

export const SLIDER_CONTROL = '[data-base-ui-slider-control]';
/* The Track is the Control's only child without a data-index; the Thumb has one. */
export const SLIDER_TRACK = `${SLIDER_CONTROL} > div[data-orientation]:not([data-index])`;
export const SLIDER_THUMB = `${SLIDER_CONTROL} > div[data-index="0"]`;
export const SLIDER_INPUT = 'input[type="range"]';
