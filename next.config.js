module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/:path*", // Adjust the port if your Flask server runs on a different port
      },
    ];
  },
};
