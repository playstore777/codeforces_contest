import { useParams } from "react-router";
import { Link } from "react-router-dom";

const ContestCard = ({ data }) => {
    const detailsPageHeading = {
        display: "flex",
    };
    const style = {
        padding: "20px",
        width: "250px",
        height: "10rem",
        // border: "1px solid black",
        borderRadius: "15px",
        boxShadow: "0 4px 4px 1px gray",
    };

    const divStyle = {
        color: "gray",
        padding: "4px",
    };

    const { id } = useParams();
    // console.log("id from contestCard: ", data);
    const details = data.filter((item) => {
        // console.log(typeof id);
        return item.id === Number(id);
    })[0];
    // console.log(details);
    return (
        <>
            <div style={detailsPageHeading}>
                <button>
                    <Link
                        style={{ textDecoration: "none", color: "white" }}
                        to="/"
                    >
                        {"< "}back
                    </Link>
                </button>
                <div className="heading">Contest Details Page</div>
            </div>
            <div className="card" style={style}>
                <div style={divStyle}>Id: {id}</div>
                <div style={divStyle}>name: {details.name}</div>
                {/* <div>description: {}</div> */}
                <div style={divStyle}>type: {details.type}</div>
                <div style={divStyle}>phase: {details.phase}</div>
            </div>
        </>
    );
};

export default ContestCard;
