const CUENTA_TABS = ["cuenta", "progreso", "historial"] as const;

export type CuentaTab = (typeof CUENTA_TABS)[number];

export function parseCuentaTab(value: string | undefined): CuentaTab {
  return (CUENTA_TABS as readonly string[]).includes(value ?? "")
    ? (value as CuentaTab)
    : "cuenta";
}
