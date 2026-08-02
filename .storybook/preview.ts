import type { Preview } from '@storybook/react-vite';
import { addons } from 'storybook/preview-api';
import { STORY_CHANGED, STORY_RENDERED } from 'storybook/internal/core-events';
import './storybook.css';
import '../src/fonts/index.css';

/*
 * Deterministic "this story is painted" signal for the Playwright suite.
 *
 * STORY_RENDERED fires *after* the story's play() function resolves, so stories
 * that open a popup are fully settled by the time the flag appears. Polling the
 * DOM instead would screenshot the pre-interaction frame.
 */
const channel = addons.getChannel();
channel.on(STORY_RENDERED, () => {
  document.documentElement.dataset.sbRendered = 'true';
});
channel.on(STORY_CHANGED, () => {
  delete document.documentElement.dataset.sbRendered;
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: { order: ['Form', 'Data Display', 'Feedback'] },
    },
  },
};

export default preview;
