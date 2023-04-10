import { gql } from "@apollo/client";

const ADD_COUNTRY = gql`
  mutation CreateCountry($input: CreateCountryInput!) {
    createCountry(input: $input) {
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

export default ADD_COUNTRY;
