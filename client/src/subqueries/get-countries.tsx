import { gql } from "@apollo/client";

const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      code
      name
    }
  }
`;

export default GET_COUNTRIES;
