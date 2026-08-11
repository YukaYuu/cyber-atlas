import TrendsView from "@/app/components/TrendsView";
import { dataset } from "@/lib/data";

export default function TrendsPage() {
  return <TrendsView dataset={dataset} />;
}
