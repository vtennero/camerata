// module.exports = {
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         destination: "http://localhost:5000/:path*",
//       },
//     ];
//   },
// };

/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:5000/:path*"
            : "/api/",
      },
    ];
  },
};

module.exports = nextConfig;
