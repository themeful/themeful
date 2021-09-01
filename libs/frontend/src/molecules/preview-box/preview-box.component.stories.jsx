
export default {
  title: 'Molecules/Preview Box',
  args: {
    first: 'John',
    middle: 'S',
    last: 'Doe',
  },
}

export const previewBox = (args) => {
  return <tf-preview-box {...args}></tf-preview-box>
}
