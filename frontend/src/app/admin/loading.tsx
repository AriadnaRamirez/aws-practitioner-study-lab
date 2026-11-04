import { ADMIN_GRID } from "@/components/admin/admin-ui";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/ui/page";
import { Skeleton } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

/** Shared by every admin screen while its server data loads: title, KPI tiles and a panel. */
export default function AdminLoading() {
  return (
    <PageContainer width="wide" aria-busy="true">
      <p className="sr-only" role="status">
        Cargando el panel de administración…
      </p>
      <div aria-hidden>
        <Skeleton className="block h-4 w-32" />
        <Skeleton className="mt-4 block h-9 w-56 sm:h-10" />
        <Skeleton className="mt-3 block h-5 w-full max-w-lg" />

        <div className={cn(ADMIN_GRID, "mt-8")}>
          {[0, 1, 2, 3].map((i) => (
            <Card key={i} padding="sm" className="flex flex-col gap-3 xl:col-span-3">
              <Skeleton className="block h-3.5 w-3/4" />
              <Skeleton className="block h-8 w-20" />
              <Skeleton className="block h-3.5 w-1/2" />
            </Card>
          ))}

          <Card className="col-span-2 xl:col-span-12">
            <Skeleton className="block h-5 w-48" />
            <Skeleton className="mt-2 block h-4 w-72 max-w-full" />
            <div className="mt-5 space-y-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="block h-10 w-full rounded-xl" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
