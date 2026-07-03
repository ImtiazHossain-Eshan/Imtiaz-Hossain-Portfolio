import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";
export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Dynamic OpenGraph card matching the site's dark-observatory aesthetic. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#07080a",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* subtle accent glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 700,
            height: 700,
            background: "radial-gradient(circle at 70% 30%, rgba(124,223,255,0.14), transparent 60%)",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#7cdfff" }}>
          <div style={{ width: 10, height: 10, borderRadius: 10, background: "#7cdfff", display: "flex" }} />
          <span style={{ fontSize: 22, letterSpacing: 4, textTransform: "uppercase", fontFamily: "monospace" }}>
            AI Research Laboratory
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 96, color: "#e9e7e2", fontWeight: 600, letterSpacing: -3, lineHeight: 1 }}>
            {site.name}
          </span>
          <span style={{ fontSize: 34, color: "#99a0ab", marginTop: 20 }}>
            AI Engineer · Computer Vision · NLP · Research
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", color: "#5f6672", fontSize: 22 }}>
          <span>I build intelligent systems.</span>
          <span style={{ fontFamily: "monospace" }}>{clean(site.url)}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

function clean(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
