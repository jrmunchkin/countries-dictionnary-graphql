import { gql } from "@apollo/client";

const UPDATE_CITY = gql`
  mutation UpdateCity($code: ID!, $input: UpdateCityInput!) {
    updateCity(code: $code, input: $input) {
      ... on City {
        name
        code
      }
      ... on ErrorMessage {
        message
      }
    }
  }
`;

export default UPDATE_CITY;
