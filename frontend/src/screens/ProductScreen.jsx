import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Card,
  Button,
  Form,
  Carousel,
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

  const statesWithShippingPrices = {
    tipaza: 600,
    medea: 600,
    blida: 600,
    bouira: 600,
    "tizi ouzou": 600,
    constantine: 600,
    bejaia: 600,
    skikda: 600,
    oran: 600,
    mila: 600,
    mascara: 600,
    setif: 600,
    mostaganem: 600,
    tlemcen: 700,
    "sidi bel abbes": 700,
    "ain temouchent": 700,
    guelma: 700,
    relizane: 700,
    "oum el bouaghi": 700,
    chlef: 700,
    tissemsilt: 700,
    jijel: 700,
    "borjd bou ariridj": 700,
    batna: 700,
    tiaret: 750,
    saida: 750,
    annaba: 750,
    "el tarf": 750,
    "souk ahras": 800,
    msila: 800,
    tebessa: 900,
    biskra: 900,
    "el oued": 900,
    ouergla: 900,
    "ouled djellal": 900,
    khenchla: 900,
    "el mghaier": 900,
    tougourt: 900,
    ghardaia: 900,
    laghouat: 900,
    djelfa: 900,
    bechar: 1000,
    naama: 1000,
    "el bayadh": 1000,
    alger: 400,
  };

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useGetProductDetailsQuery(productId);

  const [qty, setQty] = useState(0);
  const [size, setSize] = useState(38);
  const [color, setColor] = useState("Vert");
  const [city, setCity] = useState("Alger");
  const [totalPrice, setTotalPrice] = useState(0);
  const [shippingPrice, setShippingPrice] = useState(0);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const [
    createReview,
    { isLoading: loadingProductReview, error: reviewError },
  ] = useCreateReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?._id;

  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const calculateTotalPrice = (productPrice, qty, city) => {
    const shippingPrice = statesWithShippingPrices[city?.toLowerCase()] || 0;
    return productPrice * qty + shippingPrice;
  };

  const addToCartHandler = (product, qty, size, color, newCity) => {
    const newTotalPrice = calculateTotalPrice(product?.price, qty, newCity);

    setTotalPrice(newTotalPrice);

    dispatch(
      addToCart({
        ...product,
        qty,
        size,
        color,
        shippingPrice,
        totalPrice: newTotalPrice,
      }),
    );
  };

  useEffect(() => {
    setShippingPrice(statesWithShippingPrices[city.toLowerCase()] || 0);
  }, [city]);

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
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={"/images/r1.png"}
                alt={product?.name}
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={"/images/r2.png"}
                alt={product?.name}
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={"/images/r3.png"}
                alt={product?.name}
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={"/images/r4.png"}
                alt={product?.name}
              />
            </Carousel.Item>
          </Carousel>
        </Col>

        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item as="h4">{product?.name}</ListGroup.Item>
            {/* <ListGroup.Item>
              <div className="rating">
                <FaStar color="#ffc107" />
                <span>{product?.rating}</span>
                <span className="ms-1">({product?.numReviews} avis)</span>
              </div>
            </ListGroup.Item> */}
            <ListGroup.Item>
              <strong>Description:</strong> <br />
              <h4>{product?.description}</h4>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Prix:</Col>
                  <Col className="text-center" as={"h6"}>
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
                        onChange={(e) => {
                          const newQty = Number(e.target.value);
                          setQty(newQty);
                          const newTotalPrice = calculateTotalPrice(
                            product?.price,
                            newQty,
                            city,
                          );
                          setTotalPrice(newTotalPrice);
                        }}
                        className="text-center p-0 m-auto w-50"
                      >
                        {Array.from(
                          { length: product?.countInStock },
                          (v, i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ),
                        )}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Row>
                  <Col>Taille:</Col>
                  <Col>
                    <Form.Control
                      as="select"
                      value={size}
                      onChange={(e) => {
                        setSize(e.target.value);
                        addToCartHandler(product, qty, e.target.value, color);
                      }}
                      className="text-center p-0 m-auto w-50"
                    >
                      {product?.size.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Couleur:</Col>
                  <Col>
                    <Form.Control
                      as="select"
                      value={color}
                      onChange={(e) => {
                        setColor(e.target.value);
                        addToCartHandler(product, qty, size, e.target.value);
                      }}
                      className="text-center p-0 m-auto w-50"
                    >
                      {product?.color.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Wilaya:</Col>
                  <Col>
                    <Form.Control
                      as="select"
                      value={city}
                      onChange={(e) => {
                        const newCity = e.target.value;
                        setCity(newCity);
                        const newTotalPrice = calculateTotalPrice(
                          product?.price,
                          qty,
                          newCity,
                        );

                        setTotalPrice(newTotalPrice);
                        addToCartHandler(product, qty, size, color, newCity);
                      }}
                      className="text-center p-0 m-auto w-50"
                    >
                      <option value="">{city}</option>
                      <option value="tipaza">Tipaza</option>
                      <option value="medea">Medea</option>
                      <option value="blida">Blida</option>
                      <option value="bouira">Bouira</option>
                      <option value="tizi ouzou">Tizi Ouzou</option>
                      <option value="constantine">Constantine</option>
                      <option value="bejaia">Bejaia</option>
                      <option value="skikda">Skikda</option>
                      <option value="oran">Oran</option>
                      <option value="mila">Mila</option>
                      <option value="mascara">Mascara</option>
                      <option value="setif">Setif</option>
                      <option value="mostaganem">Mostaganem</option>
                      <option value="tlemcen">Tlemcen</option>
                      <option value="sidi bel abbes">Sidi Bel Abbes</option>
                      <option value="ain temouchent">Ain Temouchent</option>
                      <option value="guelma">Guelma</option>
                      <option value="relizane">Relizane</option>
                      <option value="oum el bouaghi">Oum El Bouaghi</option>
                      <option value="chlef">Chlef</option>
                      <option value="tissemsilt">Tissemsilt</option>
                      <option value="jijel">Jijel</option>
                      <option value="borjd bou ariridj">
                        Borjd Bou Ariridj
                      </option>
                      <option value="batna">Batna</option>
                      <option value="tiaret">Tiaret</option>
                      <option value="saida">Saida</option>
                      <option value="annaba">Annaba</option>
                      <option value="el tarf">El Tarf</option>
                      <option value="souk ahras">Souk Ahras</option>
                      <option value="msila">Msila</option>
                      <option value="tebessa">Tebessa</option>
                      <option value="biskra">Biskra</option>
                      <option value="el oued">El Oued</option>
                      <option value="ouergla">Ouergla</option>
                      <option value="ouled djellal">Ouled Djellal</option>
                      <option value="khenchla">Khenchla</option>
                      <option value="el mghaier">El Mghaier</option>
                      <option value="tougourt">Tougourt</option>
                      <option value="ghardaia">Ghardaia</option>
                      <option value="laghouat">Laghouat</option>
                      <option value="djelfa">Djelfa</option>
                      <option value="bechar">Bechar</option>
                      <option value="naama">Naama</option>
                      <option value="el bayadh">El Bayadh</option>
                      <option value="alger">Alger</option>
                      {/* Add other options for all states */}
                    </Form.Control>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Prix de Livraison:</Col>
                  <Col className="text-center text-danger">
                    <strong>
                      DA <span> {formatPrice(shippingPrice)}</span>
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Prix Total:</Col>
                  <Col className="text-center text-danger">
                    <strong>
                      DA <span> {formatPrice(totalPrice)}</span>
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="text-center">
                <Button
                  variant="danger text-white"
                  size="lg"
                  disabled={product?.countInStock === 0}
                  onClick={() => navigate("/shipping")}
                >
                  Ajouter au panier
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
      {/* <Row className="review">
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
      </Row> */}
    </>
  );
};

export default ProductScreen;
