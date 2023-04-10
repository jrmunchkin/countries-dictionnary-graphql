import { gql } from "@apollo/client";

const ADD_LANGUAGE = gql`
  mutation CreateLanguage($input: CreateLanguageInput!) {
    createLanguage(input: $input) {
      ... on Language {
        name
        code
      }
      ... on ErrorMessage {
        message
      }
    }
  }
`;

export default ADD_LANGUAGE;
