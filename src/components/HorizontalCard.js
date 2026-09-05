import React from "react";
import { Link } from "react-router-dom";
import { translateType } from "../featurs/translateType";

const HorizontalCard = ({info}) => {
    const {main_img, type, id} = info;
  return (
      <div className="col-lg-3 col-md-6 mt-4 pt-2">
        <div className="card team text-center border-0">
          <div className="position-relative">
            <img
              src={main_img}
              className="img-fluid avatar avatar-ex-large rounded-circle shadow-lg !border !border-neutral-100"
              alt=""
            />
            {/* detail */}
            <div className="icons text-center ">
              <Link
                to={`/home/plant-detail/${id}/`}
                className="text-primary team-icon bg-white d-inline-block rounded-pill lightbox"
              >
                <i data-feather="camera" className="uil uil-camera "></i>
              </Link>
            </div>
          </div>
          <div className="card-body py-3 px-0 content">
            <h5 className="mb-0">
              <Link to={`/home/plant-detail/${id}/`} className="name text-dark">
                {translateType(type)}
              </Link>
            </h5>
          </div>
        </div>
      </div>
  );
};

export default HorizontalCard;
