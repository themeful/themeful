export default {
  title: 'Forms/Theme Value',
  args: {
    first: 'John',
    middle: 'S',
    last: 'Doe',
  },
}

export const themeValue = (args) => {
  return <theme-value-form {...args}></theme-value-form>
}
