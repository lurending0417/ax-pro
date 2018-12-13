/**
* 表单验证
*  <>-----}|------------------------------->
* 
*/


module.exports={
    isEmpty:function(value){
        if (value == undefined || value.length == 0) {
            return true;
        } else {
            return false;
        }
    },
    check_date:function(s){
        return s&&/^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}/.test(s);
    },
    check_phone:function(s){
        return s&&/^1[3-8]{1}[0-9]{9}$/.test(s)
    },
    check_unm:function(s){
        return s&&/^\w{2,20}$/.test(s);
    },
    check_num:function(s){
        return s&&/^\d*$/.test(s)||/^\d+?\.\d*$/.test(s)
    },
    check_payPwd:function(s){
        return s&&/^[0-9]{6}$/.test(s);
    },
    check_name:function(s){//检测姓名 只能包含汉语和字母(2,20)
        return s&&/^([\u4E00-\u9FFF]|[a-zA-Z]){2,20}$/.test(s)
    },
    check_weburl:function(s){
        return s&&/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(s)
    },
    check_email:function(s){
        return s&&/^[0-9|a-z|A-Z|_]*?@[0-9|a-z|A-Z|_]+?\.[0-9|a-z|A-Z]+?$/.test(s)
    },
    check_pwd:function(s) {//6-16位 非连续的数字或字母
        var patrn = /^(\w){6,16}$/;
        if(patrn.exec(s)){
            var l=s.length,b=true,b1=s.charCodeAt(0)-s.charCodeAt(1);
            if(b1*b1!=1){
                return b;
            }
            for(var i=2;i<l;i++){
                b=b&&((s.charCodeAt(i)+b1)==s.charCodeAt(i-1));
                if(!b)break;
            }

            return !b;
        }
        return false;
    },
    check_required:function(s){
        var st=typeof s;
        if(s||(st=="number"&&s==0)||(st=="boolean"&&s==false))
            return true;
        return false;
    },
    check_length:function(s,min,max){
        min=min||0;
        max=max||100000;
        var r=new RegExp("^(\\w){"+min+","+max+"}$");
        return r.test(s);
    },
    /*_i int  _b bool _f float _m 字符串最大 _*/
    check_max:function(v,max){
        v=parseFloat(v);
        return v<=max;
    },
    check_min:function(v,min){
        v=parseFloat(v);
        return v>=min;
    },
    check_maxLength:function(v,max){
        return v&&v.length<=max||!v;
    },
    check_minLength:function(v,min){
        return v&&v.length>=min;
    },
    check_reg:function(v,reg){
        var r=new RegExp(reg);
        return r.test(v);
    },
    specialFields:["_i","_f","_m"],
    errMsgs:{
        max:"{0}需小于{1}",
        min:"{0}需大于{1}",
        required:"{0}不能为空",
        phone:"请输入正确的手机号",
        pwd:"请输入正确的密码",
        num:"请输入正确的{0}",
        payPwd:"请输入正确的{0}",
        email:"请输入正确的{0}",
        name:"请输入正确的{0}",
        maxLength:"{0}最大{1}位",
        minLength:"{0}最小{1}位",
        reg:"请输入正确的{0}",
        unm:"请输入正确的{0}",
        date:"请输入正确的{0}"
    },
    errFormat:function(fstr,name){
        if(typeof arguments.length==2){
            fstr=fstr.replace(/\{0\}/g,arguments[1]);
        }
        else{
            var reg;
            for(var i=1;i<arguments.length;i++){
                reg=new RegExp("\\{"+(i-1)+"\\}","g");
                fstr=fstr.replace(reg,arguments[i]);
            }
        }
        return fstr;
    },
    checkFields:function(/*被检测对象*/o,/*需检查的字段*/fields,/*例外的字段*/exclueds,/*回调 不传 就返回 promise*/callback){
        var me=this,err=null,field,rules,rule,args,errArgs,sps={"rules":"","key":"","msg":"","name":"","type":""};
        
        if(exclueds){
            exclueds.forEach(key=>{
                sps[key]="";
            })
        }

        for(var f in fields){
            if(err)
                break;
            field=fields[f]
            rules=field.rules||[];
            for(var r in field){
                if(!(r in sps)){
                    var rule={
                        value:field[r],
                        rule:r,
                        msg:field.msg||me.errMsgs[r]
                    };
                    if(me["check_"+rule.rule]){
                        args=[o[field.key]];
                        errArgs=[rule.msg];
                        if(rule.value){
                            if(!(rule.value instanceof Array)){
                                args.push(rule.value);
                                errArgs.push(field.name||field.key);
                                errArgs.push(rule.value);
                            }
                            else{
                                if(rule.name){
                                    errArgs.push(field.name)
                                }
                                for(var v in rule.value){
                                    args.push(rule.value[v]);
                                    errArgs.push(rule.value[v]);
                                }
                            }
                            if(me.isEmpty(args[0])&&!field.required){
                                continue;
                            }

                            if(!me["check_"+rule.rule].apply(me,args)){
                                err=me.errFormat.apply(me,errArgs);
                                break;
                            }
                        }

                    }
                }
            }
        }
        return callback?callback(err):(err?Promise.resolve(err):Promise.resolve(true));
    },
    registerRule:function(rulename,ruleErrMsg,ruleMethod) {
        this["check_"+rulename]=ruleMethod;
        this.errMsgs[rulename]=ruleErrMsg;
    },
    isExistRule:function(rulename){
        return !!this["check_"+rulename];
    }
}