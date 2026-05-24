import { redirect } from "next/navigation";

export default async function FeedbackPage({ params }: RouteParams) {
  const { id } = await params;
  redirect(`/feedback/${id}`);
}
