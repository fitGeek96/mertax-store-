import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import Rating from "../components/Rating";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart } from "../slices/cartSlice";
import { toast } from "react-toastify";
import Meta from "../components/Meta";
import { FaStar, FaComment, FaArrowLeft } from "react-icons/fa";

const ProductScreen = () => {
  const { id: productId } = useParams();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useGetProductDetailsQuery(productId);

  const [
    createReview,
    { isLoading: loadingProductReview, error: reviewError },
  ] = useCreateReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?._id;

  const addToCartHandler = () => {
    dispatch(
      addToCart({
        ...product,
        qty,
      }),
    );
    navigate("/cart");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Votre commentaire a été envoyé");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error?.data?.message || error?.error);
    }
  };

  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <>
      <Meta title={product?.name} />
      <Link to="/" className="btn btn-light my-3 ms-3">
        <FaArrowLeft /> Retour
      </Link>
      {isLoading && <Loader />}
      {isError && (
        <Message variant="danger">
          {isError?.data?.message || isError.error}
        </Message>
      )}
      <Row>
        <Col md={5}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Image src={product?.image} alt={product?.name} fluid rounded />
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item as="h4">{product?.name}</ListGroup.Item>
            <ListGroup.Item>
              <div className="rating">
                <FaStar color="#ffc107" />
                <span>{product?.rating}</span>
                <span className="ms-1">({product?.numReviews} avis)</span>
              </div>
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Description:</strong> {product?.description}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Prix:</Col>
                  <Col className="text-center">
                    <strong>DA {formatPrice(product?.price)}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Etat:</Col>
                  <Col className="text-center">
                    <strong>
                      {product?.countInStock > 0
                        ? "Disponible"
                        : "En rupture de stock"}
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              {product?.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Quantité:</Col>
                    <Col>
                      <Form.Control
                        as="select"
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="text-center p-0 m-auto w-50"
                      >
                        {Array.from(
                          { length: product?.countInStock },
                          (v, i) => (
                            <option key={i} value={i + 1}>
                              {i + 1}
                            </option>
                          ),
                        )}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}
              <ListGroup.Item className="text-center">
                <Button
                  variant="danger text-white"
                  size="lg"
                  disabled={product?.countInStock === 0}
                  onClick={addToCartHandler}
                >
                  Ajouter au panier
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
      <Row className="review">
        <Col md={6}>
          <h2>
            <FaComment /> Commentaires
          </h2>
          {product?.reviews?.length === 0 && (
            <Message>Aucun commentaire</Message>
          )}
          <ListGroup variant="flush">
            {product?.reviews?.map((review) => (
              <ListGroup.Item key={review._id}>
                <strong>{review.name}</strong>
                <div className="rating">
                  <Rating value={review.rating} />
                </div>
                <p>{review.createdAt.substring(0, 10)}</p>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))}
            <ListGroup.Item>
              <h2>Laisser un commentaire</h2>
              {loadingProductReview && <Loader />}
              {userInfo ? (
                <Form onSubmit={submitHandler}>
                  <Form.Group className="my-2" controlId="rating">
                    <Form.Label>Rating</Form.Label>
                    <Form.Control
                      as="select"
                      required
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option value="1">1 - Mauvais</option>
                      <option value="2">2 - Équitable</option>
                      <option value="3">3 - Beau</option>
                      <option value="4">4 - Très beau</option>
                      <option value="5">5 - Excellent</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group className="my-2" controlId="comment">
                    <Form.Label>Commentaires</Form.Label>
                    <Form.Control
                      as="textarea"
                      row="3"
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </Form.Group>
                  <Button
                    disabled={loadingProductReview}
                    type="submit"
                    variant="primary"
                    className="w-100"
                  >
                    Envoyer
                  </Button>
                </Form>
              ) : (
                <Message>
                  Veuillez vous <Link to="/login">connecter</Link> pour écrire
                  un commentaire
                </Message>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default ProductScreen;
