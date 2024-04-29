import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";

import Loader from "../components/Loader";
import Message from "../components/Message";

import { useProfileMutation } from "../slices/usersApiSlice";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";

import { setCredentials } from "../slices/authSlice";

const ProfileScreen = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading, error }] = useProfileMutation();
  const {
    data: myOrders,
    isLoading: isLoadingOrders,
    error: myOrderError,
  } = useGetMyOrdersQuery();

  useEffect(() => {
    if (userInfo) {
      setEmail(userInfo.email);
      setUsername(userInfo.username);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials(res));
        toast.success("Votre profil a bien été modifié!");
      } catch (err) {
        toast.error(err?.data?.Message);
      }
    }
  };

  return (
    <Row>
      <Col md={3} className="mt-3">
        <h2>Profil d'utilisateur</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="username" className="my-2">
            <Form.Label as={"h6"}>Nom & Prenom</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="email" className="my-2">
            <Form.Label as={"h6"}>Email</Form.Label>
            <Form.Control
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="password" className="my-2">
            <Form.Label as={"h6"}>Mot de passe</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="confirmPassword" className="my-2">
            <Form.Label as={"h6"}>Confirmation du Mot de passe</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <Button
            variant="danger"
            type="submit"
            className="mt-3 text-white w-100"
            disabled={isLoading === true}
          >
            Modifier
          </Button>
          {isLoading && <Loader />}
        </Form>
      </Col>
      <Col md={9} className="mt-3">
        <h2>Mes Commandes</h2>
        {isLoadingOrders && <Loader />}
        {myOrderError && (
          <Message variant="danger">{myOrderError?.data?.message}</Message>
        )}
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Livré</th>
            </tr>
          </thead>
          <tbody>
            {myOrders?.map((order) => (
              <tr key={order?._id}>
                <td>{order?._id.substring(0, 10)}</td>
                <td>{order?.createdAt.substring(0, 10)}</td>
                <td className="text-info">
                  {" "}
                  <strong> DA {order?.totalPrice} </strong>{" "}
                </td>

                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes className="text-danger" />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/orders/${order?._id}`}>
                    <Button variant="primary" size="sm" className="text-white">
                      Voir
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default ProfileScreen;
