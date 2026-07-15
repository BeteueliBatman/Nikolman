import { ImageResponse } from "next/og";

export const alt = "Nikolman — Building the Future";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#111111",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: 22,
            height: "100%",
            display: "flex",
            background: "#e30613",
          }}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px 82px 66px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                display: "flex",
                background: "#e30613",
              }}
            />
            Nikolman
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                color: "#e30613",
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 4,
                textTransform: "uppercase",
              }}
            >
              Nikolman Companies
            </div>
            <div
              style={{
                display: "flex",
                maxWidth: 900,
                marginTop: 18,
                fontSize: 76,
                fontWeight: 900,
                lineHeight: 0.98,
                letterSpacing: -3,
                textTransform: "uppercase",
              }}
            >
              Building the future
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 24,
              borderTop: "1px solid rgba(255,255,255,0.24)",
              color: "rgba(255,255,255,0.62)",
              fontSize: 20,
            }}
          >
            <span>Nikolman</span>
            <span>Nikolman Companies</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
