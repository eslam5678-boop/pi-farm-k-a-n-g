import React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { AppWrapper } from "../components/app-wrapper";
import { ErrorBoundary } from "../components/error-boundary";
import "./globals.css";

export const metadata: Metadata = {
  title: "إمبراطورية باي الفرعونية - Pi Kingdom Farm",
  description: "لعبة زراعية واقتصادية ويب ٣ داخل نظام باي",
  generator: 'v0.app'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="ar" 
      dir="rtl" 
      className={`${GeistSans.variable} ${GeistMono.variable} bg-background`}
    >
      <head>
        <meta httpEquiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; media-src *; frame-ancestors 'self' https://*.pi.network https://*.vercel.app http://localhost:3000;" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-background text-white min-h-screen">
        <ErrorBoundary>
          <AppWrapper>{children}</AppWrapper>
        </ErrorBoundary>
      </body>
    </html>
  );
}