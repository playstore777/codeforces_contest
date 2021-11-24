import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import cloneDeep from "lodash/cloneDeep";
import debounce from "lodash/debounce";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import "./table.css";

const tableHead = {
    name: "Contest Name",
    type: "Contest Type",
    favorite: "Favorite",
};

const Table = ({ allData, setGraphVisible, graphVisible }) => {
    // sets the page size
    const [pageSize, setPageSize] = useState(10);
    // stores the search text
    const [value, setValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    // stores data to display
    const [collection, setCollection] = useState(
        cloneDeep(allData.slice(0, pageSize))
    );
    const [filterValue, setFilterValue] = useState("all");

    const [isFavorite, setIsFavorite] = useState(
        JSON.parse(localStorage.getItem("favorites")) || {}
    );

    // searches the query and changes the data to be dipslayed
    const searchData = useRef(
        // lodash method which helps in avoiding unnecessary calls to api
        debounce((val) => {
            const query = val.toLowerCase();
            setCurrentPage(1);
            // query data is cloned and then displayed to the screen
            const data = cloneDeep(
                allData
                    .filter(
                        (item) => item.name.toLowerCase().indexOf(query) > -1
                    )
                    .slice(0, pageSize)
            );
            setCollection(data);
        }, 1000) // it waits for 1sec to execute this function.(debounces for a sec)
    );

    // applies filters, based on the filters dropdown
    const filter = (val) => {
        setFilterValue(val); // changes the selected option
        if (val === "all") {
            setCollection(allData.slice(0, pageSize)); // resets the list to page 1.(shows first countPerPage contests)
            return;
        } else if (val === "favorite") {
            const data = allData.filter((item) => isFavorite[item.id + "f"]);
            console.log("favoData ", data);
            if (data.length < pageSize) {
                setCollection(cloneDeep(data));
            } else {
                setCollection(cloneDeep(data.slice(0, pageSize)));
            }
            return;
        }
        const data = allData.filter((item) => item.type === val);
        setCollection(cloneDeep(data.slice(0, pageSize))); // shows first countPerPage contest having the given type only.
    };

    const updatePage = (p) => {
        setCurrentPage(p);
        const to = pageSize * p; // if countPerPage is 10, then p is 2 => 10 * 2 = 20, which means next 20 will be displayed
        const from = to - pageSize; // only from the last index, that is 10(counterPerPage) here.

        if (value) {
            console.log("value");
            const data = cloneDeep(
                allData
                    .filter(
                        (item) =>
                            item.name
                                .toLowerCase()
                                .indexOf(value.toLowerCase()) > -1
                    )
                    .slice(from, to)
            );
            setCollection(data);
            return;
        }

        if (filterValue === "all") {
            setCollection(cloneDeep(allData.slice(from, to)));
            return;
        } else if (filterValue === "favorite") {
            const data = allData.filter((item) => isFavorite[item.id + "f"]);
            setCollection(cloneDeep(data.slice(from, to)));
            return;
        }
        const data = allData.filter((item) => item.type === filterValue);
        setCollection(cloneDeep(data.slice(from, to)));
    };

    useEffect(() => {
        // if we are not searching for anything, it updates the page, else, it sends the control to the search function
        if (!value) {
            updatePage(1);
        } else {
            searchData.current(value);
        }
    }, [value]);

    const tableRows = (rowData) => {
        const { key, index } = rowData;
        const tableCell = Object.keys(tableHead);
        const columnData = tableCell.map((keyD, i) => {
            if (keyD === "favorite") {
                return (
                    <td
                        className="favorite"
                        key={i}
                        onClick={() => favoriteData(key.id)}
                    >
                        {isFavorite[key.id + "f"] ? "★" : "☆"}
                    </td>
                );
            }
            return (
                <td key={i}>
                    <Link
                        to={`contest/${key.id}`}
                        style={{ textDecoration: "none", color: "#222e50" }}
                    >
                        {key[keyD]}
                    </Link>
                </td>
            );
        });

        return <tr key={index}>{columnData}</tr>;
    };

    const tableData = () => {
        return collection.map((key, index) => tableRows({ key, index }));
    };

    const headRow = () => {
        return Object.values(tableHead).map((title, index) => (
            <td className="tableHeading" key={index}>
                {title}
            </td>
        ));
    };

    const favoriteData = (id) => {
        let key = id + "f";
        let tempFav = { ...isFavorite };
        tempFav[key] = !isFavorite[key];
        setIsFavorite(tempFav);

        localStorage.setItem("favorites", JSON.stringify(tempFav));
    };

    return (
        <>
            <div className="heading">Contest list</div>
            <div className="search-options">
                <div className="search">
                    <input
                        placeholder="Search Campaign"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <div className="dropdown">
                        <select
                            value={filterValue}
                            onChange={(event) => filter(event.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="CF">CF</option>
                            <option value="ICPC">ICPC</option>
                            <option value="favorite">Favorite</option>
                        </select>
                    </div>
                </div>
                <Link to="/graph">
                    <button>Graph</button>
                </Link>
            </div>
            <table>
                <thead>
                    <tr>{headRow()}</tr>
                </thead>
                <tbody className="trhover">{tableData()}</tbody>
            </table>
            <div className="pagination">
                <Pagination
                    pageSize={pageSize}
                    onChange={updatePage}
                    current={currentPage}
                    total={allData.length}
                />
                <div id="countPerPage">
                    Records per page
                    <select
                        onChange={(e) => {
                            setCollection(allData.slice(0, e.target.value));
                            setCurrentPage(1);
                            return setPageSize(e.target.value);
                        }}
                    >
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                </div>
            </div>
        </>
    );
};
export default Table;
