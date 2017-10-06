/**
 * Created by lzy on 2017/10/2.
 */
export class Address {
  province_code: string;
  province_name: string;
  city_code: string;
  city_name: string;
  county_code: string;
  county_name: string;
  street_code: string;
  street_name: string;
  details: string;
  static instantiation () {
    let address: Address = new Address();
    address.province_code = "";
    address.province_name = "";
    address.city_code = "";
    address.city_name = "";
    address.county_code = "";
    address.county_name = "";
    address.street_code = "";
    address.street_name = "";
    address.details = "";
    return address;
  }
}
