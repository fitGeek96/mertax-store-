import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Row, Button, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const redirect = query.get("redirect") || "/";

  const { userInfo } = useSelector((state) => state.auth);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Vous êtes connecté!");
    } catch (err) {
      toast.error("Invalid email or password");
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  return (
    <>
      <h2 className="login-headline">La Parisienne</h2>
      <FormContainer>
        <Form onSubmit={submitHandler} className="glass-container mx-auto">
          <h2>Se Connecter</h2>

          <Form.Group controlId="email" className="mb-2">
            <Form.Label>Adresse e-mail</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button
            variant="danger"
            type="submit"
            className="mt-3 text-white w-100"
            disabled={isLoading === true}
          >
            Se Connecter
          </Button>
          {isLoading && <Loader />}
          <Row className="mt-3">
            <Col>
              <strong>
                {" "}
                Nouvelle Cliente?{" "}
                <Link
                  to={redirect ? `/register?redirect=${redirect}` : "/register"}
                >
                  S'enregistrer
                </Link>
              </strong>
            </Col>
          </Row>
        </Form>
      </FormContainer>
    </>
  );
};

export default LoginScreen;
