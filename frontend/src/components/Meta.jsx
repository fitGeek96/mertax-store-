import React from "react";
import { Helmet } from "react-helmet-async";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Boutique La Parisienne",
  description: "We sell the latest fashion products",
  keywords: "girls, women, men, kids, fashion, clothing, shoes, accessories,",
};

export default Meta;
