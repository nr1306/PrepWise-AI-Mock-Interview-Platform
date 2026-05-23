import InterviewForm from "@/components/InterviewForm";

const Page = async () => {
  return (
    <>
      <h3>Generate an Interview</h3>
      <p className="text-light-100 mb-2">
        Fill in the details below and we&apos;ll generate a personalised interview for you.
      </p>
      <InterviewForm />
    </>
  );
};

export default Page;
