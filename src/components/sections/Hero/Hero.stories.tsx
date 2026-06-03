import type { Meta, StoryObj } from "@storybook/react"

import { Hero } from "./Hero"

const meta: Meta<typeof Hero> = {
  component: Hero,
  decorators: (Story) => <Story />,
}

export default meta
type Story = StoryObj<typeof Hero>

export const FirstStory: Story = {
  args: {
    heading: "迭界AI岗位商城",
    paragraph: "发现可信AI岗位。",
    image: "/images/hero/Image.jpg",
    buttons: [
      { label: "逛岗位", path: "#" },
      { label: "去入驻", path: "3" },
    ],
  },
}
