export type EndpointEpicGet_OutputOK = {
  identifier: string;
  caption: string;
  image: string;
  date: string;
  centroid_coordinates: {
    lat: number;
    lon: number;
  };
  url: string;
}[];

export interface Contract {
  apod: {
    get: EndpointApodGet;
  };
  epic: {
    get: EndpointEpicGet;
  };
  iss: {
    get: EndpointIssGet;
  };
}
export interface EndpointApodGet {
  method: "get";
  input: {};
  output: {
    OK: EndpointApodGet_OutputOK;
  };
  media: null;
}
export interface EndpointApodGet_OutputOK {
  date: string;
  post_id: number;
  title: string;
  permalink: string;
  media_type: "image" | "video";
  explanation: string;
  credit: string;
  copyright: string;
  alt: string;
  url: string;
  hdurl: string;
  basic_html: string;
  basic_html_url: string;
}
export interface EndpointEpicGet {
  method: "get";
  input: {};
  output: {
    OK: EndpointEpicGet_OutputOK;
  };
  media: null;
}
export interface EndpointIssGet {
  method: "get";
  input: {};
  output: {
    OK: EndpointIssGet_OutputOK;
  };
  media: null;
}
export interface EndpointIssGet_OutputOK {
  status: {
    latitude: number;
    longitude: number;
    altitude: number;
    velocity: number;
    timestamp: number;
  };
  positions: {
    lat: number;
    lng: number;
  }[];
  terminator: {
    lat: number;
    lng: number;
  }[];
}
