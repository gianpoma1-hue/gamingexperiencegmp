"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Rule } from "@/lib/rules/eaFcRules";

export default function RuleAccordion({ rules }: { rules: Rule[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="max-w-5xl mx-auto px-6 pb-24">

      <div className="space-y-5">

        {rules.map((rule, index) => (

          <div
            key={index}
            className={`rounded-2xl border transition-all duration-300 ${
              open === index
                ? "border-red-600 bg-zinc-900"
                : "border-zinc-800 bg-[#111111]"
            }`}
          >

            <button
              onClick={() =>
                setOpen(open === index ? null : index)
              }
              className="w-full flex justify-between items-center px-8 py-6"
            >

              <h2 className="text-xl font-bold text-left">
                {rule.title}
              </h2>

              <ChevronDown
                className={`transition-transform duration-300 ${
                  open === index ? "rotate-180" : ""
                }`}
              />

            </button>

            {open === index && (

              <div className="px-8 pb-8">

                <ul className="space-y-4 text-zinc-300 leading-8">

                  {rule.content.map((item, i) => (

                    <li key={i}>
                      • {item}
                    </li>

                  ))}

                </ul>

              </div>

            )}

          </div>

        ))}

      </div>

    </div>
  );
}