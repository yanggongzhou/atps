// const token_expires = 86400;//1 day (s);//cookie时间
//
// //添加cookie
// function setCookie(name, value){
//   document.cookie = name + "="+ escape (value) + "; path=/;"
// }

//添加cookie
function getsec(str) {
  var str1 = str.substring(1,str.length)*1;
  var str2 = str.substring(0,1);
  if(str2 === 's'){
    return str1*1000;
  }else if(str2 === 'm'){
    return str1*1000*60;
  }else if(str2 === 'h'){
    return str1*1000*60*60;
  }else if(str2 === 'd'){
    return str1*1000*60*60*24;
  }
}
function setCookie(name, value ,time){
  var strsec = getsec(time);
  var exp =new Date();
  exp.setTime(exp.getTime()+strsec*1);
  document.cookie = name + "="+ value + ";expires" +exp.toGMTString();
}

// 获取cookie
function getCookie(name) {
  var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}
// 删除cookie
function delCookie(name){
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval=getCookie(name);
  if(cval!=null)
    document.cookie= name + "="+cval+"; path=/;expires="+exp.toGMTString();
}
// 封装至auth
export const auth={
  getCookie,
  setCookie,
  // setToken(token) {
  //   let _tk = { token: token, expireIn: Math.floor(Date.now() / 1000 + token_expires) };
  //   return setCookie('token',JSON.stringify(_tk))
  // },
  delCookie,
};

