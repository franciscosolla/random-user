export interface ApiResponse {
  results: User[];
  info:    Info;
}

export interface Info {
  seed:    string;
  results: number;
  page:    number;
  version: string;
}

export interface User {
  gender:     string;
  name:       Name;
  location:   Location;
  email:      string;
  login:      Login;
  dob:        Dob;
  registered: Dob;
  phone:      string;
  cell:       string;
  id:         ID;
  picture:    Picture;
  nat:        string;
}

export interface Dob {
  date: Date;
  age:  number;
}

export interface ID {
  name:  string;
  value: string;
}

export interface Location {
  street:      Street;
  city:        string;
  state:       string;
  country:     string;
  postcode:    string;
  coordinates: Coordinates;
  timezone:    Timezone;
}

export interface Coordinates {
  latitude:  string;
  longitude: string;
}

export interface Street {
  number: number;
  name:   string;
}

export interface Timezone {
  offset:      string;
  description: string;
}

export interface Login {
  uuid:     string;
  username: string;
  password: string;
  salt:     string;
  md5:      string;
  sha1:     string;
  sha256:   string;
}

export interface Name {
  title: string;
  first: string;
  last:  string;
}

export interface Picture {
  large:     string;
  medium:    string;
  thumbnail: string;
}

export interface Entry {
  key:                    string;
  picture_thumbnail:      string;
  name_first:             string;
  location_city:          string;
  location_state:         string;
  location_country:       string;
  location_postcode:      string;
  street_number:          number;
  street_name:            string;
  coordinates_latitude:   string;
  coordinates_longitude:  string;
  timezone_offset:        string;
  timezone_description:   string;
}

export interface Header {
  key:    keyof Entry;
  label:  string;
}