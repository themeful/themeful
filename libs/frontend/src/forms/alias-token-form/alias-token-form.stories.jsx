export default {
  title: 'Forms/Alias Token Select',
  args: {
    first: 'John',
    middle: 'S',
    last: 'Doe',
  },
}

export const aliasTokenSelect = (args) => {
  return <alias-token-form {...args}></alias-token-form>
}
