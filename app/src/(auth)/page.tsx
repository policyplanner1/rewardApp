export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#852BAF] to-[#FC3F78]">
      {children}
    </div>
  );
}