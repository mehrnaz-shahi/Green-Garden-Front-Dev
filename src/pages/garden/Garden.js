import React, { useState, useEffect, useContext  } from "react";
import { useParams } from "react-router-dom";
import {  get_by_token } from "../../services/api";
import { useCookies } from "react-cookie";
import { StatusContext } from '../../context/StatusContext';

// Components
import HeaderProfile from "../../components/profile/HeaderProfile";
import BusinessInfo from "../../components/profile/BusinessInfo";
import GardenScore from "../../components/profile/GardenScore";
import Product from "../../components/profile/Product";
import Comment from "../../components/comment/Comment";
import CommentShow from "../../components/comment/CommentShow";

//image
import garden from "../../assets/images/plants/14.jpg";
import parvaneh from "../../assets/images/temp/parvaneh.png";

const Garden = () => {
  const { status, setStatus } = useContext(StatusContext);
  const [garden_info, setGarden_info] = useState({});
  const [cookies, setCookie] = useCookies(["token"]);


  const params = useParams();
  const garden_id = params.gerden_id;


  const fetchData = async () => {
    try {
      const data = await get_by_token(`gardens/${garden_id}/`, cookies['token']);
      console.log(`data is ${data}`);
      setGarden_info(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [garden_id]);

  const {
    address,
    avg_score,
    business_code,
    is_owner,
    profile_photo,
    user_name,
    scores,
    plants,
    phone_number,
    name,
    // business_license_image,
  } = garden_info;

  // const products = [
  //   {
  //     image: plant,
  //     name: "plant",
  //     category: "flow",
  //   },
  //   {
  //     image: pl2,
  //     name: "plant2",
  //     category: "flow",
  //   },
  //   {
  //     image: plant,
  //     name: "plant",
  //     category: "flow",
  //   },
  //   {
  //     image: pl2,
  //     name: "plant2",
  //     category: "flow",
  //   },
  //   {
  //     image: plant,
  //     name: "plant",
  //     category: "flow",
  //   },

  //   {
  //     image: plant,
  //     name: "plant",
  //     category: "flow",
  //   },
  // ];

  const [count, setCount] = useState(4);

  const handleShowMore = () => {
    setCount(count + 5);
  };

  const handleShowLess = () => {
    setCount(4);
  };


  return (
    <div>
      <HeaderProfile
        prof_info={{
          image: profile_photo ? profile_photo : garden,
          name: garden_info.name ? garden_info.name : 'گلخانه شما',
          describe: "گلخانه",
          owner: is_owner,
          link: "/home/garden/setting",
        }}
      />

      <section className="section mt-2">
        <div className="container mt-lg-3">
          <div className="row">
            <GardenScore
              info={{
                score: avg_score ? parseInt(avg_score)  : 0,
                plants_number: Array.isArray(plants) ? plants.length : 0,
              }}
            />
            <div className="col-lg-8 col-12">
              <div className="border-bottom pb-4">
                <div className="row">
                  <BusinessInfo
                    info={{
                      business_id: business_code,
                      image: parvaneh,
                      address: address,
                      admin: user_name,
                      phone: phone_number,
                    }}
                  />

                  <h5 className="mt-4 mb-0">محصولات :</h5>
                  <div className="row">
                    {Array.isArray(plants) &&
                      plants.slice(0, count).map((item, index) => {
                        return (
                          <Product
                            key={index}
                            info={{
                              main_img: item.main_img,
                              name: item.name,
                              type: item.type,
                              id: item.id,
                            }}
                          />
                        );
                      })}
                  </div>

                  <div className="col-12 mt-4 pt-2">
                    {Array.isArray(plants) && count < plants.length && (
                      <div className="btn btn-primary" onClick={handleShowMore}>
                        نمایش بیشتر{" "}
                        <i className="uil uil-angle-left-b align-middle"></i>
                      </div>
                    )}
                    {count > 4 && (
                      <div className="btn btn-primary" onClick={handleShowLess}>
                        نمایش کمتر{" "}
                        <i className="uil uil-angle-left-b align-middle"></i>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col mt-4">
              <h5> نظرات :</h5>

              <ul className="media-list list-unstyled mb-0">
                {Array.isArray(scores) &&
                  scores.map((item) => {
                    return (
                      <CommentShow
                        key={item.id}
                        comment_info={{
                          name: item.user.name,
                          comment_message: item.comment,
                          score: item.score,
                          date: item.date,
                          profile: item.user.image,
                        }}
                      />
                    );
                  })}
              </ul>
            </div>

             {!is_owner && status !== 'usual' && <Comment garden_id={garden_id} />}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Garden;
