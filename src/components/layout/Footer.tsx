import { Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">JU Research Portal</h3>
            <p className="text-slate-300">
              Connecting researchers at Jahangirnagar University to foster
              collaboration and innovation.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/professors"
                  className="text-slate-300 hover:text-white"
                >
                  Professors
                </Link>
              </li>
              <li>
                <Link
                  to="/students"
                  className="text-slate-300 hover:text-white"
                >
                  Students
                </Link>
              </li>
              <li>
                <Link
                  to="/leaderboard"
                  className="text-slate-300 hover:text-white"
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="text-slate-300 hover:text-white"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://scholar.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white"
                >
                  Google Scholar
                </a>
              </li>
              <li>
                <a
                  href="https://www.juniv.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white"
                >
                  Jahangirnagar University
                </a>
              </li>
              <li>
                <a
                  href="https://www.researchgate.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white"
                >
                  ResearchGate
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Developer Contact</h4>
            <p className="text-slate-300">Md Akmol Masud</p>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="h-4 w-4" />
              <a
                href="mailto:akmolmasud5@gmail.com"
                className="hover:text-white"
              >
                akmolmasud5@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="h-4 w-4" />
              <a href="tel:+8801304963440" className="hover:text-white">
                +8801304963440
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
          <p>
            © {new Date().getFullYear()} JU Research Portal. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
