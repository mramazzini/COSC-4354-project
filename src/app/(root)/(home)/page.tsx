import { Routes } from "@/domain/Routes";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Welcome to Helping Hands
      </h1>
      <p className="text-gray-600 mb-8">
        A nonprofit volunteer event management system. Join us to make a
        difference in your community.
      </p>
      <div className="flex space-x-4">
        <a
          href={Routes.signup}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </a>
        <a
          href={Routes.login}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Sign In
        </a>
      </div>
    </div>
  );
}
