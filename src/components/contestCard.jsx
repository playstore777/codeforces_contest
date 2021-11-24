import { useParams } from "react-router";

const ContestCard = ({ data }) => {
    const { id } = useParams();
    // console.log("id from contestCard: ", data);
    const details = data.filter((item) => {
        // console.log(typeof id);
        return item.id === Number(id);
    })[0];
    // console.log(details);
    return (
        <div className="card">
            <div>Id: {id}</div>
            <div>name: {details.name}</div>
            {/* <div>description: {}</div> */}
            <div>type: {details.type}</div>
            <div>phase: {details.phase}</div>
        </div>
    );
};

export default ContestCard;
