import React from "react";
import {
    useTable,
    useFilters,
    useGlobalFilter,
    useAsyncDebounce,
    useSortBy,
    usePagination,
} from "react-table";
import { classNames } from "../shared/Utils";
import { SortIcon, SortUpIcon, SortDownIcon } from "../shared/Icons";
import {
    Button,
    Input,
    Table,
    Row,
    Col,
} from "reactstrap";
import "../views/Test.css";

// Define a default UI for filtering
function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
}) {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = React.useState(globalFilter);
    const onChange = useAsyncDebounce((value) => {
        setGlobalFilter(value || undefined);
    }, 200);

    return (
        // <label>
        //     <span style={{ color: 'black', fontSize: '1rem' }} className='mr-2'>Search: </span>
        //     <Input
        //         type="text"
        //         value={value || ""}
        //         onChange={(e) => {
        //             setValue(e.target.value);
        //             onChange(e.target.value);
        //         }}
        //         placeholder={`${count} records...`}
        //     />
        // </label>
        <Row className="align-items-center">
            <Col xs="auto">
                <span style={{ color: 'black', fontSize: '1rem' }} className='mr-2'>Search: </span>
            </Col>
            <Col>
                <label>
                    {/* <span className="sr-only">Search</span> */}
                    <Input
                        type="text"
                        value={value || ""}
                        onChange={(e) => {
                            setValue(e.target.value);
                            onChange(e.target.value);
                        }}
                        placeholder={`${count} records...`}
                    />
                </label>
            </Col>
        </Row>
    );
}

