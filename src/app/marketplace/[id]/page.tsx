"use client";


"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle, MapPin, MessageSquare, Shield, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ServicePackage, ServiceReview } from "@/lib/types";
import { useDealRead, useDealMilestones, usePlatformFee } from "@/lib/contracts/useEscrowRead";
import { useAccount } from "wagmi";

function ReviewCard({ review }: { review: ServiceReview }) {
  return (
    <div className="border-b pb-4 mb-4">
      <div className="flex items-center gap-3 mb-1">
        <span className="font-semibold">{review.reviewerName}</span>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString("id-ID")}</span>
      </div>
      <Footer />
    </div>
  );
// End of ReviewCard
}
