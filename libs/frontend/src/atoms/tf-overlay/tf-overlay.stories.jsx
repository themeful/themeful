import { h } from '@stencil/core';

export default {
  title: 'TfOverlay',
  args: {
    first: 'John',
    middle: 'S',
    last: 'Doe',
  },
};

export const Primary = (args) => {
  return <tf-overlay {...args}></tf-overlay>;
};
