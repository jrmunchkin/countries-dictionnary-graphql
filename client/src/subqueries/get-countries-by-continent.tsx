import { gql } from "@apollo/client";

const GET_COUNTRIES_BY_CONTINENT = gql`
  query GetCountriesByContinent($continent: ID!) {
    countriesByContinent(continent: $continent) {
      code
      name
    }
  }
`;

export default GET_COUNTRIES_BY_CONTINENT;
