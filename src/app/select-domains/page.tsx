"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const DOMAINS = ["AI", "Space", "Biotech", "Robotics", "Tech", "Science"];

export default function SelectDomains() {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const toggleDomain = (domain: string) => {
    setSelected((prev) =>
      prev.includes(domain)
        ? prev.filter((d) => d !== domain)
        : prev.length < 5
        ? [...prev, domain]
        : prev
    );
  };

  const savePreferences = async () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user?.id) {
    alert("User not found");
    return;
  }

  await setDoc(doc(db, "userPreferences", user.id), {
    userId: user.id,
    domains: selected,
  });
  localStorage.setItem("domains", JSON.stringify(selected));

  console.log("✅ Preferences Saved:", selected);

  router.push("/");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center text-white">
      <h1 className="text-3xl mb-6">Select Your Interests</h1>

      <div className="flex flex-wrap gap-3 justify-center max-w-xl">
        {DOMAINS.map((domain) => (
          <button
            key={domain}
            onClick={() => toggleDomain(domain)}
            className={`px-4 py-2 rounded ${
              selected.includes(domain)
                ? "bg-blue-500"
                : "bg-white/20"
            }`}
          >
            {domain}
          </button>
        ))}
      </div>

      <button
        className="mt-6 bg-green-500 px-6 py-2 rounded"
        onClick={savePreferences}
      >
        Save
      </button>
    </div>
  );
}