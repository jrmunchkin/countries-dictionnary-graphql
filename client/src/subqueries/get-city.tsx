import { gql } from "@apollo/client";

const GET_CITY = gql`
  query GetCity($code: ID!) {
    city(code: $code) {
      ... on City {
        code
        name
        area
        population
        photo1
        photo2
        photo3
      }
      ... on ErrorMessage {
        message
      }
    }
  }
`;

export default GET_CITY;
