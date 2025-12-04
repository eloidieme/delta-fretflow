import { usePlayerStore } from "@/store/playerStore";
import { BasicApp } from "@/apps/BasicApp";

export function Dashboard() {
  // In the future, we might switch between <BasicApp>, <ScaleApp>, etc.
  // For now, we only have one.

  const { activeTitle } = usePlayerStore();

  return (
    <div className="h-full">
      {/* In Phase 4, we might render different components based on 'appType'.
        For Phase 3 MVP, we always render the BasicApp.
      */}
      <BasicApp />
    </div>
  );
}