// This is a custom filter UI for selecting
// a unique option from a list
export function SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id, render },
}) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
        const options = new Set();
        preFilteredRows.forEach((row) => {
            options.add(row.values[id]);
        });
        return [...options.values()];
    }, [id, preFilteredRows]);

    // Render a multi-select box
    return (
        <label className="flex gap-x-2 items-baseline">
            <span className="text-gray-700">{render("Header")}: </span>
            <select
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                name={id}
                id={id}
                value={filterValue}
                onChange={(e) => {
                    setFilter(e.target.value || undefined);
                }}
            >
                <option value="">All</option>
                {options.map((option, i) => (
                    <option key={i} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </label>
    );
}

export function StatusPill({ value }) {
    const status = value ? value.toLowerCase() : "unknown";

    return (
        <span
            className={classNames(
                "px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm",
                status.startsWith("active") ? "bg-green-100 text-green-800" : null,
                status.startsWith("inactive") ? "bg-yellow-100 text-yellow-800" : null,
                status.startsWith("offline") ? "bg-red-100 text-red-800" : null
            )}
        >
            {status}
        </span>
    );
}

export function AvatarCell({ value, column, row }) {
    return (
        <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
                <img
                    className="h-10 w-10 rounded-full"
                    src={row.original[column.imgAccessor]}
                    alt=""
                />
            </div>
            <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">{value}</div>
                <div className="text-sm text-gray-500">
                    {row.original[column.emailAccessor]}
                </div>
            </div>
        </div>
    );
}

function RTDataTable({ columns, data }) {
    const cellClass = "px-6 py-2 whitespace-nowrap sm:whitespace-normal";
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page, // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page

        // The rest of these things are super handy, too ;)
        canPreviousPage,
        canNextPage,
        pageOptions,
        // pageCount,
        // gotoPage,
        nextPage,
        previousPage,
        setPageSize,

        state,
        preGlobalFilteredRows,
        setGlobalFilter,
    } = useTable(
        {
            columns,
            data,
        },
        useFilters, // useFilters!
        useGlobalFilter,
        useSortBy,
        usePagination // new
    );

    // Render the UI for your table
    return (
        <>
            <div className="font-roboto sm:flex sm:gap-x-2">
                <GlobalFilter
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={state.globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
                {headerGroups.map((headerGroup) =>
                    headerGroup.headers.map((column) =>
                        column.Filter ? (
                            <div className="mt-0 sm:mt-0" key={column.id}>
                                {column.render("Filter")}
                            </div>
                        ) : null
                    )
                )}
            </div>
            {/* table */}

            <div className="mt-1 flex flex-col">
                <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
                    <div className="py-0 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
                            <Table
                                {...getTableProps()}
                                className="full-width-table"
                                responsive
                                striped
                                size="sm"
                            >
                                <thead className="bg-gray-50">
                                    {headerGroups.map((headerGroup) => (
                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map((column) => (
                                                // Add the sorting props to control sorting. For this example
                                                // we can add them into the header props
                                                <th
                                                    scope="col"
                                                    className={`group text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${cellClass}`}
                                                    {...column.getHeaderProps(
                                                        column.getSortByToggleProps()
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        {column.render("Header")}
                                                        {/* Add a sort direction indicator */}
                                                        <span>
                                                            {column.isSorted ? (
                                                                column.isSortedDesc ? (
                                                                    <SortDownIcon className="w-4 h-4 text-gray-400" />
                                                                ) : (
                                                                    <SortUpIcon className="w-4 h-4 text-gray-400" />
                                                                )
                                                            ) : (
                                                                <SortIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                                                            )}
                                                        </span>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody
                                    {...getTableBodyProps()}
                                >
                                    {page.map((row, i) => {
                                        // new
                                        prepareRow(row);
                                        return (
                                            <tr className="table-row" {...row.getRowProps()}>
                                                {row.cells.map((cell) => {
                                                    return (
                                                        <td
                                                            {...cell.getCellProps()}
                                                            role="cell"

                                                        >
                                                            {cell.column.Cell.name === "defaultRenderer" ? (
                                                                // <div className="text-sm text-gray-500">
                                                                cell.render("Cell")
                                                                // </div>
                                                            ) : (
                                                                cell.render("Cell")
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
            {/* Pagination */}
            <div className="py-2">
                <Row className="justify-content-end">
                    <Col xs="auto">
                        <Button className='rttable-button' onClick={() => previousPage()} disabled={!canPreviousPage}>
                            Previous
                        </Button>
                    </Col>
                    <Col xs="auto">
                        <Button className='rttable-button' onClick={() => nextPage()} disabled={!canNextPage}>
                            Next
                        </Button>
                    </Col>
                </Row>
                {/* <div className="flex-1 flex justify-end sm:hidden">
                    <Button className='rttable-button' onClick={() => previousPage()} disabled={!canPreviousPage}>
                        Previous
                    </Button>
                    <Button className='rttable-button' onClick={() => nextPage()} disabled={!canNextPage}>
                        Next
                    </Button>
                </div> */}
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <Row className="justify-content-end">
                        <Col xs="auto" className="text-sm text-gray-700 pageclass">
                            Page <span className="font-medium">{state.pageIndex + 1}</span> of{" "}
                            <span className="font-medium">{pageOptions.length}</span>
                        </Col>
                        <Col xs="auto">
                            <label className="ml-2">
                                <span className="sr-only">Items Per Page</span>
                                <Input
                                    type="select"
                                    value={state.pageSize}
                                    onChange={(e) => {
                                        setPageSize(Number(e.target.value));
                                    }}
                                >
                                    {[5, 10, 20].map((pageSize) => (
                                        <option key={pageSize} value={pageSize}>
                                            Show {pageSize}
                                        </option>
                                    ))}
                                </Input>
                            </label>
                        </Col>
                    </Row>
                    {/* <div className="flex gap-x-2 items-baseline">
                        <span className="text-sm text-gray-700 pageclass">
                            Page <span className="font-medium">{state.pageIndex + 1}</span> of{" "}
                            <span className="font-medium">{pageOptions.length}</span>
                        </span>
                        <label>
                            <span className="sr-only">Items Per Page</span>
                            <Input
                                type="select"
                                className="ml-2"
                                value={state.pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                }}
                            >
                                {[5, 10, 20].map((pageSize) => (
                                    <option key={pageSize} value={pageSize}>
                                        Show {pageSize}
                                    </option>
                                ))}
                            </Input>
                        </label>
                    </div> */}
                    {/* <div>
                        <nav
                            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                            aria-label="Pagination"
                        >
                            <PageButton
                                onClick={() => gotoPage(0)}
                                disabled={!canPreviousPage}
                            >
                                <span className="sr-only">First</span>
                                <ChevronDoubleLeftIcon
                                    aria-hidden="true"
                                />
                            </PageButton>
                            <PageButton
                                onClick={() => previousPage()}
                                disabled={!canPreviousPage}
                            >
                                <span className="sr-only">Previous</span>
                                <ChevronLeftIcon
                                    aria-hidden="true"
                                />
                            </PageButton>
                            <Button onClick={() => nextPage()} disabled={!canNextPage}>
                                <span className="sr-only">Next</span>
                                <ChevronRightIcon
                                    aria-hidden="true"
                                />
                            </Button>
                            <PageButton
                                className="rounded-r-md"
                                onClick={() => gotoPage(pageCount - 1)}
                                disabled={!canNextPage}
                            >
                                <span className="sr-only">Last</span>
                                <ChevronDoubleRightIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </PageButton>
                        </nav>
                    </div> */}
                </div>
            </div>
        </>
    );
}

export default RTDataTable;
