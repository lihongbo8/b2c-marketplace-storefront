export const steps = ["已接收", "处理中", "已生效", "已完成"]

export const parcelStatuses = (
  order: "not_fulfilled" | "fulfilled" | "delivered" | "shipped"
) => {
  switch (order) {
    case "not_fulfilled":
      return 0
    case "fulfilled":
      return 1
    case "delivered":
      return 3
    case "shipped":
      return 2
    default:
      return 0
  }
}
