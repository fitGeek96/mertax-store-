import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../slices/cartSlice";

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const paymentMethods = [
    "Paiement à la livraison",
    "CIB (bientôt)",
    "Carte Dahabia (bientôt) ",
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress || Object.keys(shippingAddress).length === 0) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="paymentMethod" className="mt-5">
          <Form.Label as={"h5"} className="mb-3 text-info">
            Moyen de paiement
          </Form.Label>
          <Col>
            {paymentMethods.map((method) => (
              <h4>
                <Form.Check
                  key={method}
                  type="radio"
                  id={method}
                  label={method}
                  value={method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  checked={paymentMethod === method}
                  disabled={
                    method === paymentMethods[1] || method === paymentMethods[2]
                  }
                />
              </h4>
            ))}
          </Col>
        </Form.Group>
        <Button
          variant="info"
          type="submit"
          disabled={paymentMethod === ""}
          className="mt-3 w-100 text-white fw-bold"
        >
          {paymentMethod === ""
            ? "Veuillez choisir un moyen de paiement"
            : "Continuer"}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
