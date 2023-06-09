import React, { useState, useEffect } from "react";
import { createPaket } from "../../axios/jokiAxios";
import { useNavigate } from "react-router-dom";

const AddJoki = () => {
  const imageMimeType = /image\/(png|jpg|jpeg)/i;
  const [file, setFile] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(null);
  const [form, setForm] = useState({
    // name: "",
    description: "",
    image: null,
    price: 0,
  });

  const navigate = useNavigate();

  const changeHandler = (e) => {
    const file = e.target.files[0];
    if (!file.type.match(imageMimeType)) {
      alert("Image mime type is not valid");
      return;
    }
    setFile(file);
    setForm({ ...form, image: e.target.files[0] });
  };

  useEffect(() => {
    let fileReader,
      isCancel = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileDataURL(result);
        }
      };
      fileReader.readAsDataURL(file);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [file]);

  const submitHandler = () => {
    createPaket(form)
    navigate("/joki")
    window.location.reload();
  };

  return (
    <>
      <div className="container px-2 pb-3 wrap-content-not-full">
        <div className="text-white row gx-5">
          <div className="col position-relative">
            <img
              src={fileDataURL ?? "https://placehold.co/200x200"}
              className="img-preview"
              alt="..."
            />
          </div>
          <div className="col">
            <h3>Add Joki</h3>
            <form className="pb-3">
              {/* <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div> */}
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  type="text"
                  className="form-control"
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control"
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".png, .jpg, .jpeg"
                  onChange={changeHandler}
                />
              </div>
              <button
                onClick={submitHandler}
                type="submit"
                className="btn btn-secondary"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddJoki;
