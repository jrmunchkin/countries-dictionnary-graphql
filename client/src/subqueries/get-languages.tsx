import { gql } from "@apollo/client";

const GET_LANGUAGES = gql`
  query GetLanguages {
    languages {
      code
      name
    }
  }
`;

export default GET_LANGUAGES;
