import React, { useState, useEffect } from "react";
import ReactStars from "react-rating-stars-component";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import Lottie from "react-lottie";
import * as loadAnimation from "../../assets/lottie/73133-car-animation-front-view.json";
import * as successAnimation from "../../assets/lottie/4022-success-animation.json";
import { deleteOrder, listOrder, rateOrderDone } from "../../axios/userAxios";
import { jokiDone, paketOrdered } from "../../axios/jokiAxios";
import { toDateOrder } from "../../helpers/utlis";

const ListOrder = (props) => {
  const { loginStatus } = props;
  const [currentPage, setcurrentPage] = useState(1);
  const [itemsPerPage, setitemsPerPage] = useState(6);
  const [data, setData] = useState([]);
  const [pageNumberLimit, setpageNumberLimit] = useState(6);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(6);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);
  const [loading, setLoading] = useState(undefined);
  const [completed, setCompleted] = useState(undefined);
  const [filter, setFilter] = useState(false);
  const [classFilter1, setClassFilter1] = useState("btn btn-light");
  const [classFilter2, setClassFilter2] = useState("btn btn-light mt-2");
  const [dataFilter, setDataFilter] = useState([]);
  const [star, setStar] = useState({
    rating: 0,
  });

  const filterOrders = (input) => {
    if (input === "in") {
      if (filter === false) {
        setClassFilter1("btn btn-secondary");
        setClassFilter2("btn btn-light mt-2");
        setFilter(true);
        filterOrderByStatus(false);
      } else {
        setClassFilter1("btn btn-light");
        filterOrderByStatus(null);
        setFilter(false);
      }
    } else if (input === "done") {
      if (filter === false) {
        setClassFilter1("btn btn-light");
        setClassFilter2("btn btn-secondary mt-2");
        setFilter(true);
        filterOrderByStatus(true);
      } else {
        setClassFilter2("btn btn-light mt-2");
        setFilter(false);
        filterOrderByStatus(null);
      }
    }
  };

  const filterOrderByStatus = (keyword) => {
    if (keyword === null) {
      setDataFilter(data);
    } else {
      setDataFilter(data.filter((item) => item.status === keyword));
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (loginStatus.role === "user") {
        listOrder((result) => {
          setLoading(true);
          setData(result);
          setDataFilter(result);
        });
      } else {
        paketOrdered((result) => {
          setLoading(true);
          setData(result);
          setDataFilter(result);
        });
      }
      setTimeout(() => {
        setCompleted(true);
      }, 500);
    }, 700);
  }, []);

  const defaultOptions1 = {
    loop: true,
    autoplay: true,
    animationData: loadAnimation.default,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: successAnimation.default,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // const navigate = useNavigate();

  // const deleteHandler = (id) => {
  //   deleteOrder(id);
  // };

  const orderDoneHandler = (id) => {
    jokiDone(+id);
    window.location.reload();
  };

  const ratingChanged = (newRating) => {
    setStar({ ...star, rating: newRating });
  };

  const rateOrderHandler = (id) => {
    rateOrderDone(+id, star);
    window.location.reload();
  };

  const renderData = (input) => {
    return (
      <>
        <h4>My Order</h4>
        <div className="d-flex pb-4">
          <div>
            <h5>Filter :</h5>
            <button
              className={classFilter1}
              onClick={() => filterOrders("in")}
              type=""
            >
              {loginStatus.role === "user" ? "Order not completed" : "Order in"}
            </button>

            <button
              className={classFilter2}
              onClick={() => filterOrders("done")}
              type=""
            >
              {loginStatus.role === "user" ? "Order completed" : "Order done"}
            </button>
          </div>
          <div className="container text-center text-black">
            <div className="row g-0">
              {input.map((item) => {
                const { id, paket, rating, status, user, createdAt } = item;
                return (
                  <>
                    <div className="col-5 bg-light card p-2 mx-3 mt-2">
                      <div className="pb-5 text-black">
                        <div className="d-flex justify-content-between">
                          <h5 className="mb-1">Paket Joki {paket.id}</h5>
                          <small>{toDateOrder(createdAt)}</small>
                        </div>
                        <div className="align-item-center">
                          <h6 className="mb-1 mt-2">
                            {loginStatus.role === "user"
                              ? `Penjoki : ${paket.user.nama}`
                              : `Pemesan : ${user.nama}`}
                          </h6>
                          {/* <small>Rating {rating}</small> */}
                          <strong>
                            {status ? "Selesai" : "Belum selesai"}
                          </strong>
                          <br />
                          <br />
                        </div>
                        <div className="position-absolute bottom-0 end-0 pb-2 px-2">
                          {/* <Link
                            onClick={() => deleteHandler()}
                            className="btn btn-danger"
                          >
                            <AiOutlineDelete />
                          </Link> */}
                          {loginStatus.role === "user" &&
                          rating === 0 &&
                          status ? (
                            <>
                              <ReactStars
                                count={5}
                                onChange={ratingChanged}
                                value={rating}
                                size={24}
                                activeColor="#ffd700"
                              />
                              <button
                                className="btn btn-outline-warning"
                                type=""
                                onClick={() => rateOrderHandler(id)}
                              >
                                Rate
                              </button>
                            </>
                          ) : null}
                          {loginStatus.role === "joki" && !status ? (
                            <>
                              <button
                                onClick={() => orderDoneHandler(id)}
                                className="btn btn-outline-dark"
                                type=""
                              >
                                Done
                              </button>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
          {/* <div className="list-group mx-3">
            {input.map((item) => {
              const { paket, rating, status, user, createdAt } = item;
              return (
                <>
                  <Link
                    href="#"
                    className="list-group-item list-group-item-action flex-column align-items-start pb-5"
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1">Paket Joki {paket.id}</h5>
                      <small>{createdAt}</small>
                    </div>
                    <p className="mb-1">{user.nama}</p>
                    <small>Rating {rating}</small>
                    <br />
                    <small>Status {status.toString()}</small>
                    <div className="position-absolute bottom-0 end-0 pb-2 px-2">
                      <Link
                        onClick={() => deleteHandler()}
                        className="btn btn-danger"
                      >
                        <AiOutlineDelete />
                      </Link>
                    </div>
                  </Link>
                </>
              );
            })}
          </div> */}
          <ul className="pageNumbers text-white h-25">
            <li>
              <button
                onClick={handlePrevbtn}
                disabled={currentPage === pages[0] ? true : false}
              >
                Prev
              </button>
            </li>
            {pageDecrementBtn}
            {renderPageNumbers}
            {pageIncrementBtn}
            <li>
              <button
                onClick={handleNextbtn}
                disabled={
                  currentPage === pages[pages.length - 1] ? true : false
                }
              >
                Next
              </button>
            </li>
          </ul>
        </div>
      </>
    );
  };

  const pages = [];
  for (let i = 1; i <= Math.ceil(dataFilter.length / itemsPerPage); i++) {
    pages.push(i);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataFilter.slice(indexOfFirstItem, indexOfLastItem);

  // console.log(data.length);

  const handleClick = (event) => {
    setcurrentPage(event.target.id);
  };

  const renderPageNumbers = pages.map((number) => {
    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
      return (
        <li
          key={number}
          id={number}
          // onClick={handleClick}
          className={currentPage === number ? "active" : null}
        >
          {number}
        </li>
      );
    } else {
      return null;
    }
  });

  const handleNextbtn = () => {
    setcurrentPage(currentPage + 1);
    if (currentPage + 1 > maxPageNumberLimit) {
      setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };

  const handlePrevbtn = () => {
    setcurrentPage(currentPage - 1);
    if ((currentPage - 1) % pageNumberLimit === 0) {
      setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };

  let pageIncrementBtn = null;
  if (pages.length > maxPageNumberLimit) {
    pageIncrementBtn = <li onClick={handleNextbtn}> &hellip; </li>;
  }

  let pageDecrementBtn = null;
  if (minPageNumberLimit >= 1) {
    pageDecrementBtn = <li onClick={handlePrevbtn}> &hellip; </li>;
  }

  return (
    <>
      {!completed ? (
        <>
          <div className="wrap-lottie-other">
            {!loading ? (
              <Lottie options={defaultOptions1} height={500} width={500} />
            ) : (
              <Lottie options={defaultOptions2} height={500} width={500} />
            )}
          </div>
        </>
      ) : (
        <>
          <div className="wrap-list-order">{renderData(currentItems)}</div>
        </>
      )}
    </>
  );
};

export default ListOrder;
