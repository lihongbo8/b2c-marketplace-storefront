import { Button } from "@/components/atoms/Button/Button"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { UserNavigation } from "@/components/molecules/UserNavigation/UserNavigation"

export default async function RequestSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <main className="container">
      <div className="grid grid-cols-1 md:grid-cols-4 mt-6 gap-5 md:gap-8">
        <UserNavigation />
        <div className="md:col-span-3 text-center">
          <h1 className="heading-md uppercase">变更待确认</h1>
          <p className="label-md text-secondary w-96 mx-auto my-8">
            变更申请已准备好，等待人工确认后再处理。
          </p>
          <LocalizedClientLink href={`/user/returns${id && `?return=${id}`}`}>
            <Button className="label-md uppercase px-12 py-3">
              查看详情
            </Button>
          </LocalizedClientLink>
        </div>
      </div>
    </main>
  )
}
