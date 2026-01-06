"use client";

import Link from "next/link";
import type { Tool } from "@/lib/tools-catalog";
import { track } from "@/lib/analytics";
import { ToolLink } from "@/lib/tools";

function trackToolClick(tool: Tool) {
  track({
    event: "blog_click_tool",
    nav_item: tool.id,
    nav_path: tool.href,
    nav_label: tool.label,
  });
}

export function RelatedTools({
  tools,
  title = "Ferramentas relacionadas",
}: {
  tools: ToolLink[];
  title?: string;
}) {
  if (!tools?.length) return null;

  return (
    <section className="mt-10 rounded-2xl border bg-white/40 p-5 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            onClick={() => trackToolClick(t.href as unknown as Tool)}
            className="rounded-xl border bg-white/60 px-4 py-3 text-sm underline transition hover:bg-white"
          >
            {t.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
