import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const HeroSection = () => {
  return (
    <section className="hero-section mb-2">
      <Container fluid>
        <Row className="align-items-center">
          <Col md={12} className="text-md-start text-center">
            <h2 className="hero-heading">Découvrez votre style avec </h2>
            <h1 className="hero-heading text-white"> La Parisienne </h1>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;
