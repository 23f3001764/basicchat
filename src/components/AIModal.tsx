"use client";

export default function AIModal({ data, onClose }: any) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
      
      {/* CARD */}
      <div className="relative w-[90%] max-w-xl p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">

        {/* ❌ CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-lg"
        >
          ✖
        </button>

        {data.articles.map((a: any, i: number) => (
          <div key={i} className="mb-6">

            <h2 className="text-xl font-bold mb-2">{a.title}</h2>

            <p className="text-white/90">{a.summary}</p>

            <div className="mt-4 flex justify-center bg-white/90 p-3 rounded-xl">
              <div
                className="w-[250px]"
                dangerouslySetInnerHTML={{ __html: a.svg }}
              />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}