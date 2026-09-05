import React from "react";
import { Link } from "react-router-dom";

// Function
import { translateType } from "../featurs/translateType";

const Card = ({ info }) => {
  const { main_img, name, type, id } = info;
  
  return (
    <div className="mb-4 break-inside-avoid">
      <div className="card border-0 work-container work-modern position-relative d-block overflow-hidden rounded">
        <div className="card-body p-0">
          <img src={main_img} className="block w-full h-auto" alt={name} />
          <div className="overlay-work bg-dark"></div>
          <div className="content">
            <h5 className="mb-0">
              <Link to="/" className="text-white title">
                {name}
              </Link>
            </h5>
            <h6 className="text-light tag mb-0">{translateType(type)} </h6>
          </div>
          {/* detail */}
          <div className="icons text-center">
            <Link
              to={`/home/plant-detail/${id}`}
              className="text-primary work-icon bg-white d-inline-block rounded-pill lightbox"
            >
              <i data-feather="camera" className="uil uil-camera "></i>
              <div className="btn btn-icon btn-pills btn-soft-danger"><i data-feather="heart" className="icons"></i></div>

            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
