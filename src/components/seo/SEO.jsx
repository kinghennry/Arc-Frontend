import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

const SEO = ({ title }) => {
  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="robots" content="noindex, follow" />
        <meta name="description" content="MekZone Technology Service Pvt Ltd" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Helmet>
    </HelmetProvider>
  );
};

export default SEO;
