import React from "react";

const Footer = () => {
  return (
    <footer
      className="rounded-xl shadow-lg
      bg-gray-400 bg-clip-padding
      backdrop-filter backdrop-blur-lg mt-3 mb-3 
      bg-opacity-0"
      style={{ textAlign: "center", padding: "20px" }}
    >
      <p className="text-white font-bold">
        &copy; {new Date().getFullYear()} 𝕄𝕐 Social Media. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
