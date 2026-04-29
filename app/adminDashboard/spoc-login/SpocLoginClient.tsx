"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { LoadingButton } from "@/components/LoadingButton";
import { useAuthContext } from "@/contexts/auth-context";

interface Spoc {
  id: string;
  collegeName: string;
  deptCode: string;
  email: string;
}

interface SpocLoginClientProps {
  spocs: Spoc[];
}

export default function SpocLoginClient({ spocs }: SpocLoginClientProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { setIsLoggedIn } = useAuthContext();

  const handleSpocLogin = async (spoc: Spoc) => {
    setLoadingId(spoc.id);
    try {
      const response = await axios.post("/api/admin/spoc-login", {
        email: spoc.email,
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success(`Logged in as SPOC for ${spoc.collegeName}`, {
          description: "Opened SPOC interface in a new tab.",
        });

        // Open the SPOC portal in a new tab
        window.open("/register/firstEventSelection", "_blank");
      } else {
        toast.error("Failed to login", {
          description: response.data.message,
        });
      }
    } catch (error: any) {
      toast.error("An error occurred", {
        description: error.response?.data?.message || "Server error",
      });
      console.error(error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {spocs.length === 0 ? (
        <div className="col-span-full text-center text-muted-foreground p-8">
          No SPOCs found in the database.
        </div>
      ) : (
        spocs.map((spoc) => (
          <div
            key={spoc.id}
            className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <h3 className="font-bold text-xl mb-1 text-card-foreground">
                {spoc.collegeName}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Code: {spoc.deptCode}
              </p>
              <p className="text-xs text-muted-foreground mb-6 truncate">
                {spoc.email}
              </p>
            </div>
            <LoadingButton
              loading={loadingId === spoc.id}
              onClick={() => handleSpocLogin(spoc)}
              className="w-full"
            >
              Login as SPOC
            </LoadingButton>
          </div>
        ))
      )}
    </div>
  );
}
