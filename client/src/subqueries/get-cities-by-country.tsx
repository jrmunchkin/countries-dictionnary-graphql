import { gql } from "@apollo/client";

const GET_CITIES_BY_COUNTRY = gql`
  query GetCitiesByCountry($country: ID!) {
    citiesByCountry(country: $country) {
      code
      name
    }
  }
`;

export default GET_CITIES_BY_COUNTRY;
