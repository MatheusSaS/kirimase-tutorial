import SergioRouterModal from "./SergioRouterModal";

export default function SergioRouterList() {
  return <EmptyState />;
}

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No sergio router
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new sergio router.
      </p>
      <div className="mt-6">
        <SergioRouterModal emptyState={true} />
      </div>
    </div>
  );
};
