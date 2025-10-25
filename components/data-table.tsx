import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DataTableProps {
  data: Array<{
    date: string
    value: number
    lower: number
    upper: number
  }>
}

export function DataTable({ data }: DataTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Forecast</TableHead>
            <TableHead className="text-right">Lower Bound</TableHead>
            <TableHead className="text-right">Upper Bound</TableHead>
            <TableHead className="text-right">Range</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => {
            const range = ((row.upper - row.lower) / row.value) * 100
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {new Date(row.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right">{row.value.toFixed(3)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{row.lower.toFixed(3)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{row.upper.toFixed(3)}</TableCell>
                <TableCell className="text-right">±{range.toFixed(1)}%</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
