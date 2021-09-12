export default {
  title: 'Forms/Client',
  args: {
    first: 'John',
    middle: 'S',
    last: 'Doe',
  },
}

export const client = (args) => {
  return <client-form {...args}></client-form>
}
