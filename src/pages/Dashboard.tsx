import { usePlayerStore } from "@/store/playerStore";
import { BasicApp } from "@/apps/BasicApp";
import { ScaleExplorer } from "@/apps/ScaleExplorer";

export function Dashboard() {
  const { activeApp } = usePlayerStore();

  // THE SWITCHER LOGIC
  switch (activeApp) {
    case "scale_explorer":
      return <ScaleExplorer />;

    case "basic_utility":
    default:
      return <BasicApp />;
  }
}
