"use client";
import store from "@/lib/store";
import "./globals.css";
import { Provider } from "react-redux";
import Navbar from "@/components/Layout/NavBar";
import { NAVBAR_HEIGHT_REM } from "@/lib/globals";
import Footer from "@/components/Layout/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <Provider store={store}>
        <body
          className={`w-screen flex flex-col bg-base-200 h-full items-start`}
        >
          <Navbar />

          <div className="flex flex-col w-full items-center h-full z-[0] pt-8">
            <div
              className={`w-full  pt-8`}
              style={{
                minHeight: `calc(100vh - ${NAVBAR_HEIGHT_REM}rem)`,
              }}
            >
              {children}
            </div>
          </div>
          <Footer />
        </body>
      </Provider>
    </html>
  );
}
