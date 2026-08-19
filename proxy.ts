import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {},

  {
    pages: {
      signIn: "/auth/login",
    },

    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        if (!token) return false;

        if (path.startsWith("/dashboard/admin")) {
          return token.role === "admin";
        }

        if (path.startsWith("/dashboard/doctor")) {
          return token.role === "doctor";
        }

        if (path.startsWith("/dashboard/patient")) {
          return token.role === "patient";
        }

        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
