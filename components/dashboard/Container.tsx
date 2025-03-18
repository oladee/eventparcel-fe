"use client";
function Container({ children }: { children: React.ReactNode }) {


  return (
    <main className="absolute top-0 left-0 right-0 md:pl-64 !pt-16 h-screen overflow-y-auto no-scrollbar">{children}</main>
  );
}

export default Container;


