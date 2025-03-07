import DatabaseViewer from "../admin/DatabaseViewer";

export default function DatabaseExplorer() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Database Explorer</h1>
      <DatabaseViewer />
    </div>
  );
}
