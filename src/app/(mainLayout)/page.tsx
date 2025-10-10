import Link from "next/link";

function Home() {
  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-start p-8">
      <Link href="/collection" className="w-full max-w-md">
        <div
          className="bg-background text-primary hover:text-secondary rounded-2xl p-12 flex items-center justify-center h-64
  transition-colors duration-300 ease-in-out cursor-pointer"
        >
          <h2 className="text-4xl font-extrabold">Collection</h2>
        </div>
      </Link>
    </div>
  );
}

export default Home;
