export default {
  title: 'Forms/Client Value',
  args: {
    first: 'John',
    middle: 'S',
    last: 'Doe',
  },
}

export const clientValue = (args) => {
  return <client-value-form {...args}></client-value-form>
}
