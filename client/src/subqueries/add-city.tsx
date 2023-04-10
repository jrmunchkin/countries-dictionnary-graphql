import { gql } from "@apollo/client";

const ADD_CITY = gql`
  mutation CreateCity($input: CreateCityInput!) {
    createCity(input: $input) {
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

export default ADD_CITY;
