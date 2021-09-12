export default {
  title: 'Forms/Design Token',
  args: {
    first: 'John',
    middle: 'S',
    last: 'Doe',
  },
}

export const designToken = (args) => {
  return <design-token-form {...args}></design-token-form>
}
