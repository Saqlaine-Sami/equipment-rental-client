"use client";

import { useEffect, useState } from "react";

export default function CurrentYear() {
  const [year, setYear] = useState("");

  // ব্রাউজারে লোড হওয়ার পরেই বছর বসবে
  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);

  return <span>{year}</span>;
}