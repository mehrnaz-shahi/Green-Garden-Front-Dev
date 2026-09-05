import React, { useEffect } from "react";
import { putData } from "../../services/api";
import { useCookies } from "react-cookie";

//Icons
import idIcon from "../../assets/icons/idIcon.svg";
import location from "../../assets/icons/location.svg";
import businessMan from "../../assets/icons/business-man.svg";
import phoneIcon from "../../assets/icons/phone.svg";
import leaf from "../../assets/icons/garden-holiday-nature-outdoor-plant-summer-svgrepo-com.svg";
import camera from "../../assets/icons/camera-svgrepo-com.svg";
//image
import garden from "../../assets/images/plants/14.jpg";
import { useState } from "react";

const EditBussinessInfo = ({ information }) => {
  const [avatarImage, setAvatarImage] = useState(garden);
  const [businessImage, setBusinessImage] = useState();
  const [info, setInfo] = useState({});
  const [cookies, setCookie] = useCookies(["token"]);


  useEffect(() => {
    setInfo({
      name: information.name,
      // profile_photo: information.profile_photo,
      business_code: information.business_code,
      phone_number: information.phone_number,
      address: information.address,
    });
    setAvatarImage(information.profile_photo ? information.profile_photo : garden);

  }, [information])

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAvatar = () => {
    if (avatarImage === garden) {
      return;
    }
    if (information.profile_photo === avatarImage) {
      setAvatarImage(garden);
    } else if (!information.profile_photo) {
      setAvatarImage(garden);
    } else {
      setAvatarImage(information.profile_photo);
    }

  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setBusinessImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    console.log(info)
    const formData = new FormData();
    formData.append("image", avatarImage);

    const formData2 = new FormData();
    formData2.append(" business_image", businessImage);

    // setInfo({ ...info, profile_photo: formData, business_image: formData2 });
    putData("gardens/update/", info, cookies['token']);

  };

  const changeHandler = (event) => {
    setInfo({ ...info, [event.target.name]: event.target.value });
  };

  return (
    <section className="section mt-2">
      <div className="container mt-lg-3">
        <div className="row">
          <div className="col-lg-8 col-12">
            <div className="card border-0 rounded shadow">
              <div className="card-body">
                <h5 className="text-md-start text-center">جزئیات گلخانه :</h5>

                <div className="mt-3 text-md-start text-center d-sm-flex">
                  <img
                    src={avatarImage}
                    className="avatar float-md-left avatar-medium rounded-circle shadow me-md-4"
                    alt=""
                  />

                  <div className="mt-md-4 mt-3 mt-sm-0">
                    <label
                      htmlFor="avatarInput"
                      className="btn btn-primary mt-2"
                    >
                      تغییر تصویر
                      <input
                        id="avatarInput"
                        type="file"
                        accept="image/*"
                        className="d-none"
                        onChange={handleAvatarChange}
                      />
                    </label>
                    <button
                      className="btn btn-outline-primary mt-2 ms-2"
                      onClick={handleDeleteAvatar}
                    >
                      حذف
                    </button>
                  </div>
                </div>

                <form onSubmit={submitHandler}>
                  <div className="row mt-4">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label"> نام گلخانه :</label>
                        <div className="form-icon position-relative">
                          <img
                            src={leaf}
                            className="fea icon-sm icons"
                            alt=""
                          />
                          <input
                            name="name"
                            defaultValue={info.name}
                            type="text"
                            className="form-control ps-5"
                            placeholder="نام گلخانه "
                            onChange={changeHandler}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">شناسه کسب و کار :</label>
                        <div className="form-icon position-relative">
                          <img
                            src={idIcon}
                            className="fea icon-sm icons"
                            alt=""
                          />
                          <input
                            name="business_code"
                            defaultValue={info.business_code}
                            type="text"
                            className="form-control ps-5"
                            placeholder="شناسه کسب و کار "
                            onChange={changeHandler}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label"> تلفن :</label>
                        <div className="form-icon position-relative">
                          <img
                            src={phoneIcon}
                            className="fea icon-sm icons"
                            alt=""
                          />
                          <input
                            name="phone_number"
                            defaultValue={info.phone_number}
                            type="text"
                            className="form-control ps-5"
                            placeholder="تلفن "
                            onChange={changeHandler}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">آدرس :</label>
                        <div className="form-icon position-relative">
                          <img
                            src={location}
                            className="fea icon-sm icons"
                            alt=""
                          />
                          <input
                            name="address"
                            defaultValue={info.address}
                            id="address"
                            type="text"
                            className="form-control ps-5"
                            placeholder="آدرس شما "
                            onChange={changeHandler}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">پروانه کسب : </label>

                        <div id="suggest">
                          <label
                            htmlFor="imageInput"
                            className="btn btn-primary"
                            style={{ height: "40px" }}
                          >
                            <img
                              src={camera}
                              alt=""
                              style={{ height: "25px" }}
                            />
                            بارگذاری عکس
                            <input
                              id="imageInput"
                              type="file"
                              accept="image/*"
                              className="d-none"
                              onChange={handleImageChange}
                            />
                          </label>
                        </div>

                        <div className="mt-3 text-center d-sm-flex b-image">
                          <img
                            src={businessImage}
                            style={{ maxWidth: "200px", maxHeight: "200px" }}
                            className="avatar float-md-left  shadow me-md-4"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6"></div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12">
                      <input
                        type="submit"
                        id="submit"
                        name="send"
                        className="btn btn-primary"
                        value="ذخیره تغییرات"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditBussinessInfo;
