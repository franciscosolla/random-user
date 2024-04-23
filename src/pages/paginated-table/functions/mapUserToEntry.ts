import { User } from "../../../shared/types/RandomUserApi";
import { Entry } from "../types";

export const mapUserToEntry = (user: User): Entry => ({
  key: `${user.name.title}-${user.name.first}-${user.name.last}`,
  picture_thumbnail: user.picture.thumbnail,
  name_first: user.name.first,
  location_city: user.location.city,
  location_state: user.location.state,
  location_country: user.location.country,
  location_postcode: user.location.postcode,
  street_number: user.location.street.number,
  street_name: user.location.street.name,
  coordinates_latitude: user.location.coordinates.latitude,
  coordinates_longitude: user.location.coordinates.longitude,
  timezone_offset: user.location.timezone.offset,
  timezone_description: user.location.timezone.description,
})