//app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "", type: "email", placeholder: "email" },
        password: { label: "", type: "password", placeholder: "password" },
      },
      async authorize(credentials, req) {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });
        const user = await res.json();
        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  //callback은 로그인 폼에서 유저네임과 패스워드를 넣고 제출하기(submit) 버튼을 눌렀을 때,
  //NextAuth의 authorize 함수에서 로그인 로직을 수행하고 나서 마지막으로 실행되는 부분인데요.
  callbacks: {
    //jwt을 생성하거나 갱신할 때마다 호출
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    //세선 데이터가 클라이언트 사이드로 전송되기 전에 호출
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});

export { handler as GET, handler as POST };
