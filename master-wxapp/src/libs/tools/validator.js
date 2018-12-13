import { required } from './func';

const regs = {
  mobile: /^1\d{10}$/,
  unm:/^\S{2,20}$/,
  passwd: /^\S{6,20}$/, // TODO: 规则待确认
  name: /^[\u4E00-\u9FA5]{1,10}$/, // 中文名字 ~~~~
  bankCardNum: /^[0-9]{16,19}$/, // 银行卡号
  idCard: /^[1-6][0-7][\d]{4}((19[\d]{2})|(20[0-1][\d]))((0[1-9])|(1[0-2]))((0[1-9])|([1-2]\d)|(3[0-1]))[\d]{3}[\dxX]$/, // 身份证号码
  code: /^\d{4,6}/, // 验证码
  nickName: /^\S{1,15}/, // 昵称
  logiCode: /^\d{9,15}$/, // 快递单号
};

class Validator {
  is({ type = required(), input = '' }) {
    const reg = regs[type];
    if (!reg) {
      throw new Error(`还没有${type}的正则表达式哦！`);
    } else {
      if (input === null) {
        return false;
      }
      return reg.test(input);
    }
  }

  not({ type = required(), input = '' }) {
    return !this.is({ type, input });
  }

}

const instance = new Validator();
export default instance;
