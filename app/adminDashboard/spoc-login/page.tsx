import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SpocLoginClient from "./SpocLoginClient";

export default async function SpocLoginPage() {
  const session = await verifySession();
  if (!session || session.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  // Fetch all SPOC users from the DB
  const spocs = await prisma.users.findMany({
    where: {
      role: "SPOC",
    },
    select: {
      id: true,
      collegeName: true,
      deptCode: true,
      email: true,
    },
    orderBy: {
      deptCode: "asc",
    },
  });

  return (
    <div className="relative bg-background min-h-screen pt-10">
      <div className="relative z-10">
        <div className="mt-4 justify-center flex flex-col gap-4">
          <div className="max-w-4xl mx-auto p-4 mt-20 text-center">
            <h1 className="text-black font-bold text-4xl md:text-5xl xl:text-5xl mb-6">
              Department SPOC Login
            </h1>
            <p className="text-muted-foreground mb-8">
              Select a department below to login as their SPOC and view their interface.
            </p>
            <div className="flex justify-center mb-8">
              <Link href="/adminDashboard">
                <Button variant="outline">Back to Admin Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4">
          <SpocLoginClient spocs={spocs} />
        </div>
      </div>
    </div>
  );
}
