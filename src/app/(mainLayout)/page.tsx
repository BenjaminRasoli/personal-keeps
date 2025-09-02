import Link from "next/link";

function Home() {
  const collectionsList = [
    {
      name: "Funko Pops",
      link: "funkopops",
    },
    {
      name: "Media",
      link: "media",
    },
  ];

  return (
    <div className="p-8 ">
      <h1 className="text-5xl font-extrabold mb-12 text-white text-center drop-shadow-lg">
        Firestore Collections
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {collectionsList.map((col) => (
          <Link
            key={col.name}
            href={`/${col.link}`}
            className="block transform hover:scale-105 transition-transform"
          >
            <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg p-8 flex items-center justify-center h-64 hover:shadow-2xl transition-shadow">
              <h2 className="text-3xl font-extrabold text-white bg-clip-text  bg-gradient-to-r from-yellow-400 to-green-400">
                {col.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
