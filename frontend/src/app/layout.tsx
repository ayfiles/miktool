"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      {/* Body Background: #171717 (Standard)
         Overflow-hidden wichtig für das Inset-Layout 
      */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground overflow-hidden`}>
        
        {isLoginPage ? (
          // ✅ UPDATE: Login Page hat jetzt explizit bg-[#0A0A0A]
          <main className="min-h-screen w-full flex items-center justify-center overflow-y-auto bg-[#0A0A0A]">
             {children}
             <Toaster />
          </main>
        ) : (
          <SidebarProvider>
            <AppSidebar variant="inset" />
            
            <SidebarInset 
              className="
                m-2 md:m-3
                rounded-xl
                bg-[#0A0A0A]                 /* Main Card im Dashboard auch #0A0A0A */
                border border-border
                shadow-sm
                flex flex-col
                overflow-hidden
                h-[calc(100vh-1rem)]
              "
            >
              
              {/* HEADER */}
              <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4 bg-[#0A0A0A]">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="/">Miktool</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>
                          {pathname === "/" ? "Dashboard" : pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2)}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </header>

              {/* CONTENT AREA */}
              <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
                {children}
              </div>

            </SidebarInset>
            <Toaster />
          </SidebarProvider>
        )}
        
      </body>
    </html>
  );
}