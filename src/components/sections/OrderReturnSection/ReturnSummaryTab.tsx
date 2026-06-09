import { Button, Card } from "@/components/atoms"
import { convertToLocale } from "@/lib/helpers/money"
import Image from "next/image"
import { useState } from "react"

export const ReturnSummaryTab = ({
  selectedItems,
  items,
  currency_code,
  handleTabChange,
  tab,
  returnMethod,
}: {
  selectedItems: any[]
  items: any[]
  currency_code: string
  handleTabChange: (tab: number) => void
  tab: number
  returnMethod: any
}) => {
  const [pendingConfirmation, setPendingConfirmation] = useState(false)
  const selected = items.filter((item) =>
    selectedItems.some((i) => i.line_item_id === item.id)
  )

  const subtotal = selected.reduce((acc, item) => {
    return acc + item.subtotal
  }, 0)

  return (
    <div className="sm:mt-20">
      {selected.length ? (
        <Card className="p-4">
          <ul>
            {selected.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-2 mb-4 justify-between w-full"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <div className="w-16 rounded-sm border">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.subtitle}
                        width={64}
                        height={64}
                        className="rounded-sm"
                      />
                    ) : (
                      <Image
                        src={"/images/placeholder.svg"}
                        alt={item.subtitle}
                        width={64}
                        height={64}
                        className="opacity-25 scale-75"
                      />
                    )}
                  </div>
                  {item.subtitle}
                </div>
                <div>
                  {convertToLocale({ amount: item.subtotal, currency_code })}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <Card className="p-4">
        <p className="label-md flex justify-between mb-4">
          变更金额:
          <span className="label-md !font-bold text-primary">
            {convertToLocale({
              amount: subtotal,
              currency_code,
            })}
          </span>
        </p>
        <Button
          className="label-md w-full uppercase"
          disabled={
            (tab === 0 && !selected.length) ||
            (tab === 1 && (!returnMethod || pendingConfirmation))
          }
          onClick={
            tab === 0
              ? () => {
                  setPendingConfirmation(false)
                  handleTabChange(1)
                }
              : () => setPendingConfirmation(true)
          }
        >
          {tab === 0
            ? selected.length
              ? "继续"
              : "选择项目"
            : !returnMethod
            ? "选择方式"
            : pendingConfirmation
              ? "等待人工确认"
              : "准备确认"}
        </Button>
        {pendingConfirmation && tab === 1 ? (
          <div className="mt-3 rounded-sm bg-action-secondary px-3 py-2">
            <p className="label-md text-primary">变更申请已准备好</p>
            <p className="label-sm text-secondary">
              当前仅停留在确认态，人工确认前不会自动提交。
            </p>
          </div>
        ) : null}
      </Card>
    </div>
  )
}
