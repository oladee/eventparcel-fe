import Header from "@/components/Header";

function HeaderLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full max-w-full">
      <Header />
      {children}
    </div>
  );
}

export default HeaderLayout;
