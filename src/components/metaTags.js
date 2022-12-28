import { Helmet, HelmetProvider } from "react-helmet-async";

function MetaTag(data) {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{data.name} | Kaigan</title>
      </Helmet>
    </HelmetProvider>
  );
}
export default MetaTag;
