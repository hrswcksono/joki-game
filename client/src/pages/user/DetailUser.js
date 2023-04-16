import React, { useState, useEffect } from "react";
import { detailUser } from "../../axios/userAxios";

const DetailUser = () => {
  const imageMimeType = /image\/(png|jpg|jpeg)/i;
  const [update, setUpdate] = useState(false);
  const [file, setFile] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(null);
  const [form, setForm] = useState({
    nama: "",
    username: "",
    password: "",
    role: "",
    contact: "",
    image: null,
    description: "",
  });

  const changeHandler = (e) => {
    const file = e.target.files[0];
    if (!file.type.match(imageMimeType)) {
      alert("Image mime type is not valid");
      return;
    }
    setFile(file);
    setForm({ ...form, image: e.target.files[0] });
  };

  const getUserData = () => {
    detailUser((result) => {
      setForm({
        nama: result.nama,
        username: result.username,
        contact: result.contact,
        description: result.description,
        role: result.role
      });
    });
  };

  useEffect(() => {
    getUserData()
  }, []);

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

  const handlerUpdate = () => {
    if (update === false) {
      setUpdate(true);
    } else {
      setUpdate(false);
    }
  };

  const submitUpdate = () => {};

  return (
    <>
      <h4 className="text-center">Detail User</h4>
      <div className="container px-2 pb-3">
        <div className="row gx-5">
          <div className="col position-relative">
            <p className="img-preview-wrapper">
              <img
                src={fileDataURL ?? "https://placehold.co/200x200"}
                className="img-preview"
                alt="..."
              />
            </p>
          </div>
          <div className="col">
            <div className="">
              <form>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    disabled={!update}
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    disabled={!update}
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contact</label>
                  <input
                    type="text"
                    className="form-control"
                    disabled={!update}
                    value={form.contact}
                    onChange={(e) =>
                      setForm({ ...form, contact: e.target.value })
                    }
                  />
                </div>
                <div
                  className="mb-3"
                  style={{ display: update ? null : "none" }}
                >
                  <label className="form-label">Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept=".png, .jpg, .jpeg"
                    onChange={changeHandler}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    disabled={!update}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3" style={{ display: "none" }}>
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    //   onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <input
                    type="text"
                    disabled={!update}
                    className="form-control"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  />
                </div>
                {update ? (
                  <>
                    <div className="d-flex">
                      <button
                        onClick={submitUpdate}
                        type="submit"
                        className="btn btn-secondary"
                      >
                        Submit
                      </button>
                      <button
                        onClick={handlerUpdate}
                        type="submit"
                        className="btn btn-secondary mx-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handlerUpdate}
                      type="submit"
                      className="btn btn-secondary"
                    >
                      Update
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailUser;