import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { notify } from "../../featurs/toast";
import { put_edit_user, post, post_pass } from "../../services/api";
import { useCookies } from "react-cookie";
import { useEffect } from "react";


//images and icons
import avatar from "../../assets/images/avatar-profie.svg";
import userIcon from "../../assets/icons/user-1-svgrepo-com.svg";
import phoneIcon from "../../assets/icons/phone.svg";
import emailIcon from "../../assets/icons/email.svg";
import keyIcon from "../../assets/icons/key.svg";

const EditPersonalInfo = ({ info }) => {
  const [cookies, setCookie] = useCookies(["token"]);
  const [avatarImage, setAvatarImage] = useState();
  const [password, setPassword] = useState({
    old_password: "",
    new_password: "",
    confirm_pass: "",
  });

  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    image: info.image,
    email: "",
    phone_number: ''
  });

  useEffect(() => {
    if (!info.image) {
      setAvatarImage(avatar);
    } else {
      setAvatarImage(info.image);
    }
    setPersonalInfo(info);
  }, [info]);
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAvatar = () => {
    if (avatarImage === avatar) {
      return;
    }
    if (info.image === avatarImage) {
      setAvatarImage(avatar);
    } else if (!info.image) {
      setAvatarImage(avatar);
    } else {
      setAvatarImage(info.image);
    }
  };

  const submitHandeler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', personalInfo.name);
    formData.append('email', personalInfo.email);
    formData.append('phone_number', personalInfo.phone_number);
    formData.append("image", avatarImage);

    const put_result = await put_edit_user(
      "accounts/update-user/",
      formData,
      cookies["token"]
    );
  };

  const changeHandeler = (event) => {
    setPersonalInfo({
      ...personalInfo,
      [event.target.name]: event.target.value,
    });

    console.log(personalInfo);
  };

  const passHandeler = (event) => {
    setPassword({ ...password, [event.target.name]: event.target.value });
  };

  const changePassword = async (event) => {
    console.log(password)
    event.preventDefault();
    if (password.confirm_pass !== password.new_password) {
      notify("پسورد یکسان نیست.", "error");
    } else {
      try{
      const res = await post_pass("accounts/change-password/", {
        old_password: password.old_password,
        new_password: password.new_password,
      }, cookies['token']);

      const detail = res.data.detail;
      console.log(detail)
      notify(detail, "success");
    } catch (error) {
      console.log(error)
      notify("خطا در تغییر رمز عبور.", "error");
    }

    //   console.log(res)
    //   if (res.status === 200) notify("رمز با موفقیت تغییر یافت .");
    // }
  };
}

  return (
    <section className="section mt-2">
      <div className="container mt-lg-3">
        <div className="row">
          <div className="col-lg-8 col-12">
            <div className="card border-0 rounded shadow">
              <div className="card-body">
                <h5 className="text-md-start text-center">جزئیات شخصی :</h5>

                <div className="mt-3 text-md-start text-center d-sm-flex">
                  <div className="mt-3 text-md-start text-center d-sm-flex">
                    <img
                      src={avatarImage}
                      className="avatar float-md-left avatar-medium rounded-circle shadow me-md-4 card-shadow"
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
                </div>

                <form onSubmit={submitHandeler} encType="multipart/form-data">
                  <div className="row mt-4">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">نام </label>
                        <div className="form-icon position-relative">
                          <img
                            src={userIcon}
                            className="fea icon-sm icons"
                            alt=""
                          />
                          <input
                            name="name"
                            defaultValue={personalInfo.name}
                            id="first"
                            type="text"
                            className="form-control ps-5"
                            placeholder="نام "
                            onChange={changeHandeler}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">شماره تلفن :</label>
                        <div className="form-icon position-relative">
                          <img
                            src={phoneIcon}
                            className="fea icon-sm icons"
                            alt=""
                          />
                          <input
                            name="phone_number"
                            defaultValue={personalInfo.phone_number}
                            id="phone_number"
                            type="text"
                            className="form-control ps-5"
                            placeholder="تلفن "
                            onChange={changeHandeler}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">ایمیل </label>
                        <div className="form-icon position-relative">
                          <img
                            src={emailIcon}
                            className="fea icon-sm icons"
                            alt=""
                          />
                          <input
                            name="email"
                            defaultValue={personalInfo.email}
                            id="email"
                            type="email"
                            className="form-control ps-5"
                            placeholder="ایمیل شما "
                            onChange={changeHandeler}
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

                <div className="row">
                  <div className="col-md-6 mt-4 pt-2">
                    <h5>تغییر رمز عبور : </h5>
                    <form>
                      <div className="row mt-4">
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label className="form-label">
                              رمز عبور قدیمی :{" "}
                            </label>
                            <div className="form-icon position-relative">
                              <img
                                src={keyIcon}
                                className="fea icon-sm icons"
                                alt=""
                              />
                              <input
                                type="password"
                                name="old_password"
                                value={password.old_password}
                                className="form-control ps-5"
                                placeholder="رمز قدیمی"
                                required=""
                                onChange={passHandeler}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label className="form-label">
                              رمز عبور جدید :{" "}
                            </label>
                            <div className="form-icon position-relative">
                              <img
                                src={keyIcon}
                                className="fea icon-sm icons"
                                alt=""
                              />
                              <input
                                type="password"
                                name="new_password"
                                value={password.new_password}
                                className="form-control ps-5"
                                placeholder="رمز جدید"
                                required=""
                                onChange={passHandeler}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label className="form-label">
                              تایید رمز عبور جدید :{" "}
                            </label>
                            <div className="form-icon position-relative">
                              <img
                                src={keyIcon}
                                className="fea icon-sm icons"
                                alt=""
                              />
                              <input
                                type="password"
                                name="confirm_pass"
                                value={password.confirm_pass}
                                className="form-control ps-5"
                                placeholder="رمز عبور جدید"
                                required=""
                                onChange={passHandeler}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-12 mt-2 mb-0">
                          <button
                            className="btn btn-primary"
                            onClick={changePassword}
                          >
                            ذخیره رمز عبور{" "}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* 
            // Delete account
            <div className="rounded shadow mt-4">
              <div className="p-4 border-bottom">
                <h5 className="mb-0 text-danger">حذف اکانت :</h5>
              </div>

              <div className="p-4">
                <h6 className="mb-0">
                  آیا می خواهید حساب را حذف کنید؟ لطفاً زیر دکمه "حذف" را فشار
                  دهید
                </h6>
                <div className="mt-4">
                  <button className="btn btn-danger">حذف اکانت</button>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <ToastContainer />
    </section>
  );
};

export default EditPersonalInfo;
