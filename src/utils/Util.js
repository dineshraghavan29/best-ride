export default class Util {
  userInfo = {};

  static setUserInfo = (user) => (this.userInfo = user);
  static getUserInfo = () => this.userInfo;
}
