"use client";

type Modal = {
  children: Readonly<React.ReactNode>;
};

export default function Modal({ children }: Modal) {
  return (
    <div className="absolute top-0 z-40 flex h-screen w-screen items-center justify-center bg-black/10">
      {children}
    </div>
  );
}
