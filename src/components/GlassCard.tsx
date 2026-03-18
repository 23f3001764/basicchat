export default function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 w-[350px] text-center">
      {children}
    </div>
  );
}