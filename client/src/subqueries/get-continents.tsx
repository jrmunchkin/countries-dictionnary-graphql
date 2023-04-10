import { gql } from "@apollo/client";

const GET_CONTINENTS = gql`
  query GetContinents {
    continents {
      code
      name
      area
      population
      photo
      countries {
        code
        name
      }
    }
  }
`;

export default GET_CONTINENTS;
