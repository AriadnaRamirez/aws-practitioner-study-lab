import type { Metadata } from "next";
import { OsiTcpIpGame } from "@/components/minigames/osi-tcpip-game";
import { RequireAuth } from "@/components/shell/require-auth";

export const metadata: Metadata = {
  title: "OSI vs TCP/IP · Minijuegos",
};

export default function OsiVsTcpIpPage() {
  return (
    <RequireAuth>
      <OsiTcpIpGame />
    </RequireAuth>
  );
}
