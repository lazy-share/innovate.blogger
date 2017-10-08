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
    let vo: Address = new Address();
    vo.province_code = "";
    vo.province_name = "";
    vo.city_code = "";
    vo.city_name = "";
    vo.county_code = "";
    vo.county_name = "";
    vo.street_code = "";
    vo.street_name = "";
    vo.details = "";
    return vo;
  }
}
