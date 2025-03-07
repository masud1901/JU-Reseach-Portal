import Header from "./Header";
import Footer from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted">
      <Header />
      <div className="pt-14 flex-grow">{children}</div>
      <Footer />
    </div>
  );
}
