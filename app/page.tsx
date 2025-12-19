import Hero from "./components/hero/Hero";

export default function Home() {
  return (
    <div className="flex justify-center bg-zinc-50 font-sans">
      <main className="flex w-full flex-col items-center justify-between px-6 bg-white sm:items-start">
       <Hero/>
      </main>
    </div>
  );
}
