import { gql } from "@apollo/client";

const UPDATE_COUNTRY = gql`
  mutation UpdateCountry($code: ID!, $input: UpdateCountryInput!) {
    updateCountry(code: $code, input: $input) {
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

export default UPDATE_COUNTRY;
