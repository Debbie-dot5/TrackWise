export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Verification Failed</h1>
      <p className="text-gray-600">We couldn’t verify your email. Please try signing in again.</p>
    </div>
  );
}
