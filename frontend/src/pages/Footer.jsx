import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="w-full bg-green-800 text-yellow-50 mt-12 py-8 shadow-inner">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        {/* Left: Project Info */}
        <div className="md:text-left text-center mb-4 md:mb-0">
          <h2 className="text-2xl font-bold tracking-wide">
            🌾 MGNREGA District Dashboard
          </h2>
          <p className="text-green-100 text-sm mt-1">
            Empowering transparency in rural employment data.
          </p>
        </div>
        {/* Social Icons */}
        <div className="flex gap-6 my-2 text-2xl">
          <a
            href="https://github.com/i-m-vineet2001"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-300 transition"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/vineetpatel2001"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-300 transition"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-300 transition"
            aria-label="Twitter"
          >
            <FaTwitter />
          </a>
        </div>
        {/* Credits */}
        <div className="md:text-right text-center text-green-100 text-sm font-light">
          <p>
            © {new Date().getFullYear()} MGNREGA Insights. Built with
            <span className="mx-1 text-xl">💚</span>
            by{" "}
            <span className="font-semibold text-yellow-200">Vineet Patel</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
