import { FlagsPanel } from "@/components/admin/flags-panel";

export default function AdminFlagsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Banderas de función</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Stub APS-16: controla el track AIF (`exam_track_ai`). Por defecto off.
        </p>
      </div>
      <FlagsPanel />
    </div>
  );
}
