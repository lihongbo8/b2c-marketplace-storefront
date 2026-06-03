export const ProductPostedDate = async ({
  posted,
}: {
  posted: string | null;
}) => {
  const postedDate = posted
    ? new Date(posted).toLocaleDateString("zh-CN")
    : "未记录";

  return (
    <p className='label-md text-secondary'>
      提交：{postedDate}
    </p>
  );
};
