export default {
  title: 'Forms/Theme',
  args: {
    first: 'John',
    middle: 'S',
    last: 'Doe',
  },
}

export const theme = (args) => {
  return <theme-form {...args}></theme-form>
}
