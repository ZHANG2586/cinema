//获取url参数
export default function getQueryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    var gn = result[1];
    if (!(gn.indexOf("%") < 0)) {
        try {
            gn = unescape(gn);
        } catch (e) {
            gn = decodeURI(gn);
        }
    }
    return gn;
}
