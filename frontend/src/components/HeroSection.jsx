import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const HeroSection = () => {
  return (
    <section className="hero-section mb-2">
      <Container fluid>
        <Row className="align-items-center">
          <Col md={12} className="text-md-start text-center">
            <h3 className="hero-heading text-white"> Mertax Store</h3>
            <h2 className="hero-heading">
              Livraison <br /> <span className="text-white">58</span> <br />{" "}
              Wilayas{" "}
            </h2>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;
