import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import AdminDashboardPanel from "@/components/admin-dashboard-panel";

// import DataTableSkeleton from "@/components/register/data-table-skeleton";

export default async function Page() {
  const session = await verifySession();
  if (!session || session.role != "ADMIN") {
    redirect("/auth/signin");
  }

  return (
    <div className="relative bg-background min-h-screen pt-10">
      {/* Watermark */}

      {/* Main Content */}
      <div className="relative z-10">
        <div className="mt-4 justify-center flex flex-col gap-4">
          <div className="max-w-4xl mx-auto p-4 mt-20">
            <h1 className="text-black font-bold text-5xl md:text-5xl xl:text-5xl mb-6">
              Admin: All registrants
            </h1>
          </div>
        </div>
        <div className="flex justify-center mt-4 gap-4 mb-3 flex-wrap">
          {/* Additional buttons can be placed here if needed */}
        </div>
        <AdminDashboardPanel />
      </div>
    </div>
  );
}
