import { ClientFooter } from "@/components/layouts/client-footer";
import { ClientHeader } from "@/components/layouts/client-header";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/60">
      <ClientHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <ClientFooter />
    </div>
  );
}
