import { usePlayerStore } from "@/store/playerStore";
import { BasicApp } from "@/apps/BasicApp";
import { ScaleExplorer } from "@/apps/ScaleExplorer"; // Import

export function Dashboard() {
  const { activeTitle } = usePlayerStore();

  // TEMPORARY:
  // If the loaded exercise is "Scale Explorer" (we haven't built the loader logic for this yet), show it.
  // For now, let's just force render it to test.

  // Un-comment the line below to test Scale Explorer:
  return <ScaleExplorer />;

  // Keep this for later:
  // return <BasicApp />;
}
