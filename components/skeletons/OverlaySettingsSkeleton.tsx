import RetroShell from "@/components/layout/RetroShell";

export default function OverlaySettingsSkeleton() {
  return (
    <RetroShell>
      <div className="mx-auto flex max-w-5xl flex-col gap-6 md:flex-row animate-pulse">
        {/* Settings Panel (Left) */}
        <div className="flex-1 space-y-4">
          <div className="retro-card p-4 h-[500px] border border-[rgba(242,217,208,0.5)] bg-[rgba(255,249,237,0.5)]">
            {/* Header */}
            <div className="mb-6 space-y-2">
              <div className="h-6 w-48 rounded-full bg-[rgba(123,104,108,0.1)]" />
              <div className="h-4 w-3/4 rounded bg-[rgba(123,104,108,0.05)]" />
            </div>

            {/* Rows */}
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 w-24 rounded bg-[rgba(123,104,108,0.1)]" />
                    <div className="h-3 w-48 rounded bg-[rgba(123,104,108,0.05)]" />
                  </div>
                  <div className="h-8 w-16 rounded-full bg-[rgba(123,104,108,0.08)]" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Panel (Right) */}
        <div className="flex-1">
          <div className="retro-card flex min-h-[500px] items-center justify-center bg-[rgba(9,8,19,0.05)] p-3">
             <div className="h-32 w-32 rounded-full bg-[rgba(123,104,108,0.1)]" />
          </div>
        </div>
      </div>
    </RetroShell>
  );
}

