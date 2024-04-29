import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table } from "react-bootstrap";

import Loader from "../../components/Loader";
import Message from "../../components/Message";

import { FaUserEdit } from "react-icons/fa";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { MdDeleteSweep } from "react-icons/md";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../slices/usersApiSlice";
import { toast } from "react-toastify";

const UserListScreen = () => {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const deleteUserHandler = async (userId) => {
    try {
      await deleteUser(userId).unwrap();
      refetch();
      toast.success("Utilisateur supprimé avec succès");
    } catch (error) {
      toast.error(error?.data?.message || error?.error);
    }
  };

  return (
    <>
      <h3>Liste de toutes les clientes</h3>
      {isLoading && <Loader />}
      {error && <Message variant="danger">{error?.data?.message}</Message>}
      <Table striped hover responsive className="table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom & Prenom</th>
            <th>Email</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user._id} className="align-middle">
              <td>{user._id.substring(0, 10)}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                {user.isAdmin && (
                  <IoShieldCheckmarkSharp size={25} style={{ color: "teal" }} />
                )}
              </td>
              <td>
                <MdDeleteSweep
                  size={30}
                  style={{ cursor: "pointer", color: "tomato" }}
                  onClick={() => deleteUserHandler(user._id)}
                />
              </td>
              <td>
                <LinkContainer
                  to={`/admin/users/${user._id}/edit`}
                  style={{ cursor: "pointer", color: "orange" }}
                >
                  <FaUserEdit size={25} />
                </LinkContainer>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default UserListScreen;
