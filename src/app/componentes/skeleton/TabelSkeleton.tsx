export default function TabelSkeleton({
  columns,
  lines,
}: {
  columns: number;
  lines: number;
}) {
  return (
    <div>
      <table className="grind w-full h-52 items-center">
        <thead>
          <tr className="*:text-2xl cursor-pointer">
            {[...Array(columns)].map((_, i) => (
              <th key={i}>
                <div className="justify-center flex items-center gap-1 h-4 bg-black rounded animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="*:border-b-1 *:border-black">
          {[...Array(columns)].map((_, i) => (
            <tr key={i} className="border-t">
              {[...Array(lines)].map((_, i) => (
                <td key={i} className="px-4 py-2">
                  <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
