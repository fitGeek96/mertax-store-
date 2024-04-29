import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useUpdateUserDetailsMutation,
  useGetUserDetailsQuery,
} from "../../slices/usersApiSlice";

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  const [updateUserDetails, { isLoading }] = useUpdateUserDetailsMutation();
  const {
    data: user,
    isLoading: isUserLoading,
    error: errorUserDetails,
    refetch,
  } = useGetUserDetailsQuery(userId);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUserDetails({ userId, username, email, isAdmin });
      refetch();
      toast.success("le profil a bien été modifié");
      navigate("/admin/userlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to="/admin/userlist" className="btn btn-primary">
        Retour
      </Link>
      <FormContainer>
        <h3>Éditer les infos de la Cliente</h3>
        {isLoading && <Loader />}
        {isUserLoading && <Loader />}
        {errorUserDetails && (
          <Message variant="danger">{errorUserDetails?.data?.message}</Message>
        )}
        <Form onSubmit={submitHandler} className="w-75 glass-container">
          <Form.Group controlId="username">
            <Form.Label>Nom d'utilisateur</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="isAdmin" className="mt-2">
            <Form.Label>Admin</Form.Label>
            <Form.Check
              type="checkbox"
              label="Admin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
          </Form.Group>

          <Button
            variant="dark"
            type="submit"
            className="w-100 mt-3 px-4 rounded-pill fw-bold"
            style={{ fontSize: "1.2rem" }}
          >
            Mettre à jour
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
