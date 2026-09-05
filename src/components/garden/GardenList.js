import React from "react";
// Component
import StarScore from "../score/StarScore";
import { Link } from "react-router-dom";
//  Image
import garden from "../../assets/images/plants/14.jpg";


const GardenList = ({ info }) => {
  const { name, profile_photo, id, avg_score } = info;
  const photo =
    profile_photo &&
    (profile_photo.startsWith("http") ||
      profile_photo.startsWith("/") ||
      profile_photo.startsWith("data:"))
      ? profile_photo
      : profile_photo
        ? `http://127.0.0.1:8000/${profile_photo}`
        : garden;
  return (
    <tr key={id + avg_score}>
      <td>
        <img
          src={photo}
          alt=""
          style={{
            margin: "0px 12px",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
          }}
        />
        <Link to={`/home/garden/${id}`} className="text-dark">{name}</Link>
      </td>

      <td className="list-unstyled mb-0">
        <div className="tdst-inline-item">
          <StarScore
            key={id * parseInt(avg_score) }
            outOf={5}
            initialRating={parseInt(avg_score)}
            className="mdi mdi-star text-warning"
          />
        </div>
      </td>
    </tr>
  );
};

export default GardenList;
