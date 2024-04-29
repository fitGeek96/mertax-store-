import React from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Meta from "../components/Meta";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import { useSelector } from "react-redux";
import ProductCarousel from "../components/ProductCarousel";
import HeroSection from "../components/HeroSection";
// import axios from "axios";

const HomeScreen = () => {
  const { keyword, pageNumber } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({
    keyword,
    pageNumber,
  });
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <>
      <Meta title={"La Parisienne"} />
      <HeroSection />
      <h1 className="my-3">Nos Articles</h1>
      {!keyword ? (
        ""
      ) : (
        <Link to={`/`} className="btn btn-light mb-4">
          Retour
        </Link>
      )}
      <Row>
        {isLoading && <Loader />}
        {isError && (
          <Message variant="danger">
            {isError?.data?.message || isError.error}
          </Message>
        )}

        {data?.products?.map((product) => (
          <Col key={product._id} xs={6} sm={6} md={4} lg={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>

      <Paginate
        pages={data?.pages}
        page={data?.page}
        isAdmin={userInfo?.isAdmin}
        keyword={keyword ? keyword : ""}
      />
    </>
  );
};

export default HomeScreen;
