import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const MOCK_USERS = [
  { id: "1", name: "Alice (Candidate)", username: "alice", role: "candidate" },
  { id: "2", name: "Bob (Candidate)", username: "bob", role: "candidate" },
  { id: "3", name: "Employer One", username: "employer1", role: "employer" },
  { id: "4", name: "Employer Two", username: "employer2", role: "employer" },
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        if (credentials.password !== "password123") {
          return null;
        }

        const user = MOCK_USERS.find(u => u.username === credentials.username);

        if (user) {
          return { id: user.id, name: user.name, role: user.role };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string | undefined;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  }
});
