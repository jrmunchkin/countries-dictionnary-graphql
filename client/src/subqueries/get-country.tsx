import { gql } from "@apollo/client";

const GET_COUNTRY = gql`
  query GetCountry($code: ID!) {
    country(code: $code) {
      ... on Country {
        code
        name
        area
        population
        currency
        flag
        capital {
          ... on City {
            name
          }
          ... on ErrorMessage {
            message
          }
        }
        languages {
          code
          name
        }
        neighbors {
          code
          name
        }
      }
      ... on ErrorMessage {
        message
      }
    }
  }
`;

export default GET_COUNTRY;
