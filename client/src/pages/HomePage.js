import React, { useState, useEffect } from "react";
import image from "../assets/mobile_legend.jpg";
import bg_header from "../assets/bg-header";
import { Link, useNavigate } from "react-router-dom";
import { AiFillFilter } from "react-icons/ai";
import Lottie from "react-lottie";
import * as loadAnimation from "../assets/lottie/73133-car-animation-front-view.json";
import * as successAnimation from "../assets/lottie/4022-success-animation.json";
import { allListPaket } from "../axios/userAxios";

const HomePage = () => {
  const [currentPage, setcurrentPage] = useState(1);
  const [itemsPerPage, setitemsPerPage] = useState(5);
  const [pageNumberLimit, setpageNumberLimit] = useState(5);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);
  const [loading, setLoading] = useState(undefined);
  const [completed, setCompleted] = useState(undefined);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([])
  
  useEffect(() => {
    setTimeout(() => {
      allListPaket((result) => {
        setLoading(true);
        setData(result);
        setFilter(result);
      });
      setTimeout(() => {
        setCompleted(true);
      }, 500);
    }, 700);
  }, []);

  const searchHandler = (keyword) => {
    if (keyword === "") {
      setFilter(data);
    } else {
      setFilter(
        data.filter(
          (item) =>
            item.description.toUpperCase().includes(keyword) ||
            item.description.toLowerCase().includes(keyword)
        )
      );
    }
  };

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

  const renderData = (input) => {
    return (
      <div className="row row-cols-2 row-cols-lg-5 g-2 g-lg-2">
        {input.length > 0 ? (
          input.map((item) => {
            // const { id, name, since_year, image } = brand;
            return (
              <div className="col">
                <Link to={`/joki/${item.id}`}>
                  <div className="border rounded grid-hover card-list">
                    <div className="p-1">
                      <img
                        className="rounded img-wrap-list mx-auto d-block"
                        src={`http://localhost:3000/uploaded/${item.image}`}
                        alt=""
                      />
                      <div className="p-1">
                        <div className="fs-3 title-wrap">Paket {item.id}</div>
                        <hr className="divider" />
                        <div className="text-description-time">
                          {item.description}
                        </div>
                        <div className="d-flex justify-content-between">
                          <div>{item.price}</div>
                          <div>{item.user.nama}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        ) : (
          <h4>Data Kosong</h4>
        )}
      </div>
    );
  };

  const pages = [];
  for (let i = 1; i <= Math.ceil(filter.length / itemsPerPage); i++) {
    pages.push(i);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filter.slice(indexOfFirstItem, indexOfLastItem);

  // console.log(filter.length);

  const handleClick = (event) => {
    setcurrentPage(event.target.id);
  };

  // console.log(currentPage);

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

  // const filterHandler = (e) => {};

  return (
    <>
      {!completed ? (
        <>
          <div className="wrap-lottie">
            {!loading ? (
              <Lottie options={defaultOptions1} height={500} width={500} />
            ) : (
              <Lottie options={defaultOptions2} height={500} width={500} />
            )}
          </div>
        </>
      ) : (
        <>
          <img src={bg_header} alt="" className="bg-header" />
          {/* BsFilterSquare */}
          <div className="container pt-4 pb-5">
            <div className="d-flex justify-content-between">
              <div className="d-flex">
                <form className="search-width">
                  <input
                    className="form-control me-1"
                    type="search"
                    placeholder="Search by name"
                    aria-label="Search"
                    onChange={(e) => searchHandler(e.target.value)}
                  />
                </form>
                <button
                  className="btn btn-secondary mb-3 mx-2"
                  
                >
                  <AiFillFilter></AiFillFilter> Filter
                </button>
              </div>
              <div>
                <ul className="pageNumbers text-white d-flex justify-content-center">
                  <li className="p-1">
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
            </div>
            {renderData(currentItems)}
          </div>
        </>
      )}
    </>
  );
};

export default HomePage;
