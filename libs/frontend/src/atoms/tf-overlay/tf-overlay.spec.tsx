import { newSpecPage } from '@stencil/core/testing';
import { TfOverlay } from './tf-overlay';

describe('tf-overlay', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [TfOverlay],
      html: '<tf-overlay></tf-overlay>',
    });
    expect(root).toEqualHtml(`
      <tf-overlay>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </tf-overlay>
    `);
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [TfOverlay],
      html: `<tf-overlay first="Stencil" last="'Don't call me a framework' JS"></tf-overlay>`,
    });
    expect(root).toEqualHtml(`
      <tf-overlay first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </tf-overlay>
    `);
  });
});
