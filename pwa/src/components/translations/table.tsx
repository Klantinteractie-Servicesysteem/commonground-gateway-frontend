import * as React from "react";
// import "../../style/table.css";

interface TableProps {
  columns: Array<Partial<Record<"field" | "headerName" | "renderCell" | "hidden" | "valueFormatter", any>>>;
  rows: Array<Record<any, any>>;
}

export const Table: React.FC<TableProps> = ({ columns, rows }) => {
  return (
    <table lang="nl" summary="Table." className="table">
      <thead>
        <tr>
          {columns.map((item, index) => (
            <th key={index}>{item.headerName ?? item.field}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {columns.map((column, idx) =>
              Object.keys(row).includes(column.field) && !column.hidden ? (
                column.renderCell ? (
                  <td className="align-middle" key={idx}>
                    {column.renderCell(row)}
                  </td>
                ) : (
                  <td className="align-middle" key={idx}>
                    {column.valueFormatter ? column.valueFormatter(row[column.field]) : row[column.field]}
                  </td>
                )
              ) : (
                <td key={idx}></td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
