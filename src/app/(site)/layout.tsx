import { Footer } from '@/components/site/Footer';
import { Navbar } from '@/components/site/Navbar';

export default function SiteLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Navbar />
      <div id="main" className="flex-1">
        {children}
      </div>
      <Footer />
    </>
  );
}
