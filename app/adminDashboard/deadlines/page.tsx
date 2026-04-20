import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import EventDeadlinesPage from "@/components/event-deadlines-page";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DeadlinesRoutePage() {
  const session = await verifySession();
  if (!session || session.role != "ADMIN") {
    redirect("/auth/signin");
  }

  return (
    <div className="relative bg-background min-h-screen pt-10">
      <div className="relative z-10">
        <div className="mt-4 justify-center flex flex-col gap-4">
          <div className="max-w-4xl mx-auto p-4 mt-20">
            <h1 className="text-black font-bold text-5xl md:text-5xl xl:text-5xl mb-6">
              Admin: Event Deadlines
            </h1>
            <Link href="/adminDashboard">
                <Button variant="outline">← Back to Dashboard</Button>
            </Link>
          </div>
        </div>
        <EventDeadlinesPage />
      </div>
    </div>
  );
}
