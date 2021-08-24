import { newE2EPage } from '@stencil/core/testing';

describe('tf-overlay', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<tf-overlay></tf-overlay>');
    const element = await page.find('tf-overlay');
    expect(element).toHaveClass('hydrated');
  });

  it('renders changes to the name data', async () => {
    const page = await newE2EPage();

    await page.setContent('<tf-overlay></tf-overlay>');
    const component = await page.find('tf-overlay');
    const element = await page.find('tf-overlay >>> div');
    expect(element.textContent).toEqual(`Hello, World! I'm `);

    component.setProperty('first', 'James');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James`);

    component.setProperty('last', 'Quincy');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James Quincy`);

    component.setProperty('middle', 'Earl');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James Earl Quincy`);
  });
});
