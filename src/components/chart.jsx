import { useState } from "react";
import "./chart.css";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { cloneDeep } from "lodash";
import { Link } from "react-router-dom";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top",
        },
        title: {
            display: true,
            text: "Codeforces contest chart",
        },
    },
};

export function Chart({ data, setGraphVisible, graphVisible }) {
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(5);
    const [collection, setCollection] = useState(cloneDeep(data));

    const labels = collection.map((item) => item.name).slice(start, end);

    const chartData = {
        labels,
        datasets: [
            {
                label: "contests",
                data: collection
                    .map((item) => item.durationSeconds / 1000)
                    .slice(start, end),
                backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
        ],
    };

    const filterHandler = ({ type = "all", phase = "all" }) => {
        let tempData = [];
        if (type === "all" && phase === "all") {
            tempData = cloneDeep(data);
        } else if (type === "all") {
            tempData = data.filter(
                (item) => item.phase.toLowerCase() === phase
            );
        } else if (phase === "all") {
            tempData = data.filter((item) => item.type.toLowerCase() === type);
        } else {
            tempData = data.filter(
                (item) =>
                    item.type.toLowerCase() === type &&
                    item.phase.toLowerCase() === phase
            );
        }

        setCollection(tempData);
    };

    return (
        <>
            <div className="heading">Contest Bar chart</div>
            <div className="range-setters">
                <Link to="/">
                    <button>{"< "}back</button>
                </Link>
                <div className="range-setter">
                    start:
                    <input
                        type="number"
                        value={start}
                        onChange={(event) => {
                            return setStart(event.target.value);
                        }}
                    />
                </div>
                <div className="range-setter">
                    end:
                    <input
                        type="number"
                        value={end}
                        onChange={(event) => {
                            return setEnd(event.target.value);
                        }}
                    />
                </div>
                Total Contests : <b>{data.length}</b>
            </div>
            <div className="filters">
                Type{" :"}
                <select
                    onChange={(event) =>
                        filterHandler({ type: event.target.value })
                    }
                >
                    <option value="all">All</option>
                    <option value="cf">CF</option>
                    <option value="ioi">IOI</option>
                    <option value="icpc">ICPC</option>
                </select>
                Phase{" :"}
                <select
                    onChange={(event) =>
                        filterHandler({ phase: event.target.value })
                    }
                >
                    <option value="all">All</option>
                    <option value="before">BEFORE</option>
                    <option value="finished">FINISHED</option>
                </select>
            </div>
            <Bar options={options} data={chartData} />;
        </>
    );
}
