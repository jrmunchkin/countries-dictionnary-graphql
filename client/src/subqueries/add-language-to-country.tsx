import { gql } from "@apollo/client";

const ADD_LANGUAGE_TO_COUNTRY = gql`
  mutation AddLanguageToCountry($code: ID!, $language: ID!) {
    addLanguageToCountry(code: $code, language: $language) {
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

export default ADD_LANGUAGE_TO_COUNTRY;
