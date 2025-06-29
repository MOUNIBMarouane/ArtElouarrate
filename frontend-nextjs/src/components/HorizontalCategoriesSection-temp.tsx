"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import { useArtworks } from "@/hooks/useArtworks";
import { getImageUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";

const HorizontalCategoriesSection = () => {
  const router = useRouter();
  // ... rest of the component
