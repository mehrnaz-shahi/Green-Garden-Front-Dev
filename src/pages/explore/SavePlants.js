import React, { useState } from "react";
import Modal from "react-modal";
import { getData, get_by_token } from "../../services/api";
import { useCookies } from "react-cookie";
//images
import plant from "../../assets/images/3_2.svg";
import plant2 from "../../assets/images/plants/6_2.png";
import saved from "../../assets/icons/saved.svg";

// Component
import SaveCard from "../../components/SaveCard";
import { useEffect } from "react";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "rgb(23 23 23 / 97%)",
    padding: "50px",
    borderRadius: "11px",
    width: "80vw",
    height: "80vh",
    justifyContent: "space-evenly",
  },
};

Modal.setAppElement("#root");

const SavePlants = () => {
  const [cookies, setCookie] = useCookies(["token"]);

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await get_by_token(
        "accounts/bookmark-list/",
        cookies["token"]
      );
      // console.log(res);

      setData(Array.isArray(res) ? res : []);
    };

    fetch();
  }, []);



  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <button onClick={openModal} className="btn btn-icon  nav-icon">
        {/* <i className="uil uil-heart align-middle icons"></i> */}
        <svg
          className="align-middle"
          width="26px"
          height="19px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M19 19.2674V7.84496C19 5.64147 17.4253 3.74489 15.2391 3.31522C13.1006 2.89493 10.8994 2.89493 8.76089 3.31522C6.57467 3.74489 5 5.64147 5 7.84496V19.2674C5 20.6038 6.46752 21.4355 7.63416 20.7604L10.8211 18.9159C11.5492 18.4945 12.4508 18.4945 13.1789 18.9159L16.3658 20.7604C17.5325 21.4355 19 20.6038 19 19.2674Z"
              stroke="#ffd15a"
              strokeWidth="1.896"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </g>
        </svg>
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        overlayStyle={{
          backgroundColor: "rgba(0, 1, 10, 0.5)",
          zIndex: 9999,
        }}
      >
        <div className="container mt-100 mt-60 save-div" id="portfolio">
          <div className="row">
            <div className="col-12">
              <div className="section-title mb-4 pb-2">
                <h4 className="title mb-4 text-primary fw-bold">
                  گیاهان ذخیره‌شده
                </h4>
              </div>
            </div>
          </div>

          <div className="row">
            {data.length === 0 && (<h5 className="text-danger" style={{textAlign: 'center', color: '#ffd15a !import '}}> هنوز گیاهی ذخیره نکرده‌اید.</h5>)}
            {Array.isArray(data) &&
              data.map((item) => {
                return <SaveCard key={item.id} info={item} />;
              })}

            <button
              className="btn btn-primary me-2"
              onClick={closeModal}
              style={{ marginTop: "50px" }}
            >
              بستن
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SavePlants;
