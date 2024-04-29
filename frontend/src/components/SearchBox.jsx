import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { BsSearchHeartFill } from "react-icons/bs";

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword ? urlKeyword : "");

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
      setKeyword("");
    } else {
      navigate("/");
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex flex-row me-5">
      <Button
        type="submit"
        variant="outline-primary"
        className="me-3 text-white"
        style={{
          borderRadius: "20px",
          padding: "8px",
          border: "none",
        }}
      >
        <BsSearchHeartFill size={24} />
      </Button>
      <Form.Control
        type="text"
        name="q"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Rechercher un article..."
        style={{
          borderRadius: "20px",
          border: "none",
          padding: "8px 15px",
          width: "100%",
        }}
      />
    </Form>
  );
};

export default SearchBox;
