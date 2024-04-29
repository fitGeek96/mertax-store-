import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
  Container,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../slices/cartSlice";

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Container>
      <Row>
        <Col md={8} xs={12}>
          <h1 className="mb-3">Panier</h1>
          {cartItems.length === 0 ? (
            <Message variant={"info"}>
              Votre panier est vide <Link to="/">Retour</Link>
            </Message>
          ) : (
            <ListGroup variant="flush">
              {cartItems?.map((item) => (
                <ListGroup.Item key={item._id} className="border-0">
                  <Row className="align-items-center">
                    {/* Adjusted column sizes for mobile */}
                    <Col xs={12} className="text-center mb-3">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fluid
                        rounded
                        className="w-50"
                      />
                    </Col>
                    {/* <Col xs={12} className="text-md-start mt-3">
                      <Link
                        to={`/products/${item._id}`}
                        className="text-decoration-none"
                      >
                        <h6 className="mb-0">{item.name}</h6>
                      </Link>
                    </Col> */}
                    <Col xs={4} className="text-center mt-3">
                      <p className="mb-0">DA {formatPrice(item.price)}</p>
                    </Col>
                    <Col xs={4} className="text-center mt-3">
                      <Form.Control
                        as="select"
                        value={item.qty}
                        onChange={(e) =>
                          addToCartHandler(item, Number(e.target.value))
                        }
                        className="text-center w-75 mx-auto"
                      >
                        {Array.from({ length: item.countInStock }, (v, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col xs={4} className="text-center mt-3 py-3">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeFromCartHandler(item._id)}
                        className="py-2 mt-2"
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4} sm={12} xs={12} className="mt-5">
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Prix Total:</Col>
                  <Col className="text-center text-danger">
                    <strong>
                      {" "}
                      DA{" "}
                      {cart.totalPrice
                        ? `${formatPrice(cart.totalPrice)}`
                        : "00.0"}{" "}
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col className="text-center">
                    <Button
                      variant="success text-white"
                      size="sm"
                      className="w-70 p-2"
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}
                    >
                      <strong> Valider la Commande</strong>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartScreen;
