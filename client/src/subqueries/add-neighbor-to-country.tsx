import { gql } from "@apollo/client";

const ADD_NEIGHBOR_TO_COUNTRY = gql`
  mutation AddNeighborToCountry($code: ID!, $neighbor: ID!) {
    addNeighborToCountry(code: $code, neighbor: $neighbor) {
      ... on Country {
        name
        code
      }
      ... on ErrorMessage {
        message
      }
    }
  }
`;

export default ADD_NEIGHBOR_TO_COUNTRY;
