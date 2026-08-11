import AttackAtlas from "@/app/components/AttackAtlas";
import { dataset } from "@/lib/data";

export default function Home() {
  return (
    <div className="h-screen relative">
      <AttackAtlas dataset={dataset} />
    </div>
  );
}
