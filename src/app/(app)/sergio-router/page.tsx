import SergioRouterList from "@/components/sergioRouter/SergioRouterList";
import NewSergioRouterModal from "@/components/sergioRouter/SergioRouterModal";

export default async function SergioRouter() {
  return (
    <main>
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Sergio Router</h1>
        <NewSergioRouterModal />
      </div>
      <SergioRouterList />
    </main>
  );
}
