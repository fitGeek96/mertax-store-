import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }) => {
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  return (
    <Card className="mb-3">
      <Link to={`/products/${product._id}`}>
        <Card.Img variant="top" src={product.image} />
      </Link>
      <Card.Body>
        <Card.Title as={"div"} className="product-title">
          <Link to={`/products/${product._id}`}>
            <strong>{product.name}</strong>
          </Link>
        </Card.Title>
        <Card.Text as={"h6"}>
          DA {formatPrice(product.price)}
          <Rating value={product.rating} text={product.numReviews} />
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
