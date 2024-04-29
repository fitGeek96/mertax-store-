import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, InputGroup } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useUpdateProductMutation,
  useGetProductDetailsQuery,
  useUploadProductImageMutation,
} from "../../slices/productsApiSlice";

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [
    uploadProductImage,
    { isLoading: isUploadingImage },
  ] = useUploadProductImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setDescription(product.description);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      }).unwrap(); // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
      toast.success("Article mis à jour avec succès");
      refetch();
      navigate("/admin/productlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const file = e.target.files[0];

    formData.append("image", file);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploadé avec succès");
      setImage(res.image);
    } catch (error) {
      toast.error("Erreur lors de l'upload de l'image");
    }
  };

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-primary">
        Retour
      </Link>
      <FormContainer>
        {isUpdating && <Loader />}
        {error && <Message variant="danger">{error?.data?.message}</Message>}
        <Form onSubmit={submitHandler} className="w-100 glass-container">
          <Form.Group controlId="formBasicName" className="mb-3">
            <Form.Label as="h4" className="text-primary">
              Nom du produit
            </Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Enter product name"
              className="rounded-pill"
            />
          </Form.Group>
          <Form.Group controlId="formBasicPrice" className="mb-3">
            <Form.Label as="h4" className="text-primary">
              Prix
            </Form.Label>
            <InputGroup>
              <InputGroup.Text>DZD</InputGroup.Text>
              <Form.Control
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                placeholder="Enter price"
                className="rounded-end"
              />
            </InputGroup>
          </Form.Group>
          <Form.Group controlId="formBasicDescription" className="mb-3">
            <Form.Label as="h4" className="text-primary">
              Description
            </Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              as="textarea"
              rows={4}
              placeholder="Enter description"
              className="rounded"
            />
          </Form.Group>
          <Form.Group controlId="formBasicImage" className="mb-3">
            <Form.Label as="h4" className="text-primary">
              Image
            </Form.Label>
            {/* <Form.Control
              value={image}
              onChange={(e) => setImage(e.target.value)}
              type="text"
              placeholder="Enter image URL"
              className="rounded-pill"
            ></Form.Control> */}
            <Form.Control
              type="file"
              label="Choisir un fichier"
              onChange={uploadFileHandler}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="formBasicBrand" className="mb-3">
            <Form.Label as="h4" className="text-primary">
              Brand
            </Form.Label>
            <Form.Control
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              type="text"
              placeholder="Enter brand"
              className="rounded-pill"
            />
          </Form.Group>
          <Form.Group controlId="formBasicCategory" className="mb-3">
            <Form.Label as="h4" className="text-primary">
              Catégorie
            </Form.Label>
            <Form.Control
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              type="text"
              placeholder="Enter category"
              className="rounded-pill"
            />
          </Form.Group>
          <Form.Group controlId="formBasicCountInStock" className="mb-3">
            <Form.Label as="h4" className="text-primary">
              Compte En stock
            </Form.Label>
            <Form.Control
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              type="number"
              placeholder="Enter count in stock"
              className="rounded-pill"
            />
          </Form.Group>
          <Button
            variant="dark"
            type="submit"
            className="mt-3 px-4 rounded-pill fw-bold w-100 text-white"
            style={{ fontSize: "1.2rem" }}
          >
            Mettre à jour le produit
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
