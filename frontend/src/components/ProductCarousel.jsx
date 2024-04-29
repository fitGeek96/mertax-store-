import React from "react";
import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";

const ProductCarousel = () => {
  const { data, isLoading, error, refetch } = useGetTopProductsQuery();
  return (
    <Carousel pause="hover" className="bg-dark mb-4">
      {isLoading && <Loader />}
      {error && <Message variant="danger">{error?.data?.message}</Message>}
      {data?.products?.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/products/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid />
            <Carousel.Caption className="carousel-caption">
              <h3>
                {product.name} DZD {product.price}
              </h3>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
