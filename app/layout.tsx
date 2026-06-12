import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content="6a2bc5740cfd412b2ab2c317" />
        <meta
          name="talentapp:project_verification"
          content="81eab19fc7f17d4374463a202f2c6ae2960c83fe0064990a105323f9f6d6ab03b2852a2b607f0cff9e14832c667fc3abc0cec2db3d79d4447e61bfc85e9891c9"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
