export const UserMessagesSection = () => {
  return (
    <div className="max-w-[760px] rounded-sm border p-6" data-testid="user-messages-safe-summary">
      <h2 className="heading-sm uppercase text-primary">记录摘要</h2>
      <p className="mt-3 label-md text-secondary">
        执行记录仅显示授权调用、费用关联和变更状态摘要。
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-sm bg-action-secondary p-4">
          <p className="label-sm text-secondary">授权调用</p>
          <p className="mt-1 label-lg text-primary">待同步</p>
        </div>
        <div className="rounded-sm bg-action-secondary p-4">
          <p className="label-sm text-secondary">费用关联</p>
          <p className="mt-1 label-lg text-primary">待同步</p>
        </div>
        <div className="rounded-sm bg-action-secondary p-4">
          <p className="label-sm text-secondary">变更状态</p>
          <p className="mt-1 label-lg text-primary">待同步</p>
        </div>
      </div>
      <p className="mt-4 label-sm text-secondary">
        内部敏感内容不会在这里展示。
      </p>
    </div>
  )
}
