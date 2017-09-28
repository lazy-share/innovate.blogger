/**
 * Created by laizhiyuan on 2017/9/28.
 */
export class AppResponse {

  constructor(
    public status: boolean,
    public code: string,
    public msg: string,
    public data: any
  ){}
}
