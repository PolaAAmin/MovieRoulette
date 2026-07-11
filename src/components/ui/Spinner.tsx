export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="spinner-wrap flex-column">
      <div className="mr-spinner" />
      {label && <p className="mt-3 text-secondary" style={{ fontSize: "0.9rem" }}>{label}</p>}
    </div>
  );
}
