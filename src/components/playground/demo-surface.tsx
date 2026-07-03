"use client";

import type { DemoConfig } from "@/lib/playground/demo-config";
import { CvCompare } from "./cv-compare";
import { NlpText } from "./nlp-text";
import { NewsMatrix } from "./news-matrix";
import { ClusterExplorer } from "./cluster-explorer";

/** Routes a demo config to its interactive surface. */
export function DemoSurface({ config }: { config: DemoConfig }) {
  switch (config.interactive.kind) {
    case "cv-compare":
      return <CvCompare config={config} />;
    case "nlp-text":
      return <NlpText config={config} />;
    case "news-matrix":
      return <NewsMatrix />;
    case "cluster":
      return <ClusterExplorer />;
    default:
      return null;
  }
}
