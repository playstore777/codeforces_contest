import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Table from "./components/table";
import { Chart } from "./components/chart";
import ContestCard from "./components/contestCard";

function App() {
    const [graphVisible, setGraphVisible] = useState(false);
    const [data, setData] = useState([]);
    useEffect(() => {
        async function fetchApi() {
            const response = await axios.get(
                "https://codeforces.com/api/contest.list"
            );
            console.log("response : ", response);
            console.log("response.data : ", response.data);
            setData(response.data.result);
        }
        fetchApi();
    }, []);
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    {data.length > 0 ? (
                        <Route
                            exact
                            path="/"
                            element={
                                <Table
                                    allData={data}
                                    setGraphVisible={setGraphVisible}
                                    graphVisible={graphVisible}
                                />
                            }
                        />
                    ) : (
                        ""
                    )}
                    <Route
                        exact
                        path="/graph"
                        element={
                            <Chart
                                data={data}
                                setGraphVisible={setGraphVisible}
                                graphVisible={graphVisible}
                            />
                        }
                    />

                    <Route
                        exact
                        path={"/contest/:id"}
                        element={<ContestCard data={data} />}
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
