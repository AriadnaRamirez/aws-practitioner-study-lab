type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--foreground)]">
        {title}
      </h1>
      <p className="mt-3 text-base leading-relaxed text-[var(--foreground-muted)]">
        {description}
      </p>
      <p className="mt-8 text-sm text-[var(--foreground-muted)]">
        Placeholder de navegación — la funcionalidad llega en tickets posteriores.
      </p>
    </div>
  );
}
