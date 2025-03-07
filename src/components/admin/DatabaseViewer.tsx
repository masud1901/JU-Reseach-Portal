import { useState, useEffect } from "react";
import { supabase } from "../../../supabase/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DatabaseViewer() {
  const [activeTable, setActiveTable] = useState("professors");
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tables = [
    "professors",
    "students",
    "departments",
    "faculties",
    "publications",
    "publication_authors",
    "research_keywords",
    "professor_research_keywords",
    "connection_requests",
    "admin_users",
  ];

  useEffect(() => {
    fetchTableData(activeTable);
  }, [activeTable]);

  async function fetchTableData(tableName: string) {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .limit(50);

      if (error) {
        throw error;
      }

      setTableData(data || []);
    } catch (err: any) {
      console.error(`Error fetching ${tableName}:`, err);
      setError(err.message || `Failed to fetch ${tableName} data`);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }

  function renderTableData() {
    if (loading) {
      return <div className="py-8 text-center">Loading table data...</div>;
    }

    if (error) {
      return (
        <div className="py-8 text-center text-red-500">Error: {error}</div>
      );
    }

    if (tableData.length === 0) {
      return (
        <div className="py-8 text-center text-muted-foreground">
          No data found in {activeTable} table
        </div>
      );
    }

    // Get column names from the first row
    const columns = Object.keys(tableData[0]);

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              {columns.map((column) => (
                <th
                  key={column}
                  className="p-2 text-left text-xs font-medium text-muted-foreground border"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b hover:bg-muted/50">
                {columns.map((column) => (
                  <td
                    key={`${rowIndex}-${column}`}
                    className="p-2 text-sm border"
                  >
                    {renderCellValue(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function renderCellValue(value: any) {
    if (value === null) {
      return <span className="text-muted-foreground italic">null</span>;
    }

    if (Array.isArray(value)) {
      return (
        <div className="max-w-xs">
          <pre className="text-xs overflow-hidden text-ellipsis">
            {JSON.stringify(value, null, 2)}
          </pre>
        </div>
      );
    }

    if (typeof value === "object") {
      return (
        <div className="max-w-xs">
          <pre className="text-xs overflow-hidden text-ellipsis">
            {JSON.stringify(value, null, 2)}
          </pre>
        </div>
      );
    }

    if (typeof value === "boolean") {
      return value ? "true" : "false";
    }

    return String(value);
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Database Viewer</CardTitle>
          <CardDescription>
            View the contents of the database tables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTable} onValueChange={setActiveTable}>
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="w-full justify-start">
                {tables.map((table) => (
                  <TabsTrigger key={table} value={table} className="text-xs">
                    {table}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>

            <div className="mt-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">{activeTable} Table</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchTableData(activeTable)}
              >
                Refresh Data
              </Button>
            </div>

            <TabsContent value={activeTable} className="mt-2">
              <ScrollArea className="h-[500px] rounded-md border">
                {renderTableData()}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
