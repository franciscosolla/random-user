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