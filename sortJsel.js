/* ============================= 
 *            JSEL
 * =============================
 * JSONデータを元に親セレクトボックスの値から子セレクトボックスのオプションを切り替える
 * @param object data jsonデータ
 * @param object config 設定 
                            { parent: {id: 親のid, val: 親の初期値}, 
                              child:  {id: 子のid, val: 子の初期値}  }
 * @param bool empty セレクトボックスに空のデフォルト項目を表示する場合はtrueを設定,デフォルトはfalse
 * @param string text セレクトボックスの空項目に表示するテキスト
 */
function JSEL(data, config, empty, text){
    var parent = config.parent;
    var child  = config.child;
    setSelect(data, parent.id, parent.val, empty, text);
    setSelectChild(data, parent.id, child.id, child.val, empty, text);
    document.getElementById(parent.id).addEventListener('change', function(){
        setSelectChild(data, parent.id, child.id, null, empty, text);
    });
}
function setSelect(data, parent_id, parent_val, empty, text){
    var parent  = initElement(parent_id, text);
    for (var i = 0; i < data.length; i++){
        parent.options[i+empty] = new Option(data[i].name, data[i].value);
        if (data[i].value == parent_val) parent.options[i+empty].selected = true;
    }
}
function setSelectChild(data, parent_id, child_id, child_val, empty, text){
    var parent    = document.getElementById(parent_id);
    var child     = initElement(child_id, text);
    var index     = parent.options[parent.selectedIndex].value;
    var json      = data[parent.selectedIndex].child;
    for (var i = 0; i < json.length; i++){
        child.options[i+empty] = new Option(json[i].name, json[i].value);
        if (json[i].value == child_val) child.options[i+empty].selected = true;
    }
}
function initElement(id, text){
    var element = document.getElementById(id);
    element.textContent = null;
    element.options[0] = new Option(text, '');
    return element;
}
function add(callback){
    try { 
        window.addEventListener("load", callback, false); 
    } catch (e) { 
        window.attachEvent("onload", callback); 
    }
}
function loadJson(path, callback, config, empty, text){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, true);
    xhr.responseType = 'json';
    xhr.send(null);
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if( this.response ) callback(this.response, config, empty, text);
        }
    }
}
// json load & run
add(function() {
  var elem   = document.getElementsByName('sortJsel');
  for (var i = 0; elem.length > i; i++){
      var data   = elem[i].dataset;
      var pval   = data.pval ? data.pval:null;
      var cval   = data.cval ? data.cval:null;
      var config = { parent: {id: data.pid, val: pval}, child: {id: data.cid, val: cval} };
      var empty  = data.empty == "true" ? true:false;
      var text   = data.text ? data.text:'選択なし';
  
      loadJson(data.path, JSEL, config, empty, text);
  }
});