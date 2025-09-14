import { Link } from "react-router";
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="navbar flex items-center justify-between px-6 py-4 border-b border-gray-300 bg-white/80 backdrop-blur-md shadow-sm rounded-sm"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <p className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          RESUMIND
        </p>
      </Link>

      {/* Upload Button */}
      <Link
        to="/upload"
        className="px-5 py-2 border border-indigo-600 rounded-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
      >
        Upload Resume
      </Link>
    </motion.nav>
  );
};

export default Navbar;
