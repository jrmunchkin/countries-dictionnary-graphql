const typeDefs = `#graphql

    # Type #

    type Continent {
        code: ID!
        name: String!
        area: Int
        population: Float
        photo: String
        countries: [Country!]
    }

    type Country {
        code: ID!
        name: String!
        area: Int
        population: Float
        currency: String
        flag: String
        continent: ContinentResult
        capital: CityResult
        neighbors: [Country!]
        cities: [City!]
        languages: [Language!]
    }

    type City {
        code: ID!
        name: String!
        area: Int
        population: Float
        country: CountryResult
        photo1: String
        photo2: String
        photo3: String
        photo4: String
    }

    type Language {
        code: ID!
        name: String!
        countries: [Country!]
    }

    type ErrorMessage {
        message: String!
    }

    # Query #

    type Query {
        # Continent
        continents: [Continent!]!
        continent(code: ID!): ContinentResult
        # Country
        countries: [Country!]!
        countriesByContinent(continent: ID!): [Country!]!
        country(code: ID!): CountryResult
        # City
        cities: [City!]!
        citiesByCountry(country: ID!): [City!]!
        city(code: ID!): CityResult
        # Language
        languages: [Language!]!
        language(code: ID!): LanguageResult
    }

    # Mutation #

    type Mutation {
        # Continent
        createContinent(input: CreateContinentInput!): ContinentResult
        updateContinent(code: ID!, input: UpdateContinentInput!): ContinentResult
        # Country
        createCountry(input: CreateCountryInput!): CountryResult
        updateCountry(code: ID!, input: UpdateCountryInput!): CountryResult
        addNeighborToCountry(code: ID!, neighbor: ID!): CountryResult
        addLanguageToCountry(code: ID!, language: ID!): CountryResult
        # City
        createCity(input: CreateCityInput!): CityResult
        updateCity(code: ID!, input: UpdateCityInput!): CityResult
        # Language
        createLanguage(input: CreateLanguageInput!): LanguageResult
        updateLanguage(code: ID!, input: UpdateLanguageInput!): LanguageResult
        addCountryToLanguage(code: ID!, country: ID!): LanguageResult

    }

    # Input #

    # Continent
    input CreateContinentInput {
        code: ID!
        name: String!
        area: Int
        population: Float
    }

    input UpdateContinentInput {
        name: String
        area: Int
        population: Float
    }

    # Country
    input CreateCountryInput {
        code: ID!
        name: String!
        continent: ID!
        area: Int
        population: Float
        currency: String
        capital: ID
        flag: String
    }

    input UpdateCountryInput {
        name: String
        area: Int
        continent: ID
        population: Float
        currency: String
        capital: ID
        flag: String
    }

    # City
    input CreateCityInput {
        code: ID!
        name: String!
        country: ID!
        area: Int
        population: Float
        photo1: String
        photo2: String
        photo3: String
        photo4: String
    }

    input UpdateCityInput {
        name: String
        country: ID
        area: Int
        population: Float
        photo1: String
        photo2: String
        photo3: String
        photo4: String
    }

    # Language
    input CreateLanguageInput {
        code: ID!
        name: String!
    }

    input UpdateLanguageInput {
        name: String
    }

    # Union #

    union ContinentResult = Continent | ErrorMessage

    union CountryResult = Country | ErrorMessage

    union CityResult = City | ErrorMessage

    union LanguageResult = Language | ErrorMessage

`;

export default typeDefs;
