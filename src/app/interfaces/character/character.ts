export interface Character {
    id: number;
    name: string;
    status: string;
    species: string;
    type: string;
    gender: string;
    origin: CharacterLocation;
    location: CharacterLocation;
    image: string;
    episode: Array<string>;
    url: string;
    created: string
}

interface CharacterLocation {
    name: string;
    url: string;
}