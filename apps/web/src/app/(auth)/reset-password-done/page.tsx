"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function ResetPasswordDonePage() {
  return (
    <div className="w-full text-center">
      <div className="mb-8 flex justify-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-16 h-16 text-green-500" strokeWidth={2.5} />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-4">Reset Successfully</h2>

      <p className="text-gray-600 mb-8 max-w-sm mx-auto">
        Your Up Craft Crew log in password has been updated successfully
      </p>

      <Link href="/sign-in">
        <Button className="w-full h-12 bg-[#FF8E29] hover:bg-[#FF6B00] text-white font-medium rounded-full transition-colors">
          Continue to login
        </Button>
      </Link>
    </div>
  );
}
