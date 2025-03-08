import { Toaster } from "@/components/ui/toaster";
import Footer from "./Footer";
import Header from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />
      <div className="pt-16 md:pt-20 flex-grow px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
        {children}
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}
