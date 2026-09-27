export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 w-full flex">
      <div className="flex-1 w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-black">
        {children}
      </div>
    </div>
  );
}
