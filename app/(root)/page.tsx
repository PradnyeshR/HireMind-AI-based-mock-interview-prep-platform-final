import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

async function Home() {
  const user = await getCurrentUser();

  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id || ""),
    getLatestInterviews({ userId: user?.id || "" }),
  ]);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice real interview questions & get instant feedback
          </p>

          <div className="flex gap-4 max-sm:flex-col">
            <Button asChild className="btn-primary max-sm:w-full">
              <Link href="/interview">Start Voice Interview</Link>
            </Button>
            <Button asChild className="max-sm:w-full bg-purple-600 hover:bg-purple-700">
              <Link href="/dashboard">Try AI Interview (MongoDB)</Link>
            </Button>
          </div>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Take Interviews</h2>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>There are no interviews available</p>
          )}
        </div>
      </section>
      <section className="flex flex-col gap-6 mt-8 mb-12">
        <h2>Services</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border rounded-xl bg-card text-card-foreground shadow-sm hover:shadow-md transition-all cursor-pointer border-slate-800 bg-slate-900/50">
            <div className="flex flex-col gap-4">
              <div className="p-3 w-fit rounded-lg bg-purple-500/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-purple-500"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M12 18v-6" />
                  <path d="M8 15l4 3 4-3" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  ATS Resume Checker
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  Get detailed feedback on your resume's ATS compatibility and
                  content quality.
                </p>
                <Button
                  asChild
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Link href="/ats-resume">Check Resume</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

export default Home;
