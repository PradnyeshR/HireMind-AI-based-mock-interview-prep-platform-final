import InterviewGenerator from "@/components/InterviewGenerator";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();

  if (!user) return null;

  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-5xl mx-auto">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Generate Your Interview</h3>
        <p className="text-muted-foreground">
          Choose how you want to set up your interview
        </p>
      </div>

      <InterviewGenerator
        user={{
          id: user.id,
          name: user.name,
        }}
      />
    </div>
  );
};

export default Page;
