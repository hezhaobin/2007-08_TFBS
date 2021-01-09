var Prototype={Version:"1.6.0.1",Browser:{IE:!!(window.attachEvent&&!window.opera),Opera:!!window.opera,WebKit:navigator.userAgent.indexOf("AppleWebKit/")>-1,Gecko:navigator.userAgent.indexOf("Gecko")>-1&&navigator.userAgent.indexOf("KHTML")==-1,MobileSafari:!!navigator.userAgent.match(/Apple.*Mobile.*Safari/)},BrowserFeatures:{XPath:!!document.evaluate,ElementExtensions:!!window.HTMLElement,SpecificElementExtensions:document.createElement("div").__proto__&&document.createElement("div").__proto__!==document.createElement("form").__proto__},ScriptFragment:"<script[^>]*>([\\S\\s]*?)<\/script>",JSONFilter:/^\/\*-secure-([\s\S]*)\*\/\s*$/,emptyFunction:function(){},K:function(A){return A
}};if(Prototype.Browser.MobileSafari){Prototype.BrowserFeatures.SpecificElementExtensions=false
}var Class={create:function(){var E=null,D=$A(arguments);if(Object.isFunction(D[0])){E=D.shift()
}function A(){this.initialize.apply(this,arguments)}Object.extend(A,Class.Methods);
A.superclass=E;A.subclasses=[];if(E){var B=function(){};B.prototype=E.prototype;A.prototype=new B;
E.subclasses.push(A)}for(var C=0;C<D.length;C++){A.addMethods(D[C])}if(!A.prototype.initialize){A.prototype.initialize=Prototype.emptyFunction
}A.prototype.constructor=A;return A}};Class.Methods={addMethods:function(G){var C=this.superclass&&this.superclass.prototype;
var B=Object.keys(G);if(!Object.keys({toString:true}).length){B.push("toString","valueOf")
}for(var A=0,D=B.length;A<D;A++){var F=B[A],E=G[F];if(C&&Object.isFunction(E)&&E.argumentNames().first()=="$super"){var H=E,E=Object.extend((function(I){return function(){return C[I].apply(this,arguments)
}})(F).wrap(H),{valueOf:function(){return H},toString:function(){return H.toString()
}})}this.prototype[F]=E}return this}};var Abstract={};Object.extend=function(A,C){for(var B in C){A[B]=C[B]
}return A};Object.extend(Object,{inspect:function(A){try{if(Object.isUndefined(A)){return"undefined"
}if(A===null){return"null"}return A.inspect?A.inspect():A.toString()}catch(B){if(B instanceof RangeError){return"..."
}throw B}},toJSON:function(A){var C=typeof A;switch(C){case"undefined":case"function":case"unknown":return ;
case"boolean":return A.toString()}if(A===null){return"null"}if(A.toJSON){return A.toJSON()
}if(Object.isElement(A)){return }var B=[];for(var E in A){var D=Object.toJSON(A[E]);
if(!Object.isUndefined(D)){B.push(E.toJSON()+": "+D)}}return"{"+B.join(", ")+"}"},toQueryString:function(A){return $H(A).toQueryString()
},toHTML:function(A){return A&&A.toHTML?A.toHTML():String.interpret(A)},keys:function(A){var B=[];
for(var C in A){B.push(C)}return B},values:function(B){var A=[];for(var C in B){A.push(B[C])
}return A},clone:function(A){return Object.extend({},A)},isElement:function(A){return A&&A.nodeType==1
},isArray:function(A){return A&&A.constructor===Array},isHash:function(A){return A instanceof Hash
},isFunction:function(A){return typeof A=="function"},isString:function(A){return typeof A=="string"
},isNumber:function(A){return typeof A=="number"},isUndefined:function(A){return typeof A=="undefined"
}});Object.extend(Function.prototype,{argumentNames:function(){var A=this.toString().match(/^[\s\(]*function[^(]*\((.*?)\)/)[1].split(",").invoke("strip");
return A.length==1&&!A[0]?[]:A},bind:function(){if(arguments.length<2&&Object.isUndefined(arguments[0])){return this
}var A=this,C=$A(arguments),B=C.shift();return function(){return A.apply(B,C.concat($A(arguments)))
}},bindAsEventListener:function(){var A=this,C=$A(arguments),B=C.shift();return function(D){return A.apply(B,[D||window.event].concat(C))
}},curry:function(){if(!arguments.length){return this}var A=this,B=$A(arguments);
return function(){return A.apply(this,B.concat($A(arguments)))}},delay:function(){var A=this,B=$A(arguments),C=B.shift()*1000;
return window.setTimeout(function(){return A.apply(A,B)},C)},wrap:function(B){var A=this;
return function(){return B.apply(this,[A.bind(this)].concat($A(arguments)))}},methodize:function(){if(this._methodized){return this._methodized
}var A=this;return this._methodized=function(){return A.apply(null,[this].concat($A(arguments)))
}}});Function.prototype.defer=Function.prototype.delay.curry(0.01);Date.prototype.toJSON=function(){return'"'+this.getUTCFullYear()+"-"+(this.getUTCMonth()+1).toPaddedString(2)+"-"+this.getUTCDate().toPaddedString(2)+"T"+this.getUTCHours().toPaddedString(2)+":"+this.getUTCMinutes().toPaddedString(2)+":"+this.getUTCSeconds().toPaddedString(2)+'Z"'
};var Try={these:function(){var C;for(var B=0,D=arguments.length;B<D;B++){var A=arguments[B];
try{C=A();break}catch(E){}}return C}};RegExp.prototype.match=RegExp.prototype.test;
RegExp.escape=function(A){return String(A).replace(/([.*+?^=!:${}()|[\]\/\\])/g,"\\$1")
};var PeriodicalExecuter=Class.create({initialize:function(B,A){this.callback=B;this.frequency=A;
this.currentlyExecuting=false;this.registerCallback()},registerCallback:function(){this.timer=setInterval(this.onTimerEvent.bind(this),this.frequency*1000)
},execute:function(){this.callback(this)},stop:function(){if(!this.timer){return 
}clearInterval(this.timer);this.timer=null},onTimerEvent:function(){if(!this.currentlyExecuting){try{this.currentlyExecuting=true;
this.execute()}finally{this.currentlyExecuting=false}}}});Object.extend(String,{interpret:function(A){return A==null?"":String(A)
},specialChar:{"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\\":"\\\\"}});
Object.extend(String.prototype,{gsub:function(E,C){var A="",D=this,B;C=arguments.callee.prepareReplacement(C);
while(D.length>0){if(B=D.match(E)){A+=D.slice(0,B.index);A+=String.interpret(C(B));
D=D.slice(B.index+B[0].length)}else{A+=D,D=""}}return A},sub:function(C,A,B){A=this.gsub.prepareReplacement(A);
B=Object.isUndefined(B)?1:B;return this.gsub(C,function(D){if(--B<0){return D[0]}return A(D)
})},scan:function(B,A){this.gsub(B,A);return String(this)},truncate:function(B,A){B=B||30;
A=Object.isUndefined(A)?"...":A;return this.length>B?this.slice(0,B-A.length)+A:String(this)
},strip:function(){return this.replace(/^\s+/,"").replace(/\s+$/,"")},stripTags:function(){return this.replace(/<\/?[^>]+>/gi,"")
},stripScripts:function(){return this.replace(new RegExp(Prototype.ScriptFragment,"img"),"")
},extractScripts:function(){var B=new RegExp(Prototype.ScriptFragment,"img");var A=new RegExp(Prototype.ScriptFragment,"im");
return(this.match(B)||[]).map(function(C){return(C.match(A)||["",""])[1]})},evalScripts:function(){return this.extractScripts().map(function(script){return eval(script)
})},escapeHTML:function(){var A=arguments.callee;A.text.data=this;return A.div.innerHTML
},unescapeHTML:function(){var A=new Element("div");A.innerHTML=this.stripTags();return A.childNodes[0]?(A.childNodes.length>1?$A(A.childNodes).inject("",function(B,C){return B+C.nodeValue
}):A.childNodes[0].nodeValue):""},toQueryParams:function(B){var A=this.strip().match(/([^?#]*)(#.*)?$/);
if(!A){return{}}return A[1].split(B||"&").inject({},function(E,F){if((F=F.split("="))[0]){var C=decodeURIComponent(F.shift());
var D=F.length>1?F.join("="):F[0];if(D!=undefined){D=decodeURIComponent(D)}if(C in E){if(!Object.isArray(E[C])){E[C]=[E[C]]
}E[C].push(D)}else{E[C]=D}}return E})},toArray:function(){return this.split("")},succ:function(){return this.slice(0,this.length-1)+String.fromCharCode(this.charCodeAt(this.length-1)+1)
},times:function(A){return A<1?"":new Array(A+1).join(this)},camelize:function(){var D=this.split("-"),A=D.length;
if(A==1){return D[0]}var C=this.charAt(0)=="-"?D[0].charAt(0).toUpperCase()+D[0].substring(1):D[0];
for(var B=1;B<A;B++){C+=D[B].charAt(0).toUpperCase()+D[B].substring(1)}return C},capitalize:function(){return this.charAt(0).toUpperCase()+this.substring(1).toLowerCase()
},underscore:function(){return this.gsub(/::/,"/").gsub(/([A-Z]+)([A-Z][a-z])/,"#{1}_#{2}").gsub(/([a-z\d])([A-Z])/,"#{1}_#{2}").gsub(/-/,"_").toLowerCase()
},dasherize:function(){return this.gsub(/_/,"-")},inspect:function(B){var A=this.gsub(/[\x00-\x1f\\]/,function(C){var D=String.specialChar[C[0]];
return D?D:"\\u00"+C[0].charCodeAt().toPaddedString(2,16)});if(B){return'"'+A.replace(/"/g,'\\"')+'"'
}return"'"+A.replace(/'/g,"\\'")+"'"},toJSON:function(){return this.inspect(true)
},unfilterJSON:function(A){return this.sub(A||Prototype.JSONFilter,"#{1}")},isJSON:function(){var A=this;
if(A.blank()){return false}A=this.replace(/\\./g,"@").replace(/"[^"\\\n\r]*"/g,"");
return(/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(A)},evalJSON:function(sanitize){var json=this.unfilterJSON();
try{if(!sanitize||json.isJSON()){return eval("("+json+")")}}catch(e){}throw new SyntaxError("Badly formed JSON string: "+this.inspect())
},include:function(A){return this.indexOf(A)>-1},startsWith:function(A){return this.indexOf(A)===0
},endsWith:function(A){var B=this.length-A.length;return B>=0&&this.lastIndexOf(A)===B
},empty:function(){return this==""},blank:function(){return/^\s*$/.test(this)},interpolate:function(A,B){return new Template(this,B).evaluate(A)
}});if(Prototype.Browser.WebKit||Prototype.Browser.IE){Object.extend(String.prototype,{escapeHTML:function(){return this.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
},unescapeHTML:function(){return this.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">")
}})}String.prototype.gsub.prepareReplacement=function(B){if(Object.isFunction(B)){return B
}var A=new Template(B);return function(C){return A.evaluate(C)}};String.prototype.parseQuery=String.prototype.toQueryParams;
Object.extend(String.prototype.escapeHTML,{div:document.createElement("div"),text:document.createTextNode("")});
with(String.prototype.escapeHTML){div.appendChild(text)}var Template=Class.create({initialize:function(A,B){this.template=A.toString();
this.pattern=B||Template.Pattern},evaluate:function(A){if(Object.isFunction(A.toTemplateReplacements)){A=A.toTemplateReplacements()
}return this.template.gsub(this.pattern,function(D){if(A==null){return""}var F=D[1]||"";
if(F=="\\"){return D[2]}var B=A,G=D[3];var E=/^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
D=E.exec(G);if(D==null){return F}while(D!=null){var C=D[1].startsWith("[")?D[2].gsub("\\\\]","]"):D[1];
B=B[C];if(null==B||""==D[3]){break}G=G.substring("["==D[3]?D[1].length:D[0].length);
D=E.exec(G)}return F+String.interpret(B)}.bind(this))}});Template.Pattern=/(^|.|\r|\n)(#\{(.*?)\})/;
var $break={};var Enumerable={each:function(C,B){var A=0;C=C.bind(B);try{this._each(function(E){C(E,A++)
})}catch(D){if(D!=$break){throw D}}return this},eachSlice:function(D,C,B){C=C?C.bind(B):Prototype.K;
var A=-D,E=[],F=this.toArray();while((A+=D)<F.length){E.push(F.slice(A,A+D))}return E.collect(C,B)
},all:function(C,B){C=C?C.bind(B):Prototype.K;var A=true;this.each(function(E,D){A=A&&!!C(E,D);
if(!A){throw $break}});return A},any:function(C,B){C=C?C.bind(B):Prototype.K;var A=false;
this.each(function(E,D){if(A=!!C(E,D)){throw $break}});return A},collect:function(C,B){C=C?C.bind(B):Prototype.K;
var A=[];this.each(function(E,D){A.push(C(E,D))});return A},detect:function(C,B){C=C.bind(B);
var A;this.each(function(E,D){if(C(E,D)){A=E;throw $break}});return A},findAll:function(C,B){C=C.bind(B);
var A=[];this.each(function(E,D){if(C(E,D)){A.push(E)}});return A},grep:function(D,C,B){C=C?C.bind(B):Prototype.K;
var A=[];if(Object.isString(D)){D=new RegExp(D)}this.each(function(F,E){if(D.match(F)){A.push(C(F,E))
}});return A},include:function(A){if(Object.isFunction(this.indexOf)){if(this.indexOf(A)!=-1){return true
}}var B=false;this.each(function(C){if(C==A){B=true;throw $break}});return B},inGroupsOf:function(B,A){A=Object.isUndefined(A)?null:A;
return this.eachSlice(B,function(C){while(C.length<B){C.push(A)}return C})},inject:function(A,C,B){C=C.bind(B);
this.each(function(E,D){A=C(A,E,D)});return A},invoke:function(B){var A=$A(arguments).slice(1);
return this.map(function(C){return C[B].apply(C,A)})},max:function(C,B){C=C?C.bind(B):Prototype.K;
var A;this.each(function(E,D){E=C(E,D);if(A==null||E>=A){A=E}});return A},min:function(C,B){C=C?C.bind(B):Prototype.K;
var A;this.each(function(E,D){E=C(E,D);if(A==null||E<A){A=E}});return A},partition:function(D,B){D=D?D.bind(B):Prototype.K;
var C=[],A=[];this.each(function(F,E){(D(F,E)?C:A).push(F)});return[C,A]},pluck:function(B){var A=[];
this.each(function(C){A.push(C[B])});return A},reject:function(C,B){C=C.bind(B);var A=[];
this.each(function(E,D){if(!C(E,D)){A.push(E)}});return A},sortBy:function(B,A){B=B.bind(A);
return this.map(function(D,C){return{value:D,criteria:B(D,C)}}).sort(function(F,E){var D=F.criteria,C=E.criteria;
return D<C?-1:D>C?1:0}).pluck("value")},toArray:function(){return this.map()},zip:function(){var B=Prototype.K,A=$A(arguments);
if(Object.isFunction(A.last())){B=A.pop()}var C=[this].concat(A).map($A);return this.map(function(E,D){return B(C.pluck(D))
})},size:function(){return this.toArray().length},inspect:function(){return"#<Enumerable:"+this.toArray().inspect()+">"
}};Object.extend(Enumerable,{map:Enumerable.collect,find:Enumerable.detect,select:Enumerable.findAll,filter:Enumerable.findAll,member:Enumerable.include,entries:Enumerable.toArray,every:Enumerable.all,some:Enumerable.any});
function $A(C){if(!C){return[]}if(C.toArray){return C.toArray()}var B=C.length||0,A=new Array(B);
while(B--){A[B]=C[B]}return A}if(Prototype.Browser.WebKit){function $A(C){if(!C){return[]
}if(!(Object.isFunction(C)&&C=="[object NodeList]")&&C.toArray){return C.toArray()
}var B=C.length||0,A=new Array(B);while(B--){A[B]=C[B]}return A}}Array.from=$A;Object.extend(Array.prototype,Enumerable);
if(!Array.prototype._reverse){Array.prototype._reverse=Array.prototype.reverse}Object.extend(Array.prototype,{_each:function(B){for(var A=0,C=this.length;
A<C;A++){B(this[A])}},clear:function(){this.length=0;return this},first:function(){return this[0]
},last:function(){return this[this.length-1]},compact:function(){return this.select(function(A){return A!=null
})},flatten:function(){return this.inject([],function(B,A){return B.concat(Object.isArray(A)?A.flatten():[A])
})},without:function(){var A=$A(arguments);return this.select(function(B){return !A.include(B)
})},reverse:function(A){return(A!==false?this:this.toArray())._reverse()},reduce:function(){return this.length>1?this:this[0]
},uniq:function(A){return this.inject([],function(D,C,B){if(0==B||(A?D.last()!=C:!D.include(C))){D.push(C)
}return D})},intersect:function(A){return this.uniq().findAll(function(B){return A.detect(function(C){return B===C
})})},clone:function(){return[].concat(this)},size:function(){return this.length},inspect:function(){return"["+this.map(Object.inspect).join(", ")+"]"
},toJSON:function(){var A=[];this.each(function(B){var C=Object.toJSON(B);if(!Object.isUndefined(C)){A.push(C)
}});return"["+A.join(", ")+"]"}});if(Object.isFunction(Array.prototype.forEach)){Array.prototype._each=Array.prototype.forEach
}if(!Array.prototype.indexOf){Array.prototype.indexOf=function(C,A){A||(A=0);var B=this.length;
if(A<0){A=B+A}for(;A<B;A++){if(this[A]===C){return A}}return -1}}if(!Array.prototype.lastIndexOf){Array.prototype.lastIndexOf=function(B,A){A=isNaN(A)?this.length:(A<0?this.length+A:A)+1;
var C=this.slice(0,A).reverse().indexOf(B);return(C<0)?C:A-C-1}}Array.prototype.toArray=Array.prototype.clone;
function $w(A){if(!Object.isString(A)){return[]}A=A.strip();return A?A.split(/\s+/):[]
}if(Prototype.Browser.Opera){Array.prototype.concat=function(){var E=[];for(var B=0,C=this.length;
B<C;B++){E.push(this[B])}for(var B=0,C=arguments.length;B<C;B++){if(Object.isArray(arguments[B])){for(var A=0,D=arguments[B].length;
A<D;A++){E.push(arguments[B][A])}}else{E.push(arguments[B])}}return E}}Object.extend(Number.prototype,{toColorPart:function(){return this.toPaddedString(2,16)
},succ:function(){return this+1},times:function(A){$R(0,this,true).each(A);return this
},toPaddedString:function(C,B){var A=this.toString(B||10);return"0".times(C-A.length)+A
},toJSON:function(){return isFinite(this)?this.toString():"null"}});$w("abs round ceil floor").each(function(A){Number.prototype[A]=Math[A].methodize()
});function $H(A){return new Hash(A)}var Hash=Class.create(Enumerable,(function(){function A(B,C){if(Object.isUndefined(C)){return B
}return B+"="+encodeURIComponent(String.interpret(C))}return{initialize:function(B){this._object=Object.isHash(B)?B.toObject():Object.clone(B)
},_each:function(C){for(var B in this._object){var D=this._object[B],E=[B,D];E.key=B;
E.value=D;C(E)}},set:function(B,C){return this._object[B]=C},get:function(B){return this._object[B]
},unset:function(B){var C=this._object[B];delete this._object[B];return C},toObject:function(){return Object.clone(this._object)
},keys:function(){return this.pluck("key")},values:function(){return this.pluck("value")
},index:function(C){var B=this.detect(function(D){return D.value===C});return B&&B.key
},merge:function(B){return this.clone().update(B)},update:function(B){return new Hash(B).inject(this,function(C,D){C.set(D.key,D.value);
return C})},toQueryString:function(){return this.map(function(D){var C=encodeURIComponent(D.key),B=D.value;
if(B&&typeof B=="object"){if(Object.isArray(B)){return B.map(A.curry(C)).join("&")
}}return A(C,B)}).join("&")},inspect:function(){return"#<Hash:{"+this.map(function(B){return B.map(Object.inspect).join(": ")
}).join(", ")+"}>"},toJSON:function(){return Object.toJSON(this.toObject())},clone:function(){return new Hash(this)
}}})());Hash.prototype.toTemplateReplacements=Hash.prototype.toObject;Hash.from=$H;
var ObjectRange=Class.create(Enumerable,{initialize:function(C,A,B){this.start=C;
this.end=A;this.exclusive=B},_each:function(A){var B=this.start;while(this.include(B)){A(B);
B=B.succ()}},include:function(A){if(A<this.start){return false}if(this.exclusive){return A<this.end
}return A<=this.end}});var $R=function(C,A,B){return new ObjectRange(C,A,B)};var Ajax={getTransport:function(){return Try.these(function(){return new XMLHttpRequest()
},function(){return new ActiveXObject("Msxml2.XMLHTTP")},function(){return new ActiveXObject("Microsoft.XMLHTTP")
})||false},activeRequestCount:0};Ajax.Responders={responders:[],_each:function(A){this.responders._each(A)
},register:function(A){if(!this.include(A)){this.responders.push(A)}},unregister:function(A){this.responders=this.responders.without(A)
},dispatch:function(D,B,C,A){this.each(function(E){if(Object.isFunction(E[D])){try{E[D].apply(E,[B,C,A])
}catch(F){}}})}};Object.extend(Ajax.Responders,Enumerable);Ajax.Responders.register({onCreate:function(){Ajax.activeRequestCount++
},onComplete:function(){Ajax.activeRequestCount--}});Ajax.Base=Class.create({initialize:function(A){this.options={method:"post",asynchronous:true,contentType:"application/x-www-form-urlencoded",encoding:"UTF-8",parameters:"",evalJSON:true,evalJS:true};
Object.extend(this.options,A||{});this.options.method=this.options.method.toLowerCase();
if(Object.isString(this.options.parameters)){this.options.parameters=this.options.parameters.toQueryParams()
}else{if(Object.isHash(this.options.parameters)){this.options.parameters=this.options.parameters.toObject()
}}}});Ajax.Request=Class.create(Ajax.Base,{_complete:false,initialize:function($super,B,A){$super(A);
this.transport=Ajax.getTransport();this.request(B)},request:function(B){this.url=B;
this.method=this.options.method;var D=Object.clone(this.options.parameters);if(!["get","post"].include(this.method)){D._method=this.method;
this.method="post"}this.parameters=D;if(D=Object.toQueryString(D)){if(this.method=="get"){this.url+=(this.url.include("?")?"&":"?")+D
}else{if(/Konqueror|Safari|KHTML/.test(navigator.userAgent)){D+="&_="}}}try{var A=new Ajax.Response(this);
if(this.options.onCreate){this.options.onCreate(A)}Ajax.Responders.dispatch("onCreate",this,A);
this.transport.open(this.method.toUpperCase(),this.url,this.options.asynchronous);
if(this.options.asynchronous){this.respondToReadyState.bind(this).defer(1)}this.transport.onreadystatechange=this.onStateChange.bind(this);
this.setRequestHeaders();this.body=this.method=="post"?(this.options.postBody||D):null;
this.transport.send(this.body);if(!this.options.asynchronous&&this.transport.overrideMimeType){this.onStateChange()
}}catch(C){this.dispatchException(C)}},onStateChange:function(){var A=this.transport.readyState;
if(A>1&&!((A==4)&&this._complete)){this.respondToReadyState(this.transport.readyState)
}},setRequestHeaders:function(){var E={"X-Requested-With":"XMLHttpRequest","X-Prototype-Version":Prototype.Version,Accept:"text/javascript, text/html, application/xml, text/xml, */*"};
if(this.method=="post"){E["Content-type"]=this.options.contentType+(this.options.encoding?"; charset="+this.options.encoding:"");
if(this.transport.overrideMimeType&&(navigator.userAgent.match(/Gecko\/(\d{4})/)||[0,2005])[1]<2005){E.Connection="close"
}}if(typeof this.options.requestHeaders=="object"){var C=this.options.requestHeaders;
if(Object.isFunction(C.push)){for(var B=0,D=C.length;B<D;B+=2){E[C[B]]=C[B+1]}}else{$H(C).each(function(F){E[F.key]=F.value
})}}for(var A in E){this.transport.setRequestHeader(A,E[A])}},success:function(){var A=this.getStatus();
return !A||(A>=200&&A<300)},getStatus:function(){try{return this.transport.status||0
}catch(A){return 0}},respondToReadyState:function(A){var C=Ajax.Request.Events[A],B=new Ajax.Response(this);
if(C=="Complete"){try{this._complete=true;(this.options["on"+B.status]||this.options["on"+(this.success()?"Success":"Failure")]||Prototype.emptyFunction)(B,B.headerJSON)
}catch(D){this.dispatchException(D)}var E=B.getHeader("Content-type");if(this.options.evalJS=="force"||(this.options.evalJS&&E&&E.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i))){this.evalResponse()
}}try{(this.options["on"+C]||Prototype.emptyFunction)(B,B.headerJSON);Ajax.Responders.dispatch("on"+C,this,B,B.headerJSON)
}catch(D){this.dispatchException(D)}if(C=="Complete"){this.transport.onreadystatechange=Prototype.emptyFunction
}},getHeader:function(A){try{return this.transport.getResponseHeader(A)||null}catch(B){return null
}},evalResponse:function(){try{return eval((this.transport.responseText||"").unfilterJSON())
}catch(e){this.dispatchException(e)}},dispatchException:function(A){(this.options.onException||Prototype.emptyFunction)(this,A);
Ajax.Responders.dispatch("onException",this,A)}});Ajax.Request.Events=["Uninitialized","Loading","Loaded","Interactive","Complete"];
Ajax.Response=Class.create({initialize:function(C){this.request=C;var D=this.transport=C.transport,A=this.readyState=D.readyState;
if((A>2&&!Prototype.Browser.IE)||A==4){this.status=this.getStatus();this.statusText=this.getStatusText();
this.responseText=String.interpret(D.responseText);this.headerJSON=this._getHeaderJSON()
}if(A==4){var B=D.responseXML;this.responseXML=Object.isUndefined(B)?null:B;this.responseJSON=this._getResponseJSON()
}},status:0,statusText:"",getStatus:Ajax.Request.prototype.getStatus,getStatusText:function(){try{return this.transport.statusText||""
}catch(A){return""}},getHeader:Ajax.Request.prototype.getHeader,getAllHeaders:function(){try{return this.getAllResponseHeaders()
}catch(A){return null}},getResponseHeader:function(A){return this.transport.getResponseHeader(A)
},getAllResponseHeaders:function(){return this.transport.getAllResponseHeaders()},_getHeaderJSON:function(){var A=this.getHeader("X-JSON");
if(!A){return null}A=decodeURIComponent(escape(A));try{return A.evalJSON(this.request.options.sanitizeJSON)
}catch(B){this.request.dispatchException(B)}},_getResponseJSON:function(){var A=this.request.options;
if(!A.evalJSON||(A.evalJSON!="force"&&!(this.getHeader("Content-type")||"").include("application/json"))||this.responseText.blank()){return null
}try{return this.responseText.evalJSON(A.sanitizeJSON)}catch(B){this.request.dispatchException(B)
}}});Ajax.Updater=Class.create(Ajax.Request,{initialize:function($super,A,C,B){this.container={success:(A.success||A),failure:(A.failure||(A.success?null:A))};
B=Object.clone(B);var D=B.onComplete;B.onComplete=(function(E,F){this.updateContent(E.responseText);
if(Object.isFunction(D)){D(E,F)}}).bind(this);$super(C,B)},updateContent:function(D){var C=this.container[this.success()?"success":"failure"],A=this.options;
if(!A.evalScripts){D=D.stripScripts()}if(C=$(C)){if(A.insertion){if(Object.isString(A.insertion)){var B={};
B[A.insertion]=D;C.insert(B)}else{A.insertion(C,D)}}else{C.update(D)}}}});Ajax.PeriodicalUpdater=Class.create(Ajax.Base,{initialize:function($super,A,C,B){$super(B);
this.onComplete=this.options.onComplete;this.frequency=(this.options.frequency||2);
this.decay=(this.options.decay||1);this.updater={};this.container=A;this.url=C;this.start()
},start:function(){this.options.onComplete=this.updateComplete.bind(this);this.onTimerEvent()
},stop:function(){this.updater.options.onComplete=undefined;clearTimeout(this.timer);
(this.onComplete||Prototype.emptyFunction).apply(this,arguments)},updateComplete:function(A){if(this.options.decay){this.decay=(A.responseText==this.lastText?this.decay*this.options.decay:1);
this.lastText=A.responseText}this.timer=this.onTimerEvent.bind(this).delay(this.decay*this.frequency)
},onTimerEvent:function(){this.updater=new Ajax.Updater(this.container,this.url,this.options)
}});function $(B){if(arguments.length>1){for(var A=0,D=[],C=arguments.length;A<C;
A++){D.push($(arguments[A]))}return D}if(Object.isString(B)){B=document.getElementById(B)
}return Element.extend(B)}if(Prototype.BrowserFeatures.XPath){document._getElementsByXPath=function(F,A){var C=[];
var E=document.evaluate(F,$(A)||document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
for(var B=0,D=E.snapshotLength;B<D;B++){C.push(Element.extend(E.snapshotItem(B)))
}return C}}if(!window.Node){var Node={}}if(!Node.ELEMENT_NODE){Object.extend(Node,{ELEMENT_NODE:1,ATTRIBUTE_NODE:2,TEXT_NODE:3,CDATA_SECTION_NODE:4,ENTITY_REFERENCE_NODE:5,ENTITY_NODE:6,PROCESSING_INSTRUCTION_NODE:7,COMMENT_NODE:8,DOCUMENT_NODE:9,DOCUMENT_TYPE_NODE:10,DOCUMENT_FRAGMENT_NODE:11,NOTATION_NODE:12})
}(function(){var A=this.Element;this.Element=function(D,C){C=C||{};D=D.toLowerCase();
var B=Element.cache;if(Prototype.Browser.IE&&C.name){D="<"+D+' name="'+C.name+'">';
delete C.name;return Element.writeAttribute(document.createElement(D),C)}if(!B[D]){B[D]=Element.extend(document.createElement(D))
}return Element.writeAttribute(B[D].cloneNode(false),C)};Object.extend(this.Element,A||{})
}).call(window);Element.cache={};Element.Methods={visible:function(A){return $(A).style.display!="none"
},toggle:function(A){A=$(A);Element[Element.visible(A)?"hide":"show"](A);return A
},hide:function(A){$(A).style.display="none";return A},show:function(A){$(A).style.display="";
return A},remove:function(A){A=$(A);A.parentNode.removeChild(A);return A},update:function(A,B){A=$(A);
if(B&&B.toElement){B=B.toElement()}if(Object.isElement(B)){return A.update().insert(B)
}B=Object.toHTML(B);A.innerHTML=B.stripScripts();B.evalScripts.bind(B).defer();return A
},replace:function(B,C){B=$(B);if(C&&C.toElement){C=C.toElement()}else{if(!Object.isElement(C)){C=Object.toHTML(C);
var A=B.ownerDocument.createRange();A.selectNode(B);C.evalScripts.bind(C).defer();
C=A.createContextualFragment(C.stripScripts())}}B.parentNode.replaceChild(C,B);return B
},insert:function(B,D){B=$(B);if(Object.isString(D)||Object.isNumber(D)||Object.isElement(D)||(D&&(D.toElement||D.toHTML))){D={bottom:D}
}var C,E,A,F;for(position in D){C=D[position];position=position.toLowerCase();E=Element._insertionTranslations[position];
if(C&&C.toElement){C=C.toElement()}if(Object.isElement(C)){E(B,C);continue}C=Object.toHTML(C);
A=((position=="before"||position=="after")?B.parentNode:B).tagName.toUpperCase();
F=Element._getContentFromAnonymousElement(A,C.stripScripts());if(position=="top"||position=="after"){F.reverse()
}F.each(E.curry(B));C.evalScripts.bind(C).defer()}return B},wrap:function(B,C,A){B=$(B);
if(Object.isElement(C)){$(C).writeAttribute(A||{})}else{if(Object.isString(C)){C=new Element(C,A)
}else{C=new Element("div",C)}}if(B.parentNode){B.parentNode.replaceChild(C,B)}C.appendChild(B);
return C},inspect:function(B){B=$(B);var A="<"+B.tagName.toLowerCase();$H({id:"id",className:"class"}).each(function(F){var E=F.first(),C=F.last();
var D=(B[E]||"").toString();if(D){A+=" "+C+"="+D.inspect(true)}});return A+">"},recursivelyCollect:function(A,C){A=$(A);
var B=[];while(A=A[C]){if(A.nodeType==1){B.push(Element.extend(A))}}return B},ancestors:function(A){return $(A).recursivelyCollect("parentNode")
},descendants:function(A){return $(A).getElementsBySelector("*")},firstDescendant:function(A){A=$(A).firstChild;
while(A&&A.nodeType!=1){A=A.nextSibling}return $(A)},immediateDescendants:function(A){if(!(A=$(A).firstChild)){return[]
}while(A&&A.nodeType!=1){A=A.nextSibling}if(A){return[A].concat($(A).nextSiblings())
}return[]},previousSiblings:function(A){return $(A).recursivelyCollect("previousSibling")
},nextSiblings:function(A){return $(A).recursivelyCollect("nextSibling")},siblings:function(A){A=$(A);
return A.previousSiblings().reverse().concat(A.nextSiblings())},match:function(B,A){if(Object.isString(A)){A=new Selector(A)
}return A.match($(B))},up:function(B,D,A){B=$(B);if(arguments.length==1){return $(B.parentNode)
}var C=B.ancestors();return Object.isNumber(D)?C[D]:Selector.findElement(C,D,A)},down:function(B,C,A){B=$(B);
if(arguments.length==1){return B.firstDescendant()}return Object.isNumber(C)?B.descendants()[C]:B.select(C)[A||0]
},previous:function(B,D,A){B=$(B);if(arguments.length==1){return $(Selector.handlers.previousElementSibling(B))
}var C=B.previousSiblings();return Object.isNumber(D)?C[D]:Selector.findElement(C,D,A)
},next:function(C,D,B){C=$(C);if(arguments.length==1){return $(Selector.handlers.nextElementSibling(C))
}var A=C.nextSiblings();return Object.isNumber(D)?A[D]:Selector.findElement(A,D,B)
},select:function(){var A=$A(arguments),B=$(A.shift());return Selector.findChildElements(B,A)
},adjacent:function(){var A=$A(arguments),B=$(A.shift());return Selector.findChildElements(B.parentNode,A).without(B)
},identify:function(B){B=$(B);var C=B.readAttribute("id"),A=arguments.callee;if(C){return C
}do{C="anonymous_element_"+A.counter++}while($(C));B.writeAttribute("id",C);return C
},readAttribute:function(C,A){C=$(C);if(Prototype.Browser.IE){var B=Element._attributeTranslations.read;
if(B.values[A]){return B.values[A](C,A)}if(B.names[A]){A=B.names[A]}if(A.include(":")){return(!C.attributes||!C.attributes[A])?null:C.attributes[A].value
}}return C.getAttribute(A)},writeAttribute:function(E,C,F){E=$(E);var B={},D=Element._attributeTranslations.write;
if(typeof C=="object"){B=C}else{B[C]=Object.isUndefined(F)?true:F}for(var A in B){C=D.names[A]||A;
F=B[A];if(D.values[A]){C=D.values[A](E,F)}if(F===false||F===null){E.removeAttribute(C)
}else{if(F===true){E.setAttribute(C,C)}else{E.setAttribute(C,F)}}}return E},getHeight:function(A){return $(A).getDimensions().height
},getWidth:function(A){return $(A).getDimensions().width},classNames:function(A){return new Element.ClassNames(A)
},hasClassName:function(A,B){if(!(A=$(A))){return }var C=A.className;return(C.length>0&&(C==B||new RegExp("(^|\\s)"+B+"(\\s|$)").test(C)))
},addClassName:function(A,B){if(!(A=$(A))){return }if(!A.hasClassName(B)){A.className+=(A.className?" ":"")+B
}return A},removeClassName:function(A,B){if(!(A=$(A))){return }A.className=A.className.replace(new RegExp("(^|\\s+)"+B+"(\\s+|$)")," ").strip();
return A},toggleClassName:function(A,B){if(!(A=$(A))){return }return A[A.hasClassName(B)?"removeClassName":"addClassName"](B)
},cleanWhitespace:function(B){B=$(B);var C=B.firstChild;while(C){var A=C.nextSibling;
if(C.nodeType==3&&!/\S/.test(C.nodeValue)){B.removeChild(C)}C=A}return B},empty:function(A){return $(A).innerHTML.blank()
},descendantOf:function(D,C){D=$(D),C=$(C);var F=C;if(D.compareDocumentPosition){return(D.compareDocumentPosition(C)&8)===8
}if(D.sourceIndex&&!Prototype.Browser.Opera){var E=D.sourceIndex,B=C.sourceIndex,A=C.nextSibling;
if(!A){do{C=C.parentNode}while(!(A=C.nextSibling)&&C.parentNode)}if(A){return(E>B&&E<A.sourceIndex)
}}while(D=D.parentNode){if(D==F){return true}}return false},scrollTo:function(A){A=$(A);
var B=A.cumulativeOffset();window.scrollTo(B[0],B[1]);return A},getStyle:function(B,C){B=$(B);
C=C=="float"?"cssFloat":C.camelize();var D=B.style[C];if(!D){var A=document.defaultView.getComputedStyle(B,null);
D=A?A[C]:null}if(C=="opacity"){return D?parseFloat(D):1}return D=="auto"?null:D},getOpacity:function(A){return $(A).getStyle("opacity")
},setStyle:function(B,C){B=$(B);var E=B.style,A;if(Object.isString(C)){B.style.cssText+=";"+C;
return C.include("opacity")?B.setOpacity(C.match(/opacity:\s*(\d?\.?\d*)/)[1]):B}for(var D in C){if(D=="opacity"){B.setOpacity(C[D])
}else{E[(D=="float"||D=="cssFloat")?(Object.isUndefined(E.styleFloat)?"cssFloat":"styleFloat"):D]=C[D]
}}return B},setOpacity:function(A,B){A=$(A);A.style.opacity=(B==1||B==="")?"":(B<0.00001)?0:B;
return A},getDimensions:function(C){C=$(C);var G=$(C).getStyle("display");if(G!="none"&&G!=null){return{width:C.offsetWidth,height:C.offsetHeight}
}var B=C.style;var F=B.visibility;var D=B.position;var A=B.display;B.visibility="hidden";
B.position="absolute";B.display="block";var H=C.clientWidth;var E=C.clientHeight;
B.display=A;B.position=D;B.visibility=F;return{width:H,height:E}},makePositioned:function(A){A=$(A);
var B=Element.getStyle(A,"position");if(B=="static"||!B){A._madePositioned=true;A.style.position="relative";
if(window.opera){A.style.top=0;A.style.left=0}}return A},undoPositioned:function(A){A=$(A);
if(A._madePositioned){A._madePositioned=undefined;A.style.position=A.style.top=A.style.left=A.style.bottom=A.style.right=""
}return A},makeClipping:function(A){A=$(A);if(A._overflow){return A}A._overflow=Element.getStyle(A,"overflow")||"auto";
if(A._overflow!=="hidden"){A.style.overflow="hidden"}return A},undoClipping:function(A){A=$(A);
if(!A._overflow){return A}A.style.overflow=A._overflow=="auto"?"":A._overflow;A._overflow=null;
return A},cumulativeOffset:function(B){var A=0,C=0;do{A+=B.offsetTop||0;C+=B.offsetLeft||0;
B=B.offsetParent}while(B);return Element._returnOffset(C,A)},positionedOffset:function(B){var A=0,D=0;
do{A+=B.offsetTop||0;D+=B.offsetLeft||0;B=B.offsetParent;if(B){if(B.tagName=="BODY"){break
}var C=Element.getStyle(B,"position");if(C=="relative"||C=="absolute"){break}}}while(B);
return Element._returnOffset(D,A)},absolutize:function(B){B=$(B);if(B.getStyle("position")=="absolute"){return 
}var D=B.positionedOffset();var F=D[1];var E=D[0];var C=B.clientWidth;var A=B.clientHeight;
B._originalLeft=E-parseFloat(B.style.left||0);B._originalTop=F-parseFloat(B.style.top||0);
B._originalWidth=B.style.width;B._originalHeight=B.style.height;B.style.position="absolute";
B.style.top=F+"px";B.style.left=E+"px";B.style.width=C+"px";B.style.height=A+"px";
return B},relativize:function(A){A=$(A);if(A.getStyle("position")=="relative"){return 
}A.style.position="relative";var C=parseFloat(A.style.top||0)-(A._originalTop||0);
var B=parseFloat(A.style.left||0)-(A._originalLeft||0);A.style.top=C+"px";A.style.left=B+"px";
A.style.height=A._originalHeight;A.style.width=A._originalWidth;return A},cumulativeScrollOffset:function(B){var A=0,C=0;
do{A+=B.scrollTop||0;C+=B.scrollLeft||0;B=B.parentNode}while(B);return Element._returnOffset(C,A)
},getOffsetParent:function(A){if(A.offsetParent){return $(A.offsetParent)}if(A==document.body){return $(A)
}while((A=A.parentNode)&&A!=document.body){if(Element.getStyle(A,"position")!="static"){return $(A)
}}return $(document.body)},viewportOffset:function(D){var A=0,C=0;var B=D;do{A+=B.offsetTop||0;
C+=B.offsetLeft||0;if(B.offsetParent==document.body&&Element.getStyle(B,"position")=="absolute"){break
}}while(B=B.offsetParent);B=D;do{if(!Prototype.Browser.Opera||B.tagName=="BODY"){A-=B.scrollTop||0;
C-=B.scrollLeft||0}}while(B=B.parentNode);return Element._returnOffset(C,A)},clonePosition:function(B,D){var A=Object.extend({setLeft:true,setTop:true,setWidth:true,setHeight:true,offsetTop:0,offsetLeft:0},arguments[2]||{});
D=$(D);var E=D.viewportOffset();B=$(B);var F=[0,0];var C=null;if(Element.getStyle(B,"position")=="absolute"){C=B.getOffsetParent();
F=C.viewportOffset()}if(C==document.body){F[0]-=document.body.offsetLeft;F[1]-=document.body.offsetTop
}if(A.setLeft){B.style.left=(E[0]-F[0]+A.offsetLeft)+"px"}if(A.setTop){B.style.top=(E[1]-F[1]+A.offsetTop)+"px"
}if(A.setWidth){B.style.width=D.offsetWidth+"px"}if(A.setHeight){B.style.height=D.offsetHeight+"px"
}return B}};Element.Methods.identify.counter=1;Object.extend(Element.Methods,{getElementsBySelector:Element.Methods.select,childElements:Element.Methods.immediateDescendants});
Element._attributeTranslations={write:{names:{className:"class",htmlFor:"for"},values:{}}};
if(Prototype.Browser.Opera){Element.Methods.getStyle=Element.Methods.getStyle.wrap(function(D,B,C){switch(C){case"left":case"top":case"right":case"bottom":if(D(B,"position")==="static"){return null
}case"height":case"width":if(!Element.visible(B)){return null}var E=parseInt(D(B,C),10);
if(E!==B["offset"+C.capitalize()]){return E+"px"}var A;if(C==="height"){A=["border-top-width","padding-top","padding-bottom","border-bottom-width"]
}else{A=["border-left-width","padding-left","padding-right","border-right-width"]
}return A.inject(E,function(F,G){var H=D(B,G);return H===null?F:F-parseInt(H,10)})+"px";
default:return D(B,C)}});Element.Methods.readAttribute=Element.Methods.readAttribute.wrap(function(C,A,B){if(B==="title"){return A.title
}return C(A,B)})}else{if(Prototype.Browser.IE){$w("positionedOffset getOffsetParent viewportOffset").each(function(A){Element.Methods[A]=Element.Methods[A].wrap(function(D,C){C=$(C);
var B=C.getStyle("position");if(B!="static"){return D(C)}C.setStyle({position:"relative"});
var E=D(C);C.setStyle({position:B});return E})});Element.Methods.getStyle=function(A,B){A=$(A);
B=(B=="float"||B=="cssFloat")?"styleFloat":B.camelize();var C=A.style[B];if(!C&&A.currentStyle){C=A.currentStyle[B]
}if(B=="opacity"){if(C=(A.getStyle("filter")||"").match(/alpha\(opacity=(.*)\)/)){if(C[1]){return parseFloat(C[1])/100
}}return 1}if(C=="auto"){if((B=="width"||B=="height")&&(A.getStyle("display")!="none")){return A["offset"+B.capitalize()]+"px"
}return null}return C};Element.Methods.setOpacity=function(B,E){function F(G){return G.replace(/alpha\([^\)]*\)/gi,"")
}B=$(B);var A=B.currentStyle;if((A&&!A.hasLayout)||(!A&&B.style.zoom=="normal")){B.style.zoom=1
}var D=B.getStyle("filter"),C=B.style;if(E==1||E===""){(D=F(D))?C.filter=D:C.removeAttribute("filter");
return B}else{if(E<0.00001){E=0}}C.filter=F(D)+"alpha(opacity="+(E*100)+")";return B
};Element._attributeTranslations={read:{names:{"class":"className","for":"htmlFor"},values:{_getAttr:function(A,B){return A.getAttribute(B,2)
},_getAttrNode:function(A,C){var B=A.getAttributeNode(C);return B?B.value:""},_getEv:function(A,B){B=A.getAttribute(B);
return B?B.toString().slice(23,-2):null},_flag:function(A,B){return $(A).hasAttribute(B)?B:null
},style:function(A){return A.style.cssText.toLowerCase()},title:function(A){return A.title
}}}};Element._attributeTranslations.write={names:Object.clone(Element._attributeTranslations.read.names),values:{checked:function(A,B){A.checked=!!B
},style:function(A,B){A.style.cssText=B?B:""}}};Element._attributeTranslations.has={};
$w("colSpan rowSpan vAlign dateTime accessKey tabIndex encType maxLength readOnly longDesc").each(function(A){Element._attributeTranslations.write.names[A.toLowerCase()]=A;
Element._attributeTranslations.has[A.toLowerCase()]=A});(function(A){Object.extend(A,{href:A._getAttr,src:A._getAttr,type:A._getAttr,action:A._getAttrNode,disabled:A._flag,checked:A._flag,readonly:A._flag,multiple:A._flag,onload:A._getEv,onunload:A._getEv,onclick:A._getEv,ondblclick:A._getEv,onmousedown:A._getEv,onmouseup:A._getEv,onmouseover:A._getEv,onmousemove:A._getEv,onmouseout:A._getEv,onfocus:A._getEv,onblur:A._getEv,onkeypress:A._getEv,onkeydown:A._getEv,onkeyup:A._getEv,onsubmit:A._getEv,onreset:A._getEv,onselect:A._getEv,onchange:A._getEv})
})(Element._attributeTranslations.read.values)}else{if(Prototype.Browser.Gecko&&/rv:1\.8\.0/.test(navigator.userAgent)){Element.Methods.setOpacity=function(A,B){A=$(A);
A.style.opacity=(B==1)?0.999999:(B==="")?"":(B<0.00001)?0:B;return A}}else{if(Prototype.Browser.WebKit){Element.Methods.setOpacity=function(A,B){A=$(A);
A.style.opacity=(B==1||B==="")?"":(B<0.00001)?0:B;if(B==1){if(A.tagName=="IMG"&&A.width){A.width++;
A.width--}else{try{var D=document.createTextNode(" ");A.appendChild(D);A.removeChild(D)
}catch(C){}}}return A};Element.Methods.cumulativeOffset=function(B){var A=0,C=0;do{A+=B.offsetTop||0;
C+=B.offsetLeft||0;if(B.offsetParent==document.body){if(Element.getStyle(B,"position")=="absolute"){break
}}B=B.offsetParent}while(B);return Element._returnOffset(C,A)}}}}}if(Prototype.Browser.IE||Prototype.Browser.Opera){Element.Methods.update=function(B,C){B=$(B);
if(C&&C.toElement){C=C.toElement()}if(Object.isElement(C)){return B.update().insert(C)
}C=Object.toHTML(C);var A=B.tagName.toUpperCase();if(A in Element._insertionTranslations.tags){$A(B.childNodes).each(function(D){B.removeChild(D)
});Element._getContentFromAnonymousElement(A,C.stripScripts()).each(function(D){B.appendChild(D)
})}else{B.innerHTML=C.stripScripts()}C.evalScripts.bind(C).defer();return B}}if(document.createElement("div").outerHTML){Element.Methods.replace=function(C,E){C=$(C);
if(E&&E.toElement){E=E.toElement()}if(Object.isElement(E)){C.parentNode.replaceChild(E,C);
return C}E=Object.toHTML(E);var D=C.parentNode,B=D.tagName.toUpperCase();if(Element._insertionTranslations.tags[B]){var F=C.next();
var A=Element._getContentFromAnonymousElement(B,E.stripScripts());D.removeChild(C);
if(F){A.each(function(G){D.insertBefore(G,F)})}else{A.each(function(G){D.appendChild(G)
})}}else{C.outerHTML=E.stripScripts()}E.evalScripts.bind(E).defer();return C}}Element._returnOffset=function(B,C){var A=[B,C];
A.left=B;A.top=C;return A};Element._getContentFromAnonymousElement=function(C,B){var D=new Element("div"),A=Element._insertionTranslations.tags[C];
if(A){D.innerHTML=A[0]+B+A[1];A[2].times(function(){D=D.firstChild})}else{D.innerHTML=B
}return $A(D.childNodes)};Element._insertionTranslations={before:function(A,B){A.parentNode.insertBefore(B,A)
},top:function(A,B){A.insertBefore(B,A.firstChild)},bottom:function(A,B){A.appendChild(B)
},after:function(A,B){A.parentNode.insertBefore(B,A.nextSibling)},tags:{TABLE:["<table>","</table>",1],TBODY:["<table><tbody>","</tbody></table>",2],TR:["<table><tbody><tr>","</tr></tbody></table>",3],TD:["<table><tbody><tr><td>","</td></tr></tbody></table>",4],SELECT:["<select>","</select>",1]}};
(function(){Object.extend(this.tags,{THEAD:this.tags.TBODY,TFOOT:this.tags.TBODY,TH:this.tags.TD})
}).call(Element._insertionTranslations);Element.Methods.Simulated={hasAttribute:function(A,C){C=Element._attributeTranslations.has[C]||C;
var B=$(A).getAttributeNode(C);return B&&B.specified}};Element.Methods.ByTag={};Object.extend(Element,Element.Methods);
if(!Prototype.BrowserFeatures.ElementExtensions&&document.createElement("div").__proto__){window.HTMLElement={};
window.HTMLElement.prototype=document.createElement("div").__proto__;Prototype.BrowserFeatures.ElementExtensions=true
}Element.extend=(function(){if(Prototype.BrowserFeatures.SpecificElementExtensions){return Prototype.K
}var A={},B=Element.Methods.ByTag;var C=Object.extend(function(F){if(!F||F._extendedByPrototype||F.nodeType!=1||F==window){return F
}var D=Object.clone(A),E=F.tagName,H,G;if(B[E]){Object.extend(D,B[E])}for(H in D){G=D[H];
if(Object.isFunction(G)&&!(H in F)){F[H]=G.methodize()}}F._extendedByPrototype=Prototype.emptyFunction;
return F},{refresh:function(){if(!Prototype.BrowserFeatures.ElementExtensions){Object.extend(A,Element.Methods);
Object.extend(A,Element.Methods.Simulated)}}});C.refresh();return C})();Element.hasAttribute=function(A,B){if(A.hasAttribute){return A.hasAttribute(B)
}return Element.Methods.Simulated.hasAttribute(A,B)};Element.addMethods=function(C){var I=Prototype.BrowserFeatures,D=Element.Methods.ByTag;
if(!C){Object.extend(Form,Form.Methods);Object.extend(Form.Element,Form.Element.Methods);
Object.extend(Element.Methods.ByTag,{FORM:Object.clone(Form.Methods),INPUT:Object.clone(Form.Element.Methods),SELECT:Object.clone(Form.Element.Methods),TEXTAREA:Object.clone(Form.Element.Methods)})
}if(arguments.length==2){var B=C;C=arguments[1]}if(!B){Object.extend(Element.Methods,C||{})
}else{if(Object.isArray(B)){B.each(H)}else{H(B)}}function H(F){F=F.toUpperCase();
if(!Element.Methods.ByTag[F]){Element.Methods.ByTag[F]={}}Object.extend(Element.Methods.ByTag[F],C)
}function A(L,K,F){F=F||false;for(var N in L){var M=L[N];if(!Object.isFunction(M)){continue
}if(!F||!(N in K)){K[N]=M.methodize()}}}function E(L){var F;var K={OPTGROUP:"OptGroup",TEXTAREA:"TextArea",P:"Paragraph",FIELDSET:"FieldSet",UL:"UList",OL:"OList",DL:"DList",DIR:"Directory",H1:"Heading",H2:"Heading",H3:"Heading",H4:"Heading",H5:"Heading",H6:"Heading",Q:"Quote",INS:"Mod",DEL:"Mod",A:"Anchor",IMG:"Image",CAPTION:"TableCaption",COL:"TableCol",COLGROUP:"TableCol",THEAD:"TableSection",TFOOT:"TableSection",TBODY:"TableSection",TR:"TableRow",TH:"TableCell",TD:"TableCell",FRAMESET:"FrameSet",IFRAME:"IFrame"};
if(K[L]){F="HTML"+K[L]+"Element"}if(window[F]){return window[F]}F="HTML"+L+"Element";
if(window[F]){return window[F]}F="HTML"+L.capitalize()+"Element";if(window[F]){return window[F]
}window[F]={};window[F].prototype=document.createElement(L).__proto__;return window[F]
}if(I.ElementExtensions){A(Element.Methods,HTMLElement.prototype);A(Element.Methods.Simulated,HTMLElement.prototype,true)
}if(I.SpecificElementExtensions){for(var J in Element.Methods.ByTag){var G=E(J);if(Object.isUndefined(G)){continue
}A(D[J],G.prototype)}}Object.extend(Element,Element.Methods);delete Element.ByTag;
if(Element.extend.refresh){Element.extend.refresh()}Element.cache={}};document.viewport={getDimensions:function(){var A={};
var C=Prototype.Browser;$w("width height").each(function(E){var B=E.capitalize();
A[E]=(C.WebKit&&!document.evaluate)?self["inner"+B]:(C.Opera)?document.body["client"+B]:document.documentElement["client"+B]
});return A},getWidth:function(){return this.getDimensions().width},getHeight:function(){return this.getDimensions().height
},getScrollOffsets:function(){return Element._returnOffset(window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft,window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop)
}};var Selector=Class.create({initialize:function(A){this.expression=A.strip();this.compileMatcher()
},shouldUseXPath:function(){if(!Prototype.BrowserFeatures.XPath){return false}var A=this.expression;
if(Prototype.Browser.WebKit&&(A.include("-of-type")||A.include(":empty"))){return false
}if((/(\[[\w-]*?:|:checked)/).test(this.expression)){return false}return true},compileMatcher:function(){if(this.shouldUseXPath()){return this.compileXPathMatcher()
}var e=this.expression,ps=Selector.patterns,h=Selector.handlers,c=Selector.criteria,le,p,m;
if(Selector._cache[e]){this.matcher=Selector._cache[e];return }this.matcher=["this.matcher = function(root) {","var r = root, h = Selector.handlers, c = false, n;"];
while(e&&le!=e&&(/\S/).test(e)){le=e;for(var i in ps){p=ps[i];if(m=e.match(p)){this.matcher.push(Object.isFunction(c[i])?c[i](m):new Template(c[i]).evaluate(m));
e=e.replace(m[0],"");break}}}this.matcher.push("return h.unique(n);\n}");eval(this.matcher.join("\n"));
Selector._cache[this.expression]=this.matcher},compileXPathMatcher:function(){var E=this.expression,F=Selector.patterns,B=Selector.xpath,D,A;
if(Selector._cache[E]){this.xpath=Selector._cache[E];return }this.matcher=[".//*"];
while(E&&D!=E&&(/\S/).test(E)){D=E;for(var C in F){if(A=E.match(F[C])){this.matcher.push(Object.isFunction(B[C])?B[C](A):new Template(B[C]).evaluate(A));
E=E.replace(A[0],"");break}}}this.xpath=this.matcher.join("");Selector._cache[this.expression]=this.xpath
},findElements:function(A){A=A||document;if(this.xpath){return document._getElementsByXPath(this.xpath,A)
}return this.matcher(A)},match:function(H){this.tokens=[];var L=this.expression,A=Selector.patterns,E=Selector.assertions;
var B,D,F;while(L&&B!==L&&(/\S/).test(L)){B=L;for(var I in A){D=A[I];if(F=L.match(D)){if(E[I]){this.tokens.push([I,Object.clone(F)]);
L=L.replace(F[0],"")}else{return this.findElements(document).include(H)}}}}var K=true,C,J;
for(var I=0,G;G=this.tokens[I];I++){C=G[0],J=G[1];if(!Selector.assertions[C](H,J)){K=false;
break}}return K},toString:function(){return this.expression},inspect:function(){return"#<Selector:"+this.expression.inspect()+">"
}});Object.extend(Selector,{_cache:{},xpath:{descendant:"//*",child:"/*",adjacent:"/following-sibling::*[1]",laterSibling:"/following-sibling::*",tagName:function(A){if(A[1]=="*"){return""
}return"[local-name()='"+A[1].toLowerCase()+"' or local-name()='"+A[1].toUpperCase()+"']"
},className:"[contains(concat(' ', @class, ' '), ' #{1} ')]",id:"[@id='#{1}']",attrPresence:function(A){A[1]=A[1].toLowerCase();
return new Template("[@#{1}]").evaluate(A)},attr:function(A){A[1]=A[1].toLowerCase();
A[3]=A[5]||A[6];return new Template(Selector.xpath.operators[A[2]]).evaluate(A)},pseudo:function(A){var B=Selector.xpath.pseudos[A[1]];
if(!B){return""}if(Object.isFunction(B)){return B(A)}return new Template(Selector.xpath.pseudos[A[1]]).evaluate(A)
},operators:{"=":"[@#{1}='#{3}']","!=":"[@#{1}!='#{3}']","^=":"[starts-with(@#{1}, '#{3}')]","$=":"[substring(@#{1}, (string-length(@#{1}) - string-length('#{3}') + 1))='#{3}']","*=":"[contains(@#{1}, '#{3}')]","~=":"[contains(concat(' ', @#{1}, ' '), ' #{3} ')]","|=":"[contains(concat('-', @#{1}, '-'), '-#{3}-')]"},pseudos:{"first-child":"[not(preceding-sibling::*)]","last-child":"[not(following-sibling::*)]","only-child":"[not(preceding-sibling::* or following-sibling::*)]",empty:"[count(*) = 0 and (count(text()) = 0 or translate(text(), ' \t\r\n', '') = '')]",checked:"[@checked]",disabled:"[@disabled]",enabled:"[not(@disabled)]",not:function(B){var H=B[6],G=Selector.patterns,A=Selector.xpath,E,C;
var F=[];while(H&&E!=H&&(/\S/).test(H)){E=H;for(var D in G){if(B=H.match(G[D])){C=Object.isFunction(A[D])?A[D](B):new Template(A[D]).evaluate(B);
F.push("("+C.substring(1,C.length-1)+")");H=H.replace(B[0],"");break}}}return"[not("+F.join(" and ")+")]"
},"nth-child":function(A){return Selector.xpath.pseudos.nth("(count(./preceding-sibling::*) + 1) ",A)
},"nth-last-child":function(A){return Selector.xpath.pseudos.nth("(count(./following-sibling::*) + 1) ",A)
},"nth-of-type":function(A){return Selector.xpath.pseudos.nth("position() ",A)},"nth-last-of-type":function(A){return Selector.xpath.pseudos.nth("(last() + 1 - position()) ",A)
},"first-of-type":function(A){A[6]="1";return Selector.xpath.pseudos["nth-of-type"](A)
},"last-of-type":function(A){A[6]="1";return Selector.xpath.pseudos["nth-last-of-type"](A)
},"only-of-type":function(A){var B=Selector.xpath.pseudos;return B["first-of-type"](A)+B["last-of-type"](A)
},nth:function(E,C){var F,G=C[6],B;if(G=="even"){G="2n+0"}if(G=="odd"){G="2n+1"}if(F=G.match(/^(\d+)$/)){return"["+E+"= "+F[1]+"]"
}if(F=G.match(/^(-?\d*)?n(([+-])(\d+))?/)){if(F[1]=="-"){F[1]=-1}var D=F[1]?Number(F[1]):1;
var A=F[2]?Number(F[2]):0;B="[((#{fragment} - #{b}) mod #{a} = 0) and ((#{fragment} - #{b}) div #{a} >= 0)]";
return new Template(B).evaluate({fragment:E,a:D,b:A})}}}},criteria:{tagName:'n = h.tagName(n, r, "#{1}", c);   c = false;',className:'n = h.className(n, r, "#{1}", c); c = false;',id:'n = h.id(n, r, "#{1}", c);        c = false;',attrPresence:'n = h.attrPresence(n, r, "#{1}"); c = false;',attr:function(A){A[3]=(A[5]||A[6]);
return new Template('n = h.attr(n, r, "#{1}", "#{3}", "#{2}"); c = false;').evaluate(A)
},pseudo:function(A){if(A[6]){A[6]=A[6].replace(/"/g,'\\"')}return new Template('n = h.pseudo(n, "#{1}", "#{6}", r, c); c = false;').evaluate(A)
},descendant:'c = "descendant";',child:'c = "child";',adjacent:'c = "adjacent";',laterSibling:'c = "laterSibling";'},patterns:{laterSibling:/^\s*~\s*/,child:/^\s*>\s*/,adjacent:/^\s*\+\s*/,descendant:/^\s/,tagName:/^\s*(\*|[\w\-]+)(\b|$)?/,id:/^#([\w\-\*]+)(\b|$)/,className:/^\.([\w\-\*]+)(\b|$)/,pseudo:/^:((first|last|nth|nth-last|only)(-child|-of-type)|empty|checked|(en|dis)abled|not)(\((.*?)\))?(\b|$|(?=\s|[:+~>]))/,attrPresence:/^\[([\w]+)\]/,attr:/\[((?:[\w-]*:)?[\w-]+)\s*(?:([!^$*~|]?=)\s*((['"])([^\4]*?)\4|([^'"][^\]]*?)))?\]/},assertions:{tagName:function(A,B){return B[1].toUpperCase()==A.tagName.toUpperCase()
},className:function(A,B){return Element.hasClassName(A,B[1])},id:function(A,B){return A.id===B[1]
},attrPresence:function(A,B){return Element.hasAttribute(A,B[1])},attr:function(B,C){var A=Element.readAttribute(B,C[1]);
return Selector.operators[C[2]](A,C[3])}},handlers:{concat:function(B,A){for(var C=0,D;
D=A[C];C++){B.push(D)}return B},mark:function(A){for(var B=0,C;C=A[B];B++){C._counted=true
}return A},unmark:function(A){for(var B=0,C;C=A[B];B++){C._counted=undefined}return A
},index:function(A,D,G){A._counted=true;if(D){for(var B=A.childNodes,E=B.length-1,C=1;
E>=0;E--){var F=B[E];if(F.nodeType==1&&(!G||F._counted)){F.nodeIndex=C++}}}else{for(var E=0,C=1,B=A.childNodes;
F=B[E];E++){if(F.nodeType==1&&(!G||F._counted)){F.nodeIndex=C++}}}},unique:function(B){if(B.length==0){return B
}var D=[],E;for(var C=0,A=B.length;C<A;C++){if(!(E=B[C])._counted){E._counted=true;
D.push(Element.extend(E))}}return Selector.handlers.unmark(D)},descendant:function(A){var D=Selector.handlers;
for(var C=0,B=[],E;E=A[C];C++){D.concat(B,E.getElementsByTagName("*"))}return B},child:function(A){var E=Selector.handlers;
for(var D=0,C=[],F;F=A[D];D++){for(var B=0,G;G=F.childNodes[B];B++){if(G.nodeType==1&&G.tagName!="!"){C.push(G)
}}}return C},adjacent:function(A){for(var C=0,B=[],E;E=A[C];C++){var D=this.nextElementSibling(E);
if(D){B.push(D)}}return B},laterSibling:function(A){var D=Selector.handlers;for(var C=0,B=[],E;
E=A[C];C++){D.concat(B,Element.nextSiblings(E))}return B},nextElementSibling:function(A){while(A=A.nextSibling){if(A.nodeType==1){return A
}}return null},previousElementSibling:function(A){while(A=A.previousSibling){if(A.nodeType==1){return A
}}return null},tagName:function(A,H,C,B){var I=C.toUpperCase();var E=[],G=Selector.handlers;
if(A){if(B){if(B=="descendant"){for(var F=0,D;D=A[F];F++){G.concat(E,D.getElementsByTagName(C))
}return E}else{A=this[B](A)}if(C=="*"){return A}}for(var F=0,D;D=A[F];F++){if(D.tagName.toUpperCase()===I){E.push(D)
}}return E}else{return H.getElementsByTagName(C)}},id:function(B,A,H,F){var G=$(H),D=Selector.handlers;
if(!G){return[]}if(!B&&A==document){return[G]}if(B){if(F){if(F=="child"){for(var C=0,E;
E=B[C];C++){if(G.parentNode==E){return[G]}}}else{if(F=="descendant"){for(var C=0,E;
E=B[C];C++){if(Element.descendantOf(G,E)){return[G]}}}else{if(F=="adjacent"){for(var C=0,E;
E=B[C];C++){if(Selector.handlers.previousElementSibling(G)==E){return[G]}}}else{B=D[F](B)
}}}}for(var C=0,E;E=B[C];C++){if(E==G){return[G]}}return[]}return(G&&Element.descendantOf(G,A))?[G]:[]
},className:function(B,A,C,D){if(B&&D){B=this[D](B)}return Selector.handlers.byClassName(B,A,C)
},byClassName:function(C,B,F){if(!C){C=Selector.handlers.descendant([B])}var H=" "+F+" ";
for(var E=0,D=[],G,A;G=C[E];E++){A=G.className;if(A.length==0){continue}if(A==F||(" "+A+" ").include(H)){D.push(G)
}}return D},attrPresence:function(C,B,A){if(!C){C=B.getElementsByTagName("*")}var E=[];
for(var D=0,F;F=C[D];D++){if(Element.hasAttribute(F,A)){E.push(F)}}return E},attr:function(A,H,G,I,B){if(!A){A=H.getElementsByTagName("*")
}var J=Selector.operators[B],D=[];for(var E=0,C;C=A[E];E++){var F=Element.readAttribute(C,G);
if(F===null){continue}if(J(F,I)){D.push(C)}}return D},pseudo:function(B,C,E,A,D){if(B&&D){B=this[D](B)
}if(!B){B=A.getElementsByTagName("*")}return Selector.pseudos[C](B,E,A)}},pseudos:{"first-child":function(B,F,A){for(var D=0,C=[],E;
E=B[D];D++){if(Selector.handlers.previousElementSibling(E)){continue}C.push(E)}return C
},"last-child":function(B,F,A){for(var D=0,C=[],E;E=B[D];D++){if(Selector.handlers.nextElementSibling(E)){continue
}C.push(E)}return C},"only-child":function(B,G,A){var E=Selector.handlers;for(var D=0,C=[],F;
F=B[D];D++){if(!E.previousElementSibling(F)&&!E.nextElementSibling(F)){C.push(F)}}return C
},"nth-child":function(B,C,A){return Selector.pseudos.nth(B,C,A)},"nth-last-child":function(B,C,A){return Selector.pseudos.nth(B,C,A,true)
},"nth-of-type":function(B,C,A){return Selector.pseudos.nth(B,C,A,false,true)},"nth-last-of-type":function(B,C,A){return Selector.pseudos.nth(B,C,A,true,true)
},"first-of-type":function(B,C,A){return Selector.pseudos.nth(B,"1",A,false,true)
},"last-of-type":function(B,C,A){return Selector.pseudos.nth(B,"1",A,true,true)},"only-of-type":function(B,D,A){var C=Selector.pseudos;
return C["last-of-type"](C["first-of-type"](B,D,A),D,A)},getIndices:function(B,A,C){if(B==0){return A>0?[A]:[]
}return $R(1,C).inject([],function(D,E){if(0==(E-A)%B&&(E-A)/B>=0){D.push(E)}return D
})},nth:function(A,L,N,K,C){if(A.length==0){return[]}if(L=="even"){L="2n+0"}if(L=="odd"){L="2n+1"
}var J=Selector.handlers,I=[],B=[],E;J.mark(A);for(var H=0,D;D=A[H];H++){if(!D.parentNode._counted){J.index(D.parentNode,K,C);
B.push(D.parentNode)}}if(L.match(/^\d+$/)){L=Number(L);for(var H=0,D;D=A[H];H++){if(D.nodeIndex==L){I.push(D)
}}}else{if(E=L.match(/^(-?\d*)?n(([+-])(\d+))?/)){if(E[1]=="-"){E[1]=-1}var O=E[1]?Number(E[1]):1;
var M=E[2]?Number(E[2]):0;var P=Selector.pseudos.getIndices(O,M,A.length);for(var H=0,D,F=P.length;
D=A[H];H++){for(var G=0;G<F;G++){if(D.nodeIndex==P[G]){I.push(D)}}}}}J.unmark(A);
J.unmark(B);return I},empty:function(B,F,A){for(var D=0,C=[],E;E=B[D];D++){if(E.tagName=="!"||(E.firstChild&&!E.innerHTML.match(/^\s*$/))){continue
}C.push(E)}return C},not:function(A,D,I){var G=Selector.handlers,J,C;var H=new Selector(D).findElements(I);
G.mark(H);for(var F=0,E=[],B;B=A[F];F++){if(!B._counted){E.push(B)}}G.unmark(H);return E
},enabled:function(B,F,A){for(var D=0,C=[],E;E=B[D];D++){if(!E.disabled){C.push(E)
}}return C},disabled:function(B,F,A){for(var D=0,C=[],E;E=B[D];D++){if(E.disabled){C.push(E)
}}return C},checked:function(B,F,A){for(var D=0,C=[],E;E=B[D];D++){if(E.checked){C.push(E)
}}return C}},operators:{"=":function(B,A){return B==A},"!=":function(B,A){return B!=A
},"^=":function(B,A){return B.startsWith(A)},"$=":function(B,A){return B.endsWith(A)
},"*=":function(B,A){return B.include(A)},"~=":function(B,A){return(" "+B+" ").include(" "+A+" ")
},"|=":function(B,A){return("-"+B.toUpperCase()+"-").include("-"+A.toUpperCase()+"-")
}},matchElements:function(F,G){var E=new Selector(G).findElements(),D=Selector.handlers;
D.mark(E);for(var C=0,B=[],A;A=F[C];C++){if(A._counted){B.push(A)}}D.unmark(E);return B
},findElement:function(B,C,A){if(Object.isNumber(C)){A=C;C=false}return Selector.matchElements(B,C||"*")[A||0]
},findChildElements:function(E,G){var H=G.join(",");G=[];H.scan(/(([\w#:.~>+()\s-]+|\*|\[.*?\])+)\s*(,|$)/,function(I){G.push(I[1].strip())
});var D=[],F=Selector.handlers;for(var C=0,B=G.length,A;C<B;C++){A=new Selector(G[C].strip());
F.concat(D,A.findElements(E))}return(B>1)?F.unique(D):D}});if(Prototype.Browser.IE){Selector.handlers.concat=function(B,A){for(var C=0,D;
D=A[C];C++){if(D.tagName!=="!"){B.push(D)}}return B}}function $$(){return Selector.findChildElements(document,$A(arguments))
}var Form={reset:function(A){$(A).reset();return A},serializeElements:function(G,B){if(typeof B!="object"){B={hash:!!B}
}else{if(Object.isUndefined(B.hash)){B.hash=true}}var C,F,A=false,E=B.submit;var D=G.inject({},function(H,I){if(!I.disabled&&I.name){C=I.name;
F=$(I).getValue();if(F!=null&&(I.type!="submit"||(!A&&E!==false&&(!E||C==E)&&(A=true)))){if(C in H){if(!Object.isArray(H[C])){H[C]=[H[C]]
}H[C].push(F)}else{H[C]=F}}}return H});return B.hash?D:Object.toQueryString(D)}};
Form.Methods={serialize:function(B,A){return Form.serializeElements(Form.getElements(B),A)
},getElements:function(A){return $A($(A).getElementsByTagName("*")).inject([],function(B,C){if(Form.Element.Serializers[C.tagName.toLowerCase()]){B.push(Element.extend(C))
}return B})},getInputs:function(G,C,D){G=$(G);var A=G.getElementsByTagName("input");
if(!C&&!D){return $A(A).map(Element.extend)}for(var E=0,H=[],F=A.length;E<F;E++){var B=A[E];
if((C&&B.type!=C)||(D&&B.name!=D)){continue}H.push(Element.extend(B))}return H},disable:function(A){A=$(A);
Form.getElements(A).invoke("disable");return A},enable:function(A){A=$(A);Form.getElements(A).invoke("enable");
return A},findFirstElement:function(B){var C=$(B).getElements().findAll(function(D){return"hidden"!=D.type&&!D.disabled
});var A=C.findAll(function(D){return D.hasAttribute("tabIndex")&&D.tabIndex>=0}).sortBy(function(D){return D.tabIndex
}).first();return A?A:C.find(function(D){return["input","select","textarea"].include(D.tagName.toLowerCase())
})},focusFirstElement:function(A){A=$(A);A.findFirstElement().activate();return A
},request:function(B,A){B=$(B),A=Object.clone(A||{});var D=A.parameters,C=B.readAttribute("action")||"";
if(C.blank()){C=window.location.href}A.parameters=B.serialize(true);if(D){if(Object.isString(D)){D=D.toQueryParams()
}Object.extend(A.parameters,D)}if(B.hasAttribute("method")&&!A.method){A.method=B.method
}return new Ajax.Request(C,A)}};Form.Element={focus:function(A){$(A).focus();return A
},select:function(A){$(A).select();return A}};Form.Element.Methods={serialize:function(A){A=$(A);
if(!A.disabled&&A.name){var B=A.getValue();if(B!=undefined){var C={};C[A.name]=B;
return Object.toQueryString(C)}}return""},getValue:function(A){A=$(A);var B=A.tagName.toLowerCase();
return Form.Element.Serializers[B](A)},setValue:function(A,B){A=$(A);var C=A.tagName.toLowerCase();
Form.Element.Serializers[C](A,B);return A},clear:function(A){$(A).value="";return A
},present:function(A){return $(A).value!=""},activate:function(A){A=$(A);try{A.focus();
if(A.select&&(A.tagName.toLowerCase()!="input"||!["button","reset","submit"].include(A.type))){A.select()
}}catch(B){}return A},disable:function(A){A=$(A);A.blur();A.disabled=true;return A
},enable:function(A){A=$(A);A.disabled=false;return A}};var Field=Form.Element;var $F=Form.Element.Methods.getValue;
Form.Element.Serializers={input:function(A,B){switch(A.type.toLowerCase()){case"checkbox":case"radio":return Form.Element.Serializers.inputSelector(A,B);
default:return Form.Element.Serializers.textarea(A,B)}},inputSelector:function(A,B){if(Object.isUndefined(B)){return A.checked?A.value:null
}else{A.checked=!!B}},textarea:function(A,B){if(Object.isUndefined(B)){return A.value
}else{A.value=B}},select:function(D,A){if(Object.isUndefined(A)){return this[D.type=="select-one"?"selectOne":"selectMany"](D)
}else{var C,F,G=!Object.isArray(A);for(var B=0,E=D.length;B<E;B++){C=D.options[B];
F=this.optionValue(C);if(G){if(F==A){C.selected=true;return }}else{C.selected=A.include(F)
}}}},selectOne:function(B){var A=B.selectedIndex;return A>=0?this.optionValue(B.options[A]):null
},selectMany:function(D){var A,E=D.length;if(!E){return null}for(var C=0,A=[];C<E;
C++){var B=D.options[C];if(B.selected){A.push(this.optionValue(B))}}return A},optionValue:function(A){return Element.extend(A).hasAttribute("value")?A.value:A.text
}};Abstract.TimedObserver=Class.create(PeriodicalExecuter,{initialize:function($super,A,B,C){$super(C,B);
this.element=$(A);this.lastValue=this.getValue()},execute:function(){var A=this.getValue();
if(Object.isString(this.lastValue)&&Object.isString(A)?this.lastValue!=A:String(this.lastValue)!=String(A)){this.callback(this.element,A);
this.lastValue=A}}});Form.Element.Observer=Class.create(Abstract.TimedObserver,{getValue:function(){return Form.Element.getValue(this.element)
}});Form.Observer=Class.create(Abstract.TimedObserver,{getValue:function(){return Form.serialize(this.element)
}});Abstract.EventObserver=Class.create({initialize:function(A,B){this.element=$(A);
this.callback=B;this.lastValue=this.getValue();if(this.element.tagName.toLowerCase()=="form"){this.registerFormCallbacks()
}else{this.registerCallback(this.element)}},onElementEvent:function(){var A=this.getValue();
if(this.lastValue!=A){this.callback(this.element,A);this.lastValue=A}},registerFormCallbacks:function(){Form.getElements(this.element).each(this.registerCallback,this)
},registerCallback:function(A){if(A.type){switch(A.type.toLowerCase()){case"checkbox":case"radio":Event.observe(A,"click",this.onElementEvent.bind(this));
break;default:Event.observe(A,"change",this.onElementEvent.bind(this));break}}}});
Form.Element.EventObserver=Class.create(Abstract.EventObserver,{getValue:function(){return Form.Element.getValue(this.element)
}});Form.EventObserver=Class.create(Abstract.EventObserver,{getValue:function(){return Form.serialize(this.element)
}});if(!window.Event){var Event={}}Object.extend(Event,{KEY_BACKSPACE:8,KEY_TAB:9,KEY_RETURN:13,KEY_ESC:27,KEY_LEFT:37,KEY_UP:38,KEY_RIGHT:39,KEY_DOWN:40,KEY_DELETE:46,KEY_HOME:36,KEY_END:35,KEY_PAGEUP:33,KEY_PAGEDOWN:34,KEY_INSERT:45,cache:{},relatedTarget:function(B){var A;
switch(B.type){case"mouseover":A=B.fromElement;break;case"mouseout":A=B.toElement;
break;default:return null}return Element.extend(A)}});Event.Methods=(function(){var A;
if(Prototype.Browser.IE){var B={0:1,1:4,2:2};A=function(D,C){return D.button==B[C]
}}else{if(Prototype.Browser.WebKit){A=function(D,C){switch(C){case 0:return D.which==1&&!D.metaKey;
case 1:return D.which==1&&D.metaKey;default:return false}}}else{A=function(D,C){return D.which?(D.which===C+1):(D.button===C)
}}}return{isLeftClick:function(C){return A(C,0)},isMiddleClick:function(C){return A(C,1)
},isRightClick:function(C){return A(C,2)},element:function(D){var C=Event.extend(D).target;
return Element.extend(C.nodeType==Node.TEXT_NODE?C.parentNode:C)},findElement:function(D,F){var C=Event.element(D);
if(!F){return C}var E=[C].concat(C.ancestors());return Selector.findElement(E,F,0)
},pointer:function(C){return{x:C.pageX||(C.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft)),y:C.pageY||(C.clientY+(document.documentElement.scrollTop||document.body.scrollTop))}
},pointerX:function(C){return Event.pointer(C).x},pointerY:function(C){return Event.pointer(C).y
},stop:function(C){Event.extend(C);C.preventDefault();C.stopPropagation();C.stopped=true
}}})();Event.extend=(function(){var A=Object.keys(Event.Methods).inject({},function(B,C){B[C]=Event.Methods[C].methodize();
return B});if(Prototype.Browser.IE){Object.extend(A,{stopPropagation:function(){this.cancelBubble=true
},preventDefault:function(){this.returnValue=false},inspect:function(){return"[object Event]"
}});return function(B){if(!B){return false}if(B._extendedByPrototype){return B}B._extendedByPrototype=Prototype.emptyFunction;
var C=Event.pointer(B);Object.extend(B,{target:B.srcElement,relatedTarget:Event.relatedTarget(B),pageX:C.x,pageY:C.y});
return Object.extend(B,A)}}else{Event.prototype=Event.prototype||document.createEvent("HTMLEvents").__proto__;
Object.extend(Event.prototype,A);return Prototype.K}})();Object.extend(Event,(function(){var B=Event.cache;
function C(J){if(J._eventID){return J._eventID}arguments.callee.id=arguments.callee.id||1;
return J._eventID=++arguments.callee.id}function G(J){if(J&&J.include(":")){return"dataavailable"
}return J}function A(J){return B[J]=B[J]||{}}function F(L,J){var K=A(L);return K[J]=K[J]||[]
}function H(K,J,L){var O=C(K);var N=F(O,J);if(N.pluck("handler").include(L)){return false
}var M=function(P){if(!Event||!Event.extend||(P.eventName&&P.eventName!=J)){return false
}Event.extend(P);L.call(K,P)};M.handler=L;N.push(M);return M}function I(M,J,K){var L=F(M,J);
return L.find(function(N){return N.handler==K})}function D(M,J,K){var L=A(M);if(!L[J]){return false
}L[J]=L[J].without(I(M,J,K))}function E(){for(var K in B){for(var J in B[K]){B[K][J]=null
}}}if(window.attachEvent){window.attachEvent("onunload",E)}return{observe:function(L,J,M){L=$(L);
var K=G(J);var N=H(L,J,M);if(!N){return L}if(L.addEventListener){L.addEventListener(K,N,false)
}else{L.attachEvent("on"+K,N)}return L},stopObserving:function(L,J,M){L=$(L);var O=C(L),K=G(J);
if(!M&&J){F(O,J).each(function(P){L.stopObserving(J,P.handler)});return L}else{if(!J){Object.keys(A(O)).each(function(P){L.stopObserving(P)
});return L}}var N=I(O,J,M);if(!N){return L}if(L.removeEventListener){L.removeEventListener(K,N,false)
}else{L.detachEvent("on"+K,N)}D(O,J,M);return L},fire:function(L,K,J){L=$(L);if(L==document&&document.createEvent&&!L.dispatchEvent){L=document.documentElement
}var M;if(document.createEvent){M=document.createEvent("HTMLEvents");M.initEvent("dataavailable",true,true)
}else{M=document.createEventObject();M.eventType="ondataavailable"}M.eventName=K;
M.memo=J||{};if(document.createEvent){L.dispatchEvent(M)}else{L.fireEvent(M.eventType,M)
}return Event.extend(M)}}})());Object.extend(Event,Event.Methods);Element.addMethods({fire:Event.fire,observe:Event.observe,stopObserving:Event.stopObserving});
Object.extend(document,{fire:Element.Methods.fire.methodize(),observe:Element.Methods.observe.methodize(),stopObserving:Element.Methods.stopObserving.methodize(),loaded:false});
(function(){var B;function A(){if(document.loaded){return }if(B){window.clearInterval(B)
}document.fire("dom:loaded");document.loaded=true}if(document.addEventListener){if(Prototype.Browser.WebKit){B=window.setInterval(function(){if(/loaded|complete/.test(document.readyState)){A()
}},0);Event.observe(window,"load",A)}else{document.addEventListener("DOMContentLoaded",A,false)
}}else{document.write("<script id=__onDOMContentLoaded defer src=//:><\/script>");
$("__onDOMContentLoaded").onreadystatechange=function(){if(this.readyState=="complete"){this.onreadystatechange=null;
A()}}}})();Hash.toQueryString=Object.toQueryString;var Toggle={display:Element.toggle};
Element.Methods.childOf=Element.Methods.descendantOf;var Insertion={Before:function(A,B){return Element.insert(A,{before:B})
},Top:function(A,B){return Element.insert(A,{top:B})},Bottom:function(A,B){return Element.insert(A,{bottom:B})
},After:function(A,B){return Element.insert(A,{after:B})}};var $continue=new Error('"throw $continue" is deprecated, use "return" instead');
var Position={includeScrollOffsets:false,prepare:function(){this.deltaX=window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0;
this.deltaY=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0
},within:function(B,A,C){if(this.includeScrollOffsets){return this.withinIncludingScrolloffsets(B,A,C)
}this.xcomp=A;this.ycomp=C;this.offset=Element.cumulativeOffset(B);return(C>=this.offset[1]&&C<this.offset[1]+B.offsetHeight&&A>=this.offset[0]&&A<this.offset[0]+B.offsetWidth)
},withinIncludingScrolloffsets:function(B,A,D){var C=Element.cumulativeScrollOffset(B);
this.xcomp=A+C[0]-this.deltaX;this.ycomp=D+C[1]-this.deltaY;this.offset=Element.cumulativeOffset(B);
return(this.ycomp>=this.offset[1]&&this.ycomp<this.offset[1]+B.offsetHeight&&this.xcomp>=this.offset[0]&&this.xcomp<this.offset[0]+B.offsetWidth)
},overlap:function(B,A){if(!B){return 0}if(B=="vertical"){return((this.offset[1]+A.offsetHeight)-this.ycomp)/A.offsetHeight
}if(B=="horizontal"){return((this.offset[0]+A.offsetWidth)-this.xcomp)/A.offsetWidth
}},cumulativeOffset:Element.Methods.cumulativeOffset,positionedOffset:Element.Methods.positionedOffset,absolutize:function(A){Position.prepare();
return Element.absolutize(A)},relativize:function(A){Position.prepare();return Element.relativize(A)
},realOffset:Element.Methods.cumulativeScrollOffset,offsetParent:Element.Methods.getOffsetParent,page:Element.Methods.viewportOffset,clone:function(B,C,A){A=A||{};
return Element.clonePosition(C,B,A)}};if(!document.getElementsByClassName){document.getElementsByClassName=function(B){function A(C){return C.blank()?null:"[contains(concat(' ', @class, ' '), ' "+C+" ')]"
}B.getElementsByClassName=Prototype.BrowserFeatures.XPath?function(C,E){E=E.toString().strip();
var D=/\s/.test(E)?$w(E).map(A).join(""):A(E);return D?document._getElementsByXPath(".//*"+D,C):[]
}:function(E,F){F=F.toString().strip();var G=[],H=(/\s/.test(F)?$w(F):null);if(!H&&!F){return G
}var C=$(E).getElementsByTagName("*");F=" "+F+" ";for(var D=0,J,I;J=C[D];D++){if(J.className&&(I=" "+J.className+" ")&&(I.include(F)||(H&&H.all(function(K){return !K.toString().blank()&&I.include(" "+K+" ")
})))){G.push(Element.extend(J))}}return G};return function(D,C){return $(C||document.body).getElementsByClassName(D)
}}(Element.Methods)}Element.ClassNames=Class.create();Element.ClassNames.prototype={initialize:function(A){this.element=$(A)
},_each:function(A){this.element.className.split(/\s+/).select(function(B){return B.length>0
})._each(A)},set:function(A){this.element.className=A},add:function(A){if(this.include(A)){return 
}this.set($A(this).concat(A).join(" "))},remove:function(A){if(!this.include(A)){return 
}this.set($A(this).without(A).join(" "))},toString:function(){return $A(this).join(" ")
}};Object.extend(Element.ClassNames.prototype,Enumerable);Element.addMethods();var Scriptaculous={Version:"1.8.1",require:function(A){document.write('<script type="text/javascript" src="'+A+'"><\/script>')
},REQUIRED_PROTOTYPE:"1.6.0",load:function(){function A(B){var C=B.split(".");return parseInt(C[0])*100000+parseInt(C[1])*1000+parseInt(C[2])
}if((typeof Prototype=="undefined")||(typeof Element=="undefined")||(typeof Element.Methods=="undefined")||(A(Prototype.Version)<A(Scriptaculous.REQUIRED_PROTOTYPE))){throw ("script.aculo.us requires the Prototype JavaScript framework >= "+Scriptaculous.REQUIRED_PROTOTYPE)
}$A(document.getElementsByTagName("script")).findAll(function(B){return(B.src&&B.src.match(/scriptaculous\.js(\?.*)?$/))
}).each(function(C){var D=C.src.replace(/scriptaculous\.js(\?.*)?$/,"");var B=C.src.match(/\?.*load=([a-z,]*)/);
(B?B[1]:"builder,effects,dragdrop,controls,slider,sound").split(",").each(function(E){Scriptaculous.require(D+E+".js")
})})}};var Builder={NODEMAP:{AREA:"map",CAPTION:"table",COL:"table",COLGROUP:"table",LEGEND:"fieldset",OPTGROUP:"select",OPTION:"select",PARAM:"object",TBODY:"table",TD:"table",TFOOT:"table",TH:"table",THEAD:"table",TR:"table"},node:function(A){A=A.toUpperCase();
var F=this.NODEMAP[A]||"div";var B=document.createElement(F);try{B.innerHTML="<"+A+"></"+A+">"
}catch(E){}var D=B.firstChild||null;if(D&&(D.tagName.toUpperCase()!=A)){D=D.getElementsByTagName(A)[0]
}if(!D){D=document.createElement(A)}if(!D){return }if(arguments[1]){if(this._isStringOrNumber(arguments[1])||(arguments[1] instanceof Array)||arguments[1].tagName){this._children(D,arguments[1])
}else{var C=this._attributes(arguments[1]);if(C.length){try{B.innerHTML="<"+A+" "+C+"></"+A+">"
}catch(E){}D=B.firstChild||null;if(!D){D=document.createElement(A);for(attr in arguments[1]){D[attr=="class"?"className":attr]=arguments[1][attr]
}}if(D.tagName.toUpperCase()!=A){D=B.getElementsByTagName(A)[0]}}}}if(arguments[2]){this._children(D,arguments[2])
}return D},_text:function(A){return document.createTextNode(A)},ATTR_MAP:{className:"class",htmlFor:"for"},_attributes:function(A){var B=[];
for(attribute in A){B.push((attribute in this.ATTR_MAP?this.ATTR_MAP[attribute]:attribute)+'="'+A[attribute].toString().escapeHTML().gsub(/"/,"&quot;")+'"')
}return B.join(" ")},_children:function(B,A){if(A.tagName){B.appendChild(A);return 
}if(typeof A=="object"){A.flatten().each(function(C){if(typeof C=="object"){B.appendChild(C)
}else{if(Builder._isStringOrNumber(C)){B.appendChild(Builder._text(C))}}})}else{if(Builder._isStringOrNumber(A)){B.appendChild(Builder._text(A))
}}},_isStringOrNumber:function(A){return(typeof A=="string"||typeof A=="number")},build:function(B){var A=this.node("div");
$(A).update(B.strip());return A.down()},dump:function(B){if(typeof B!="object"&&typeof B!="function"){B=window
}var A=("A ABBR ACRONYM ADDRESS APPLET AREA B BASE BASEFONT BDO BIG BLOCKQUOTE BODY BR BUTTON CAPTION CENTER CITE CODE COL COLGROUP DD DEL DFN DIR DIV DL DT EM FIELDSET FONT FORM FRAME FRAMESET H1 H2 H3 H4 H5 H6 HEAD HR HTML I IFRAME IMG INPUT INS ISINDEX KBD LABEL LEGEND LI LINK MAP MENU META NOFRAMES NOSCRIPT OBJECT OL OPTGROUP OPTION P PARAM PRE Q S SAMP SCRIPT SELECT SMALL SPAN STRIKE STRONG STYLE SUB SUP TABLE TBODY TD TEXTAREA TFOOT TH THEAD TITLE TR TT U UL VAR").split(/\s+/);
A.each(function(C){B[C]=function(){return Builder.node.apply(Builder,[C].concat($A(arguments)))
}})}};String.prototype.parseColor=function(){var A="#";if(this.slice(0,4)=="rgb("){var C=this.slice(4,this.length-1).split(",");
var B=0;do{A+=parseInt(C[B]).toColorPart()}while(++B<3)}else{if(this.slice(0,1)=="#"){if(this.length==4){for(var B=1;
B<4;B++){A+=(this.charAt(B)+this.charAt(B)).toLowerCase()}}if(this.length==7){A=this.toLowerCase()
}}}return(A.length==7?A:(arguments[0]||this))};Element.collectTextNodes=function(A){return $A($(A).childNodes).collect(function(B){return(B.nodeType==3?B.nodeValue:(B.hasChildNodes()?Element.collectTextNodes(B):""))
}).flatten().join("")};Element.collectTextNodesIgnoreClass=function(A,B){return $A($(A).childNodes).collect(function(C){return(C.nodeType==3?C.nodeValue:((C.hasChildNodes()&&!Element.hasClassName(C,B))?Element.collectTextNodesIgnoreClass(C,B):""))
}).flatten().join("")};Element.setContentZoom=function(A,B){A=$(A);A.setStyle({fontSize:(B/100)+"em"});
if(Prototype.Browser.WebKit){window.scrollBy(0,0)}return A};Element.getInlineOpacity=function(A){return $(A).style.opacity||""
};Element.forceRerendering=function(A){try{A=$(A);var C=document.createTextNode(" ");
A.appendChild(C);A.removeChild(C)}catch(B){}};var Effect={_elementDoesNotExistError:{name:"ElementDoesNotExistError",message:"The specified DOM element does not exist, but is required for this effect to operate"},Transitions:{linear:Prototype.K,sinoidal:function(A){return(-Math.cos(A*Math.PI)/2)+0.5
},reverse:function(A){return 1-A},flicker:function(A){var A=((-Math.cos(A*Math.PI)/4)+0.75)+Math.random()/4;
return A>1?1:A},wobble:function(A){return(-Math.cos(A*Math.PI*(9*A))/2)+0.5},pulse:function(B,A){A=A||5;
return(((B%(1/A))*A).round()==0?((B*A*2)-(B*A*2).floor()):1-((B*A*2)-(B*A*2).floor()))
},spring:function(A){return 1-(Math.cos(A*4.5*Math.PI)*Math.exp(-A*6))},none:function(A){return 0
},full:function(A){return 1}},DefaultOptions:{duration:1,fps:100,sync:false,from:0,to:1,delay:0,queue:"parallel"},tagifyText:function(A){var B="position:relative";
if(Prototype.Browser.IE){B+=";zoom:1"}A=$(A);$A(A.childNodes).each(function(C){if(C.nodeType==3){C.nodeValue.toArray().each(function(D){A.insertBefore(new Element("span",{style:B}).update(D==" "?String.fromCharCode(160):D),C)
});Element.remove(C)}})},multiple:function(B,C){var E;if(((typeof B=="object")||Object.isFunction(B))&&(B.length)){E=B
}else{E=$(B).childNodes}var A=Object.extend({speed:0.1,delay:0},arguments[2]||{});
var D=A.delay;$A(E).each(function(G,F){new C(G,Object.extend(A,{delay:F*A.speed+D}))
})},PAIRS:{slide:["SlideDown","SlideUp"],blind:["BlindDown","BlindUp"],appear:["Appear","Fade"]},toggle:function(B,C){B=$(B);
C=(C||"appear").toLowerCase();var A=Object.extend({queue:{position:"end",scope:(B.id||"global"),limit:1}},arguments[2]||{});
Effect[B.visible()?Effect.PAIRS[C][1]:Effect.PAIRS[C][0]](B,A)}};Effect.DefaultOptions.transition=Effect.Transitions.sinoidal;
Effect.ScopedQueue=Class.create(Enumerable,{initialize:function(){this.effects=[];
this.interval=null},_each:function(A){this.effects._each(A)},add:function(B){var C=new Date().getTime();
var A=Object.isString(B.options.queue)?B.options.queue:B.options.queue.position;switch(A){case"front":this.effects.findAll(function(D){return D.state=="idle"
}).each(function(D){D.startOn+=B.finishOn;D.finishOn+=B.finishOn});break;case"with-last":C=this.effects.pluck("startOn").max()||C;
break;case"end":C=this.effects.pluck("finishOn").max()||C;break}B.startOn+=C;B.finishOn+=C;
if(!B.options.queue.limit||(this.effects.length<B.options.queue.limit)){this.effects.push(B)
}if(!this.interval){this.interval=setInterval(this.loop.bind(this),15)}},remove:function(A){this.effects=this.effects.reject(function(B){return B==A
});if(this.effects.length==0){clearInterval(this.interval);this.interval=null}},loop:function(){var C=new Date().getTime();
for(var B=0,A=this.effects.length;B<A;B++){this.effects[B]&&this.effects[B].loop(C)
}}});Effect.Queues={instances:$H(),get:function(A){if(!Object.isString(A)){return A
}return this.instances.get(A)||this.instances.set(A,new Effect.ScopedQueue())}};Effect.Queue=Effect.Queues.get("global");
Effect.Base=Class.create({position:null,start:function(options){function codeForEvent(options,eventName){return((options[eventName+"Internal"]?"this.options."+eventName+"Internal(this);":"")+(options[eventName]?"this.options."+eventName+"(this);":""))
}if(options&&options.transition===false){options.transition=Effect.Transitions.linear
}this.options=Object.extend(Object.extend({},Effect.DefaultOptions),options||{});
this.currentFrame=0;this.state="idle";this.startOn=this.options.delay*1000;this.finishOn=this.startOn+(this.options.duration*1000);
this.fromToDelta=this.options.to-this.options.from;this.totalTime=this.finishOn-this.startOn;
this.totalFrames=this.options.fps*this.options.duration;eval('this.render = function(pos){ if (this.state=="idle"){this.state="running";'+codeForEvent(this.options,"beforeSetup")+(this.setup?"this.setup();":"")+codeForEvent(this.options,"afterSetup")+'};if (this.state=="running"){pos=this.options.transition(pos)*'+this.fromToDelta+"+"+this.options.from+";this.position=pos;"+codeForEvent(this.options,"beforeUpdate")+(this.update?"this.update(pos);":"")+codeForEvent(this.options,"afterUpdate")+"}}");
this.event("beforeStart");if(!this.options.sync){Effect.Queues.get(Object.isString(this.options.queue)?"global":this.options.queue.scope).add(this)
}},loop:function(C){if(C>=this.startOn){if(C>=this.finishOn){this.render(1);this.cancel();
this.event("beforeFinish");if(this.finish){this.finish()}this.event("afterFinish");
return }var B=(C-this.startOn)/this.totalTime,A=(B*this.totalFrames).round();if(A>this.currentFrame){this.render(B);
this.currentFrame=A}}},cancel:function(){if(!this.options.sync){Effect.Queues.get(Object.isString(this.options.queue)?"global":this.options.queue.scope).remove(this)
}this.state="finished"},event:function(A){if(this.options[A+"Internal"]){this.options[A+"Internal"](this)
}if(this.options[A]){this.options[A](this)}},inspect:function(){var A=$H();for(property in this){if(!Object.isFunction(this[property])){A.set(property,this[property])
}}return"#<Effect:"+A.inspect()+",options:"+$H(this.options).inspect()+">"}});Effect.Parallel=Class.create(Effect.Base,{initialize:function(A){this.effects=A||[];
this.start(arguments[1])},update:function(A){this.effects.invoke("render",A)},finish:function(A){this.effects.each(function(B){B.render(1);
B.cancel();B.event("beforeFinish");if(B.finish){B.finish(A)}B.event("afterFinish")
})}});Effect.Tween=Class.create(Effect.Base,{initialize:function(C,F,E){C=Object.isString(C)?$(C):C;
var B=$A(arguments),D=B.last(),A=B.length==5?B[3]:null;this.method=Object.isFunction(D)?D.bind(C):Object.isFunction(C[D])?C[D].bind(C):function(G){C[D]=G
};this.start(Object.extend({from:F,to:E},A||{}))},update:function(A){this.method(A)
}});Effect.Event=Class.create(Effect.Base,{initialize:function(){this.start(Object.extend({duration:0},arguments[0]||{}))
},update:Prototype.emptyFunction});Effect.Opacity=Class.create(Effect.Base,{initialize:function(B){this.element=$(B);
if(!this.element){throw (Effect._elementDoesNotExistError)}if(Prototype.Browser.IE&&(!this.element.currentStyle.hasLayout)){this.element.setStyle({zoom:1})
}var A=Object.extend({from:this.element.getOpacity()||0,to:1},arguments[1]||{});this.start(A)
},update:function(A){this.element.setOpacity(A)}});Effect.Move=Class.create(Effect.Base,{initialize:function(B){this.element=$(B);
if(!this.element){throw (Effect._elementDoesNotExistError)}var A=Object.extend({x:0,y:0,mode:"relative"},arguments[1]||{});
this.start(A)},setup:function(){this.element.makePositioned();this.originalLeft=parseFloat(this.element.getStyle("left")||"0");
this.originalTop=parseFloat(this.element.getStyle("top")||"0");if(this.options.mode=="absolute"){this.options.x=this.options.x-this.originalLeft;
this.options.y=this.options.y-this.originalTop}},update:function(A){this.element.setStyle({left:(this.options.x*A+this.originalLeft).round()+"px",top:(this.options.y*A+this.originalTop).round()+"px"})
}});Effect.MoveBy=function(B,A,C){return new Effect.Move(B,Object.extend({x:C,y:A},arguments[3]||{}))
};Effect.Scale=Class.create(Effect.Base,{initialize:function(B,C){this.element=$(B);
if(!this.element){throw (Effect._elementDoesNotExistError)}var A=Object.extend({scaleX:true,scaleY:true,scaleContent:true,scaleFromCenter:false,scaleMode:"box",scaleFrom:100,scaleTo:C},arguments[2]||{});
this.start(A)},setup:function(){this.restoreAfterFinish=this.options.restoreAfterFinish||false;
this.elementPositioning=this.element.getStyle("position");this.originalStyle={};["top","left","width","height","fontSize"].each(function(B){this.originalStyle[B]=this.element.style[B]
}.bind(this));this.originalTop=this.element.offsetTop;this.originalLeft=this.element.offsetLeft;
var A=this.element.getStyle("font-size")||"100%";["em","px","%","pt"].each(function(B){if(A.indexOf(B)>0){this.fontSize=parseFloat(A);
this.fontSizeType=B}}.bind(this));this.factor=(this.options.scaleTo-this.options.scaleFrom)/100;
this.dims=null;if(this.options.scaleMode=="box"){this.dims=[this.element.offsetHeight,this.element.offsetWidth]
}if(/^content/.test(this.options.scaleMode)){this.dims=[this.element.scrollHeight,this.element.scrollWidth]
}if(!this.dims){this.dims=[this.options.scaleMode.originalHeight,this.options.scaleMode.originalWidth]
}},update:function(A){var B=(this.options.scaleFrom/100)+(this.factor*A);if(this.options.scaleContent&&this.fontSize){this.element.setStyle({fontSize:this.fontSize*B+this.fontSizeType})
}this.setDimensions(this.dims[0]*B,this.dims[1]*B)},finish:function(A){if(this.restoreAfterFinish){this.element.setStyle(this.originalStyle)
}},setDimensions:function(A,D){var E={};if(this.options.scaleX){E.width=D.round()+"px"
}if(this.options.scaleY){E.height=A.round()+"px"}if(this.options.scaleFromCenter){var C=(A-this.dims[0])/2;
var B=(D-this.dims[1])/2;if(this.elementPositioning=="absolute"){if(this.options.scaleY){E.top=this.originalTop-C+"px"
}if(this.options.scaleX){E.left=this.originalLeft-B+"px"}}else{if(this.options.scaleY){E.top=-C+"px"
}if(this.options.scaleX){E.left=-B+"px"}}}this.element.setStyle(E)}});Effect.Highlight=Class.create(Effect.Base,{initialize:function(B){this.element=$(B);
if(!this.element){throw (Effect._elementDoesNotExistError)}var A=Object.extend({startcolor:"#ffff99"},arguments[1]||{});
this.start(A)},setup:function(){if(this.element.getStyle("display")=="none"){this.cancel();
return }this.oldStyle={};if(!this.options.keepBackgroundImage){this.oldStyle.backgroundImage=this.element.getStyle("background-image");
this.element.setStyle({backgroundImage:"none"})}if(!this.options.endcolor){this.options.endcolor=this.element.getStyle("background-color").parseColor("#ffffff")
}if(!this.options.restorecolor){this.options.restorecolor=this.element.getStyle("background-color")
}this._base=$R(0,2).map(function(A){return parseInt(this.options.startcolor.slice(A*2+1,A*2+3),16)
}.bind(this));this._delta=$R(0,2).map(function(A){return parseInt(this.options.endcolor.slice(A*2+1,A*2+3),16)-this._base[A]
}.bind(this))},update:function(A){this.element.setStyle({backgroundColor:$R(0,2).inject("#",function(B,C,D){return B+((this._base[D]+(this._delta[D]*A)).round().toColorPart())
}.bind(this))})},finish:function(){this.element.setStyle(Object.extend(this.oldStyle,{backgroundColor:this.options.restorecolor}))
}});Effect.ScrollTo=function(D){var C=arguments[1]||{},B=document.viewport.getScrollOffsets(),E=$(D).cumulativeOffset(),A=(window.height||document.body.scrollHeight)-document.viewport.getHeight();
if(C.offset){E[1]+=C.offset}return new Effect.Tween(null,B.top,E[1]>A?A:E[1],C,function(F){scrollTo(B.left,F.round())
})};Effect.Fade=function(C){C=$(C);var A=C.getInlineOpacity();var B=Object.extend({from:C.getOpacity()||1,to:0,afterFinishInternal:function(D){if(D.options.to!=0){return 
}D.element.hide().setStyle({opacity:A})}},arguments[1]||{});return new Effect.Opacity(C,B)
};Effect.Appear=function(B){B=$(B);var A=Object.extend({from:(B.getStyle("display")=="none"?0:B.getOpacity()||0),to:1,afterFinishInternal:function(C){C.element.forceRerendering()
},beforeSetup:function(C){C.element.setOpacity(C.options.from).show()}},arguments[1]||{});
return new Effect.Opacity(B,A)};Effect.Puff=function(B){B=$(B);var A={opacity:B.getInlineOpacity(),position:B.getStyle("position"),top:B.style.top,left:B.style.left,width:B.style.width,height:B.style.height};
return new Effect.Parallel([new Effect.Scale(B,200,{sync:true,scaleFromCenter:true,scaleContent:true,restoreAfterFinish:true}),new Effect.Opacity(B,{sync:true,to:0})],Object.extend({duration:1,beforeSetupInternal:function(C){Position.absolutize(C.effects[0].element)
},afterFinishInternal:function(C){C.effects[0].element.hide().setStyle(A)}},arguments[1]||{}))
};Effect.BlindUp=function(A){A=$(A);A.makeClipping();return new Effect.Scale(A,0,Object.extend({scaleContent:false,scaleX:false,restoreAfterFinish:true,afterFinishInternal:function(B){B.element.hide().undoClipping()
}},arguments[1]||{}))};Effect.BlindDown=function(B){B=$(B);var A=B.getDimensions();
return new Effect.Scale(B,100,Object.extend({scaleContent:false,scaleX:false,scaleFrom:0,scaleMode:{originalHeight:A.height,originalWidth:A.width},restoreAfterFinish:true,afterSetup:function(C){C.element.makeClipping().setStyle({height:"0px"}).show()
},afterFinishInternal:function(C){C.element.undoClipping()}},arguments[1]||{}))};
Effect.SwitchOff=function(B){B=$(B);var A=B.getInlineOpacity();return new Effect.Appear(B,Object.extend({duration:0.4,from:0,transition:Effect.Transitions.flicker,afterFinishInternal:function(C){new Effect.Scale(C.element,1,{duration:0.3,scaleFromCenter:true,scaleX:false,scaleContent:false,restoreAfterFinish:true,beforeSetup:function(D){D.element.makePositioned().makeClipping()
},afterFinishInternal:function(D){D.element.hide().undoClipping().undoPositioned().setStyle({opacity:A})
}})}},arguments[1]||{}))};Effect.DropOut=function(B){B=$(B);var A={top:B.getStyle("top"),left:B.getStyle("left"),opacity:B.getInlineOpacity()};
return new Effect.Parallel([new Effect.Move(B,{x:0,y:100,sync:true}),new Effect.Opacity(B,{sync:true,to:0})],Object.extend({duration:0.5,beforeSetup:function(C){C.effects[0].element.makePositioned()
},afterFinishInternal:function(C){C.effects[0].element.hide().undoPositioned().setStyle(A)
}},arguments[1]||{}))};Effect.Shake=function(D){D=$(D);var B=Object.extend({distance:20,duration:0.5},arguments[1]||{});
var E=parseFloat(B.distance);var C=parseFloat(B.duration)/10;var A={top:D.getStyle("top"),left:D.getStyle("left")};
return new Effect.Move(D,{x:E,y:0,duration:C,afterFinishInternal:function(F){new Effect.Move(F.element,{x:-E*2,y:0,duration:C*2,afterFinishInternal:function(G){new Effect.Move(G.element,{x:E*2,y:0,duration:C*2,afterFinishInternal:function(H){new Effect.Move(H.element,{x:-E*2,y:0,duration:C*2,afterFinishInternal:function(I){new Effect.Move(I.element,{x:E*2,y:0,duration:C*2,afterFinishInternal:function(J){new Effect.Move(J.element,{x:-E,y:0,duration:C,afterFinishInternal:function(K){K.element.undoPositioned().setStyle(A)
}})}})}})}})}})}})};Effect.SlideDown=function(C){C=$(C).cleanWhitespace();var A=C.down().getStyle("bottom");
var B=C.getDimensions();return new Effect.Scale(C,100,Object.extend({scaleContent:false,scaleX:false,scaleFrom:window.opera?0:1,scaleMode:{originalHeight:B.height,originalWidth:B.width},restoreAfterFinish:true,afterSetup:function(D){D.element.makePositioned();
D.element.down().makePositioned();if(window.opera){D.element.setStyle({top:""})}D.element.makeClipping().setStyle({height:"0px"}).show()
},afterUpdateInternal:function(D){D.element.down().setStyle({bottom:(D.dims[0]-D.element.clientHeight)+"px"})
},afterFinishInternal:function(D){D.element.undoClipping().undoPositioned();D.element.down().undoPositioned().setStyle({bottom:A})
}},arguments[1]||{}))};Effect.SlideUp=function(C){C=$(C).cleanWhitespace();var A=C.down().getStyle("bottom");
var B=C.getDimensions();return new Effect.Scale(C,window.opera?0:1,Object.extend({scaleContent:false,scaleX:false,scaleMode:"box",scaleFrom:100,scaleMode:{originalHeight:B.height,originalWidth:B.width},restoreAfterFinish:true,afterSetup:function(D){D.element.makePositioned();
D.element.down().makePositioned();if(window.opera){D.element.setStyle({top:""})}D.element.makeClipping().show()
},afterUpdateInternal:function(D){D.element.down().setStyle({bottom:(D.dims[0]-D.element.clientHeight)+"px"})
},afterFinishInternal:function(D){D.element.hide().undoClipping().undoPositioned();
D.element.down().undoPositioned().setStyle({bottom:A})}},arguments[1]||{}))};Effect.Squish=function(A){return new Effect.Scale(A,window.opera?1:0,{restoreAfterFinish:true,beforeSetup:function(B){B.element.makeClipping()
},afterFinishInternal:function(B){B.element.hide().undoClipping()}})};Effect.Grow=function(C){C=$(C);
var B=Object.extend({direction:"center",moveTransition:Effect.Transitions.sinoidal,scaleTransition:Effect.Transitions.sinoidal,opacityTransition:Effect.Transitions.full},arguments[1]||{});
var A={top:C.style.top,left:C.style.left,height:C.style.height,width:C.style.width,opacity:C.getInlineOpacity()};
var G=C.getDimensions();var H,F;var E,D;switch(B.direction){case"top-left":H=F=E=D=0;
break;case"top-right":H=G.width;F=D=0;E=-G.width;break;case"bottom-left":H=E=0;F=G.height;
D=-G.height;break;case"bottom-right":H=G.width;F=G.height;E=-G.width;D=-G.height;
break;case"center":H=G.width/2;F=G.height/2;E=-G.width/2;D=-G.height/2;break}return new Effect.Move(C,{x:H,y:F,duration:0.01,beforeSetup:function(I){I.element.hide().makeClipping().makePositioned()
},afterFinishInternal:function(I){new Effect.Parallel([new Effect.Opacity(I.element,{sync:true,to:1,from:0,transition:B.opacityTransition}),new Effect.Move(I.element,{x:E,y:D,sync:true,transition:B.moveTransition}),new Effect.Scale(I.element,100,{scaleMode:{originalHeight:G.height,originalWidth:G.width},sync:true,scaleFrom:window.opera?1:0,transition:B.scaleTransition,restoreAfterFinish:true})],Object.extend({beforeSetup:function(J){J.effects[0].element.setStyle({height:"0px"}).show()
},afterFinishInternal:function(J){J.effects[0].element.undoClipping().undoPositioned().setStyle(A)
}},B))}})};Effect.Shrink=function(C){C=$(C);var B=Object.extend({direction:"center",moveTransition:Effect.Transitions.sinoidal,scaleTransition:Effect.Transitions.sinoidal,opacityTransition:Effect.Transitions.none},arguments[1]||{});
var A={top:C.style.top,left:C.style.left,height:C.style.height,width:C.style.width,opacity:C.getInlineOpacity()};
var F=C.getDimensions();var E,D;switch(B.direction){case"top-left":E=D=0;break;case"top-right":E=F.width;
D=0;break;case"bottom-left":E=0;D=F.height;break;case"bottom-right":E=F.width;D=F.height;
break;case"center":E=F.width/2;D=F.height/2;break}return new Effect.Parallel([new Effect.Opacity(C,{sync:true,to:0,from:1,transition:B.opacityTransition}),new Effect.Scale(C,window.opera?1:0,{sync:true,transition:B.scaleTransition,restoreAfterFinish:true}),new Effect.Move(C,{x:E,y:D,sync:true,transition:B.moveTransition})],Object.extend({beforeStartInternal:function(G){G.effects[0].element.makePositioned().makeClipping()
},afterFinishInternal:function(G){G.effects[0].element.hide().undoClipping().undoPositioned().setStyle(A)
}},B))};Effect.Pulsate=function(C){C=$(C);var B=arguments[1]||{};var A=C.getInlineOpacity();
var E=B.transition||Effect.Transitions.sinoidal;var D=function(F){return E(1-Effect.Transitions.pulse(F,B.pulses))
};D.bind(E);return new Effect.Opacity(C,Object.extend(Object.extend({duration:2,from:0,afterFinishInternal:function(F){F.element.setStyle({opacity:A})
}},B),{transition:D}))};Effect.Fold=function(B){B=$(B);var A={top:B.style.top,left:B.style.left,width:B.style.width,height:B.style.height};
B.makeClipping();return new Effect.Scale(B,5,Object.extend({scaleContent:false,scaleX:false,afterFinishInternal:function(C){new Effect.Scale(B,1,{scaleContent:false,scaleY:false,afterFinishInternal:function(D){D.element.hide().undoClipping().setStyle(A)
}})}},arguments[1]||{}))};Effect.Morph=Class.create(Effect.Base,{initialize:function(C){this.element=$(C);
if(!this.element){throw (Effect._elementDoesNotExistError)}var A=Object.extend({style:{}},arguments[1]||{});
if(!Object.isString(A.style)){this.style=$H(A.style)}else{if(A.style.include(":")){this.style=A.style.parseStyle()
}else{this.element.addClassName(A.style);this.style=$H(this.element.getStyles());
this.element.removeClassName(A.style);var B=this.element.getStyles();this.style=this.style.reject(function(D){return D.value==B[D.key]
});A.afterFinishInternal=function(D){D.element.addClassName(D.options.style);D.transforms.each(function(E){D.element.style[E.style]=""
})}}}this.start(A)},setup:function(){function A(B){if(!B||["rgba(0, 0, 0, 0)","transparent"].include(B)){B="#ffffff"
}B=B.parseColor();return $R(0,2).map(function(C){return parseInt(B.slice(C*2+1,C*2+3),16)
})}this.transforms=this.style.map(function(G){var F=G[0],E=G[1],D=null;if(E.parseColor("#zzzzzz")!="#zzzzzz"){E=E.parseColor();
D="color"}else{if(F=="opacity"){E=parseFloat(E);if(Prototype.Browser.IE&&(!this.element.currentStyle.hasLayout)){this.element.setStyle({zoom:1})
}}else{if(Element.CSS_LENGTH.test(E)){var C=E.match(/^([\+\-]?[0-9\.]+)(.*)$/);E=parseFloat(C[1]);
D=(C.length==3)?C[2]:null}}}var B=this.element.getStyle(F);return{style:F.camelize(),originalValue:D=="color"?A(B):parseFloat(B||0),targetValue:D=="color"?A(E):E,unit:D}
}.bind(this)).reject(function(B){return((B.originalValue==B.targetValue)||(B.unit!="color"&&(isNaN(B.originalValue)||isNaN(B.targetValue))))
})},update:function(A){var D={},B,C=this.transforms.length;while(C--){D[(B=this.transforms[C]).style]=B.unit=="color"?"#"+(Math.round(B.originalValue[0]+(B.targetValue[0]-B.originalValue[0])*A)).toColorPart()+(Math.round(B.originalValue[1]+(B.targetValue[1]-B.originalValue[1])*A)).toColorPart()+(Math.round(B.originalValue[2]+(B.targetValue[2]-B.originalValue[2])*A)).toColorPart():(B.originalValue+(B.targetValue-B.originalValue)*A).toFixed(3)+(B.unit===null?"":B.unit)
}this.element.setStyle(D,true)}});Effect.Transform=Class.create({initialize:function(A){this.tracks=[];
this.options=arguments[1]||{};this.addTracks(A)},addTracks:function(A){A.each(function(B){B=$H(B);
var C=B.values().first();this.tracks.push($H({ids:B.keys().first(),effect:Effect.Morph,options:{style:C}}))
}.bind(this));return this},play:function(){return new Effect.Parallel(this.tracks.map(function(A){var D=A.get("ids"),C=A.get("effect"),B=A.get("options");
var E=[$(D)||$$(D)].flatten();return E.map(function(F){return new C(F,Object.extend({sync:true},B))
})}).flatten(),this.options)}});Element.CSS_PROPERTIES=$w("backgroundColor backgroundPosition borderBottomColor borderBottomStyle borderBottomWidth borderLeftColor borderLeftStyle borderLeftWidth borderRightColor borderRightStyle borderRightWidth borderSpacing borderTopColor borderTopStyle borderTopWidth bottom clip color fontSize fontWeight height left letterSpacing lineHeight marginBottom marginLeft marginRight marginTop markerOffset maxHeight maxWidth minHeight minWidth opacity outlineColor outlineOffset outlineWidth paddingBottom paddingLeft paddingRight paddingTop right textIndent top width wordSpacing zIndex");
Element.CSS_LENGTH=/^(([\+\-]?[0-9\.]+)(em|ex|px|in|cm|mm|pt|pc|\%))|0$/;String.__parseStyleElement=document.createElement("div");
String.prototype.parseStyle=function(){var B,A=$H();if(Prototype.Browser.WebKit){B=new Element("div",{style:this}).style
}else{String.__parseStyleElement.innerHTML='<div style="'+this+'"></div>';B=String.__parseStyleElement.childNodes[0].style
}Element.CSS_PROPERTIES.each(function(C){if(B[C]){A.set(C,B[C])}});if(Prototype.Browser.IE&&this.include("opacity")){A.set("opacity",this.match(/opacity:\s*((?:0|1)?(?:\.\d*)?)/)[1])
}return A};if(document.defaultView&&document.defaultView.getComputedStyle){Element.getStyles=function(B){var A=document.defaultView.getComputedStyle($(B),null);
return Element.CSS_PROPERTIES.inject({},function(C,D){C[D]=A[D];return C})}}else{Element.getStyles=function(B){B=$(B);
var A=B.currentStyle,C;C=Element.CSS_PROPERTIES.inject({},function(D,E){D[E]=A[E];
return D});if(!C.opacity){C.opacity=B.getOpacity()}return C}}Effect.Methods={morph:function(A,B){A=$(A);
new Effect.Morph(A,Object.extend({style:B},arguments[2]||{}));return A},visualEffect:function(C,E,B){C=$(C);
var D=E.dasherize().camelize(),A=D.charAt(0).toUpperCase()+D.substring(1);new Effect[A](C,B);
return C},highlight:function(B,A){B=$(B);new Effect.Highlight(B,A);return B}};$w("fade appear grow shrink fold blindUp blindDown slideUp slideDown pulsate shake puff squish switchOff dropOut").each(function(A){Effect.Methods[A]=function(C,B){C=$(C);
Effect[A.charAt(0).toUpperCase()+A.substring(1)](C,B);return C}});$w("getInlineOpacity forceRerendering setContentZoom collectTextNodes collectTextNodesIgnoreClass getStyles").each(function(A){Effect.Methods[A]=Element[A]
});Element.addMethods(Effect.Methods);if(typeof Effect=="undefined"){throw ("controls.js requires including script.aculo.us' effects.js library")
}var Autocompleter={};Autocompleter.Base=Class.create({baseInitialize:function(B,C,A){B=$(B);
this.element=B;this.update=$(C);this.hasFocus=false;this.changed=false;this.active=false;
this.index=0;this.entryCount=0;this.oldElementValue=this.element.value;if(this.setOptions){this.setOptions(A)
}else{this.options=A||{}}this.options.paramName=this.options.paramName||this.element.name;
this.options.tokens=this.options.tokens||[];this.options.frequency=this.options.frequency||0.4;
this.options.minChars=this.options.minChars||1;this.options.onShow=this.options.onShow||function(D,E){if(!E.style.position||E.style.position=="absolute"){E.style.position="absolute";
Position.clone(D,E,{setHeight:false,offsetTop:D.offsetHeight})}Effect.Appear(E,{duration:0.15})
};this.options.onHide=this.options.onHide||function(D,E){new Effect.Fade(E,{duration:0.15})
};if(typeof (this.options.tokens)=="string"){this.options.tokens=new Array(this.options.tokens)
}if(!this.options.tokens.include("\n")){this.options.tokens.push("\n")}this.observer=null;
this.element.setAttribute("autocomplete","off");Element.hide(this.update);Event.observe(this.element,"blur",this.onBlur.bindAsEventListener(this));
Event.observe(this.element,"keydown",this.onKeyPress.bindAsEventListener(this))},show:function(){if(Element.getStyle(this.update,"display")=="none"){this.options.onShow(this.element,this.update)
}if(!this.iefix&&(Prototype.Browser.IE)&&(Element.getStyle(this.update,"position")=="absolute")){new Insertion.After(this.update,'<iframe id="'+this.update.id+'_iefix" style="display:none;position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);" src="javascript:false;" frameborder="0" scrolling="no"></iframe>');
this.iefix=$(this.update.id+"_iefix")}if(this.iefix){setTimeout(this.fixIEOverlapping.bind(this),50)
}},fixIEOverlapping:function(){Position.clone(this.update,this.iefix,{setTop:(!this.update.style.height)});
this.iefix.style.zIndex=1;this.update.style.zIndex=2;Element.show(this.iefix)},hide:function(){this.stopIndicator();
if(Element.getStyle(this.update,"display")!="none"){this.options.onHide(this.element,this.update)
}if(this.iefix){Element.hide(this.iefix)}},startIndicator:function(){if(this.options.indicator){Element.show(this.options.indicator)
}},stopIndicator:function(){if(this.options.indicator){Element.hide(this.options.indicator)
}},onKeyPress:function(A){if(this.active){switch(A.keyCode){case Event.KEY_TAB:case Event.KEY_RETURN:this.selectEntry();
Event.stop(A);case Event.KEY_ESC:this.hide();this.active=false;Event.stop(A);return ;
case Event.KEY_LEFT:case Event.KEY_RIGHT:return ;case Event.KEY_UP:this.markPrevious();
this.render();Event.stop(A);return ;case Event.KEY_DOWN:this.markNext();this.render();
Event.stop(A);return }}else{if(A.keyCode==Event.KEY_TAB||A.keyCode==Event.KEY_RETURN||(Prototype.Browser.WebKit>0&&A.keyCode==0)){return 
}}this.changed=true;this.hasFocus=true;if(this.observer){clearTimeout(this.observer)
}this.observer=setTimeout(this.onObserverEvent.bind(this),this.options.frequency*1000)
},activate:function(){this.changed=false;this.hasFocus=true;this.getUpdatedChoices()
},onHover:function(B){var A=Event.findElement(B,"LI");if(this.index!=A.autocompleteIndex){this.index=A.autocompleteIndex;
this.render()}Event.stop(B)},onClick:function(B){var A=Event.findElement(B,"LI");
this.index=A.autocompleteIndex;this.selectEntry();this.hide()},onBlur:function(A){setTimeout(this.hide.bind(this),250);
this.hasFocus=false;this.active=false},render:function(){if(this.entryCount>0){for(var A=0;
A<this.entryCount;A++){this.index==A?Element.addClassName(this.getEntry(A),"selected"):Element.removeClassName(this.getEntry(A),"selected")
}if(this.hasFocus){this.show();this.active=true}}else{this.active=false;this.hide()
}},markPrevious:function(){if(this.index>0){this.index--}else{this.index=this.entryCount-1
}this.getEntry(this.index).scrollIntoView(true)},markNext:function(){if(this.index<this.entryCount-1){this.index++
}else{this.index=0}this.getEntry(this.index).scrollIntoView(false)},getEntry:function(A){return this.update.firstChild.childNodes[A]
},getCurrentEntry:function(){return this.getEntry(this.index)},selectEntry:function(){this.active=false;
this.updateElement(this.getCurrentEntry())},updateElement:function(F){if(this.options.updateElement){this.options.updateElement(F);
return }var D="";if(this.options.select){var A=$(F).select("."+this.options.select)||[];
if(A.length>0){D=Element.collectTextNodes(A[0],this.options.select)}}else{D=Element.collectTextNodesIgnoreClass(F,"informal")
}var C=this.getTokenBounds();if(C[0]!=-1){var E=this.element.value.substr(0,C[0]);
var B=this.element.value.substr(C[0]).match(/^\s+/);if(B){E+=B[0]}this.element.value=E+D+this.element.value.substr(C[1])
}else{this.element.value=D}this.oldElementValue=this.element.value;this.element.focus();
if(this.options.afterUpdateElement){this.options.afterUpdateElement(this.element,F)
}},updateChoices:function(C){if(!this.changed&&this.hasFocus){this.update.innerHTML=C;
Element.cleanWhitespace(this.update);Element.cleanWhitespace(this.update.down());
if(this.update.firstChild&&this.update.down().childNodes){this.entryCount=this.update.down().childNodes.length;
for(var A=0;A<this.entryCount;A++){var B=this.getEntry(A);B.autocompleteIndex=A;this.addObservers(B)
}}else{this.entryCount=0}this.stopIndicator();this.index=0;if(this.entryCount==1&&this.options.autoSelect){this.selectEntry();
this.hide()}else{this.render()}}},addObservers:function(A){Event.observe(A,"mouseover",this.onHover.bindAsEventListener(this));
Event.observe(A,"click",this.onClick.bindAsEventListener(this))},onObserverEvent:function(){this.changed=false;
this.tokenBounds=null;if(this.getToken().length>=this.options.minChars){this.getUpdatedChoices()
}else{this.active=false;this.hide()}this.oldElementValue=this.element.value},getToken:function(){var A=this.getTokenBounds();
return this.element.value.substring(A[0],A[1]).strip()},getTokenBounds:function(){if(null!=this.tokenBounds){return this.tokenBounds
}var E=this.element.value;if(E.strip().empty()){return[-1,0]}var F=arguments.callee.getFirstDifferencePos(E,this.oldElementValue);
var H=(F==this.oldElementValue.length?1:0);var D=-1,C=E.length;var G;for(var B=0,A=this.options.tokens.length;
B<A;++B){G=E.lastIndexOf(this.options.tokens[B],F+H-1);if(G>D){D=G}G=E.indexOf(this.options.tokens[B],F+H);
if(-1!=G&&G<C){C=G}}return(this.tokenBounds=[D+1,C])}});Autocompleter.Base.prototype.getTokenBounds.getFirstDifferencePos=function(C,A){var D=Math.min(C.length,A.length);
for(var B=0;B<D;++B){if(C[B]!=A[B]){return B}}return D};Ajax.Autocompleter=Class.create(Autocompleter.Base,{initialize:function(C,D,B,A){this.baseInitialize(C,D,A);
this.options.asynchronous=true;this.options.onComplete=this.onComplete.bind(this);
this.options.defaultParams=this.options.parameters||null;this.url=B},getUpdatedChoices:function(){this.startIndicator();
var A=encodeURIComponent(this.options.paramName)+"="+encodeURIComponent(this.getToken());
this.options.parameters=this.options.callback?this.options.callback(this.element,A):A;
if(this.options.defaultParams){this.options.parameters+="&"+this.options.defaultParams
}new Ajax.Request(this.url,this.options)},onComplete:function(A){this.updateChoices(A.responseText)
}});Autocompleter.Local=Class.create(Autocompleter.Base,{initialize:function(B,D,C,A){this.baseInitialize(B,D,A);
this.options.array=C},getUpdatedChoices:function(){this.updateChoices(this.options.selector(this))
},setOptions:function(A){this.options=Object.extend({choices:10,partialSearch:true,partialChars:2,ignoreCase:true,fullSearch:false,selector:function(B){var D=[];
var C=[];var H=B.getToken();var G=0;for(var E=0;E<B.options.array.length&&D.length<B.options.choices;
E++){var F=B.options.array[E];var I=B.options.ignoreCase?F.toLowerCase().indexOf(H.toLowerCase()):F.indexOf(H);
while(I!=-1){if(I==0&&F.length!=H.length){D.push("<li><strong>"+F.substr(0,H.length)+"</strong>"+F.substr(H.length)+"</li>");
break}else{if(H.length>=B.options.partialChars&&B.options.partialSearch&&I!=-1){if(B.options.fullSearch||/\s/.test(F.substr(I-1,1))){C.push("<li>"+F.substr(0,I)+"<strong>"+F.substr(I,H.length)+"</strong>"+F.substr(I+H.length)+"</li>");
break}}}I=B.options.ignoreCase?F.toLowerCase().indexOf(H.toLowerCase(),I+1):F.indexOf(H,I+1)
}}if(C.length){D=D.concat(C.slice(0,B.options.choices-D.length))}return"<ul>"+D.join("")+"</ul>"
}},A||{})}});Field.scrollFreeActivate=function(A){setTimeout(function(){Field.activate(A)
},1)};Ajax.InPlaceEditor=Class.create({initialize:function(C,B,A){this.url=B;this.element=C=$(C);
this.prepareOptions();this._controls={};arguments.callee.dealWithDeprecatedOptions(A);
Object.extend(this.options,A||{});if(!this.options.formId&&this.element.id){this.options.formId=this.element.id+"-inplaceeditor";
if($(this.options.formId)){this.options.formId=""}}if(this.options.externalControl){this.options.externalControl=$(this.options.externalControl)
}if(!this.options.externalControl){this.options.externalControlOnly=false}this._originalBackground=this.element.getStyle("background-color")||"transparent";
this.element.title=this.options.clickToEditText;this._boundCancelHandler=this.handleFormCancellation.bind(this);
this._boundComplete=(this.options.onComplete||Prototype.emptyFunction).bind(this);
this._boundFailureHandler=this.handleAJAXFailure.bind(this);this._boundSubmitHandler=this.handleFormSubmission.bind(this);
this._boundWrapperHandler=this.wrapUp.bind(this);this.registerListeners()},checkForEscapeOrReturn:function(A){if(!this._editing||A.ctrlKey||A.altKey||A.shiftKey){return 
}if(Event.KEY_ESC==A.keyCode){this.handleFormCancellation(A)}else{if(Event.KEY_RETURN==A.keyCode){this.handleFormSubmission(A)
}}},createControl:function(G,C,B){var E=this.options[G+"Control"];var F=this.options[G+"Text"];
if("button"==E){var A=document.createElement("input");A.type="submit";A.value=F;A.className="editor_"+G+"_button";
if("cancel"==G){A.onclick=this._boundCancelHandler}this._form.appendChild(A);this._controls[G]=A
}else{if("link"==E){var D=document.createElement("a");D.href="#";D.appendChild(document.createTextNode(F));
D.onclick="cancel"==G?this._boundCancelHandler:this._boundSubmitHandler;D.className="editor_"+G+"_link";
if(B){D.className+=" "+B}this._form.appendChild(D);this._controls[G]=D}}},createEditField:function(){var C=(this.options.loadTextURL?this.options.loadingText:this.getText());
var B;if(1>=this.options.rows&&!/\r|\n/.test(this.getText())){B=document.createElement("input");
B.type="text";var A=this.options.size||this.options.cols||0;if(0<A){B.size=A}}else{B=document.createElement("textarea");
B.rows=(1>=this.options.rows?this.options.autoRows:this.options.rows);B.cols=this.options.cols||40
}B.name=this.options.paramName;B.value=C;B.className="editor_field";if(this.options.submitOnBlur){B.onblur=this._boundSubmitHandler
}this._controls.editor=B;if(this.options.loadTextURL){this.loadExternalText()}this._form.appendChild(this._controls.editor)
},createForm:function(){var B=this;function A(D,E){var C=B.options["text"+D+"Controls"];
if(!C||E===false){return }B._form.appendChild(document.createTextNode(C))}this._form=$(document.createElement("form"));
this._form.id=this.options.formId;this._form.addClassName(this.options.formClassName);
this._form.onsubmit=this._boundSubmitHandler;this.createEditField();if("textarea"==this._controls.editor.tagName.toLowerCase()){this._form.appendChild(document.createElement("br"))
}if(this.options.onFormCustomization){this.options.onFormCustomization(this,this._form)
}A("Before",this.options.okControl||this.options.cancelControl);this.createControl("ok",this._boundSubmitHandler);
A("Between",this.options.okControl&&this.options.cancelControl);this.createControl("cancel",this._boundCancelHandler,"editor_cancel");
A("After",this.options.okControl||this.options.cancelControl)},destroy:function(){if(this._oldInnerHTML){this.element.innerHTML=this._oldInnerHTML
}this.leaveEditMode();this.unregisterListeners()},enterEditMode:function(A){if(this._saving||this._editing){return 
}this._editing=true;this.triggerCallback("onEnterEditMode");if(this.options.externalControl){this.options.externalControl.hide()
}this.element.hide();this.createForm();this.element.parentNode.insertBefore(this._form,this.element);
if(!this.options.loadTextURL){this.postProcessEditField()}if(A){Event.stop(A)}},enterHover:function(A){if(this.options.hoverClassName){this.element.addClassName(this.options.hoverClassName)
}if(this._saving){return }this.triggerCallback("onEnterHover")},getText:function(){return this.element.innerHTML
},handleAJAXFailure:function(A){this.triggerCallback("onFailure",A);if(this._oldInnerHTML){this.element.innerHTML=this._oldInnerHTML;
this._oldInnerHTML=null}},handleFormCancellation:function(A){this.wrapUp();if(A){Event.stop(A)
}},handleFormSubmission:function(D){var B=this._form;var C=$F(this._controls.editor);
this.prepareSubmission();var E=this.options.callback(B,C)||"";if(Object.isString(E)){E=E.toQueryParams()
}E.editorId=this.element.id;if(this.options.htmlResponse){var A=Object.extend({evalScripts:true},this.options.ajaxOptions);
Object.extend(A,{parameters:E,onComplete:this._boundWrapperHandler,onFailure:this._boundFailureHandler});
new Ajax.Updater({success:this.element},this.url,A)}else{var A=Object.extend({method:"get"},this.options.ajaxOptions);
Object.extend(A,{parameters:E,onComplete:this._boundWrapperHandler,onFailure:this._boundFailureHandler});
new Ajax.Request(this.url,A)}if(D){Event.stop(D)}},leaveEditMode:function(){this.element.removeClassName(this.options.savingClassName);
this.removeForm();this.leaveHover();this.element.style.backgroundColor=this._originalBackground;
this.element.show();if(this.options.externalControl){this.options.externalControl.show()
}this._saving=false;this._editing=false;this._oldInnerHTML=null;this.triggerCallback("onLeaveEditMode")
},leaveHover:function(A){if(this.options.hoverClassName){this.element.removeClassName(this.options.hoverClassName)
}if(this._saving){return }this.triggerCallback("onLeaveHover")},loadExternalText:function(){this._form.addClassName(this.options.loadingClassName);
this._controls.editor.disabled=true;var A=Object.extend({method:"get"},this.options.ajaxOptions);
Object.extend(A,{parameters:"editorId="+encodeURIComponent(this.element.id),onComplete:Prototype.emptyFunction,onSuccess:function(C){this._form.removeClassName(this.options.loadingClassName);
var B=C.responseText;if(this.options.stripLoadedTextTags){B=B.stripTags()}this._controls.editor.value=B;
this._controls.editor.disabled=false;this.postProcessEditField()}.bind(this),onFailure:this._boundFailureHandler});
new Ajax.Request(this.options.loadTextURL,A)},postProcessEditField:function(){var A=this.options.fieldPostCreation;
if(A){$(this._controls.editor)["focus"==A?"focus":"activate"]()}},prepareOptions:function(){this.options=Object.clone(Ajax.InPlaceEditor.DefaultOptions);
Object.extend(this.options,Ajax.InPlaceEditor.DefaultCallbacks);[this._extraDefaultOptions].flatten().compact().each(function(A){Object.extend(this.options,A)
}.bind(this))},prepareSubmission:function(){this._saving=true;this.removeForm();this.leaveHover();
this.showSaving()},registerListeners:function(){this._listeners={};var A;$H(Ajax.InPlaceEditor.Listeners).each(function(B){A=this[B.value].bind(this);
this._listeners[B.key]=A;if(!this.options.externalControlOnly){this.element.observe(B.key,A)
}if(this.options.externalControl){this.options.externalControl.observe(B.key,A)}}.bind(this))
},removeForm:function(){if(!this._form){return }this._form.remove();this._form=null;
this._controls={}},showSaving:function(){this._oldInnerHTML=this.element.innerHTML;
this.element.innerHTML=this.options.savingText;this.element.addClassName(this.options.savingClassName);
this.element.style.backgroundColor=this._originalBackground;this.element.show()},triggerCallback:function(B,A){if("function"==typeof this.options[B]){this.options[B](this,A)
}},unregisterListeners:function(){$H(this._listeners).each(function(A){if(!this.options.externalControlOnly){this.element.stopObserving(A.key,A.value)
}if(this.options.externalControl){this.options.externalControl.stopObserving(A.key,A.value)
}}.bind(this))},wrapUp:function(A){this.leaveEditMode();this._boundComplete(A,this.element)
}});Object.extend(Ajax.InPlaceEditor.prototype,{dispose:Ajax.InPlaceEditor.prototype.destroy});
Ajax.InPlaceCollectionEditor=Class.create(Ajax.InPlaceEditor,{initialize:function($super,C,B,A){this._extraDefaultOptions=Ajax.InPlaceCollectionEditor.DefaultOptions;
$super(C,B,A)},createEditField:function(){var A=document.createElement("select");
A.name=this.options.paramName;A.size=1;this._controls.editor=A;this._collection=this.options.collection||[];
if(this.options.loadCollectionURL){this.loadCollection()}else{this.checkForExternalText()
}this._form.appendChild(this._controls.editor)},loadCollection:function(){this._form.addClassName(this.options.loadingClassName);
this.showLoadingText(this.options.loadingCollectionText);var options=Object.extend({method:"get"},this.options.ajaxOptions);
Object.extend(options,{parameters:"editorId="+encodeURIComponent(this.element.id),onComplete:Prototype.emptyFunction,onSuccess:function(transport){var js=transport.responseText.strip();
if(!/^\[.*\]$/.test(js)){throw"Server returned an invalid collection representation."
}this._collection=eval(js);this.checkForExternalText()}.bind(this),onFailure:this.onFailure});
new Ajax.Request(this.options.loadCollectionURL,options)},showLoadingText:function(B){this._controls.editor.disabled=true;
var A=this._controls.editor.firstChild;if(!A){A=document.createElement("option");
A.value="";this._controls.editor.appendChild(A);A.selected=true}A.update((B||"").stripScripts().stripTags())
},checkForExternalText:function(){this._text=this.getText();if(this.options.loadTextURL){this.loadExternalText()
}else{this.buildOptionList()}},loadExternalText:function(){this.showLoadingText(this.options.loadingText);
var A=Object.extend({method:"get"},this.options.ajaxOptions);Object.extend(A,{parameters:"editorId="+encodeURIComponent(this.element.id),onComplete:Prototype.emptyFunction,onSuccess:function(B){this._text=B.responseText.strip();
this.buildOptionList()}.bind(this),onFailure:this.onFailure});new Ajax.Request(this.options.loadTextURL,A)
},buildOptionList:function(){this._form.removeClassName(this.options.loadingClassName);
this._collection=this._collection.map(function(D){return 2===D.length?D:[D,D].flatten()
});var B=("value" in this.options)?this.options.value:this._text;var A=this._collection.any(function(D){return D[0]==B
}.bind(this));this._controls.editor.update("");var C;this._collection.each(function(E,D){C=document.createElement("option");
C.value=E[0];C.selected=A?E[0]==B:0==D;C.appendChild(document.createTextNode(E[1]));
this._controls.editor.appendChild(C)}.bind(this));this._controls.editor.disabled=false;
Field.scrollFreeActivate(this._controls.editor)}});Ajax.InPlaceEditor.prototype.initialize.dealWithDeprecatedOptions=function(A){if(!A){return 
}function B(C,D){if(C in A||D===undefined){return }A[C]=D}B("cancelControl",(A.cancelLink?"link":(A.cancelButton?"button":A.cancelLink==A.cancelButton==false?false:undefined)));
B("okControl",(A.okLink?"link":(A.okButton?"button":A.okLink==A.okButton==false?false:undefined)));
B("highlightColor",A.highlightcolor);B("highlightEndColor",A.highlightendcolor)};
Object.extend(Ajax.InPlaceEditor,{DefaultOptions:{ajaxOptions:{},autoRows:3,cancelControl:"link",cancelText:"cancel",clickToEditText:"Click to edit",externalControl:null,externalControlOnly:false,fieldPostCreation:"activate",formClassName:"inplaceeditor-form",formId:null,highlightColor:"#ffff99",highlightEndColor:"#ffffff",hoverClassName:"",htmlResponse:true,loadingClassName:"inplaceeditor-loading",loadingText:"Loading...",okControl:"button",okText:"ok",paramName:"value",rows:1,savingClassName:"inplaceeditor-saving",savingText:"Saving...",size:0,stripLoadedTextTags:false,submitOnBlur:false,textAfterControls:"",textBeforeControls:"",textBetweenControls:""},DefaultCallbacks:{callback:function(A){return Form.serialize(A)
},onComplete:function(B,A){new Effect.Highlight(A,{startcolor:this.options.highlightColor,keepBackgroundImage:true})
},onEnterEditMode:null,onEnterHover:function(A){A.element.style.backgroundColor=A.options.highlightColor;
if(A._effect){A._effect.cancel()}},onFailure:function(B,A){alert("Error communication with the server: "+B.responseText.stripTags())
},onFormCustomization:null,onLeaveEditMode:null,onLeaveHover:function(A){A._effect=new Effect.Highlight(A.element,{startcolor:A.options.highlightColor,endcolor:A.options.highlightEndColor,restorecolor:A._originalBackground,keepBackgroundImage:true})
}},Listeners:{click:"enterEditMode",keydown:"checkForEscapeOrReturn",mouseover:"enterHover",mouseout:"leaveHover"}});
Ajax.InPlaceCollectionEditor.DefaultOptions={loadingCollectionText:"Loading options..."};
Form.Element.DelayedObserver=Class.create({initialize:function(B,A,C){this.delay=A||0.5;
this.element=$(B);this.callback=C;this.timer=null;this.lastValue=$F(this.element);
Event.observe(this.element,"keyup",this.delayedListener.bindAsEventListener(this))
},delayedListener:function(A){if(this.lastValue==$F(this.element)){return }if(this.timer){clearTimeout(this.timer)
}this.timer=setTimeout(this.onTimerEvent.bind(this),this.delay*1000);this.lastValue=$F(this.element)
},onTimerEvent:function(){this.timer=null;this.callback(this.element,$F(this.element))
}});if(Object.isUndefined(Effect)){throw ("dragdrop.js requires including script.aculo.us' effects.js library")
}var Droppables={drops:[],remove:function(A){this.drops=this.drops.reject(function(B){return B.element==$(A)
})},add:function(B){B=$(B);var A=Object.extend({greedy:true,hoverclass:null,tree:false},arguments[1]||{});
if(A.containment){A._containers=[];var C=A.containment;if(Object.isArray(C)){C.each(function(D){A._containers.push($(D))
})}else{A._containers.push($(C))}}if(A.accept){A.accept=[A.accept].flatten()}Element.makePositioned(B);
A.element=B;this.drops.push(A)},findDeepestChild:function(A){deepest=A[0];for(i=1;
i<A.length;++i){if(Element.isParent(A[i].element,deepest.element)){deepest=A[i]}}return deepest
},isContained:function(B,A){var C;if(A.tree){C=B.treeNode}else{C=B.parentNode}return A._containers.detect(function(D){return C==D
})},isAffected:function(A,C,B){return((B.element!=C)&&((!B._containers)||this.isContained(C,B))&&((!B.accept)||(Element.classNames(C).detect(function(D){return B.accept.include(D)
})))&&Position.within(B.element,A[0],A[1]))},deactivate:function(A){if(A.hoverclass){Element.removeClassName(A.element,A.hoverclass)
}this.last_active=null},activate:function(A){if(A.hoverclass){Element.addClassName(A.element,A.hoverclass)
}this.last_active=A},show:function(A,C){if(!this.drops.length){return }var B,D=[];
this.drops.each(function(E){if(Droppables.isAffected(A,C,E)){D.push(E)}});if(D.length>0){B=Droppables.findDeepestChild(D)
}if(this.last_active&&this.last_active!=B){this.deactivate(this.last_active)}if(B){Position.within(B.element,A[0],A[1]);
if(B.onHover){B.onHover(C,B.element,Position.overlap(B.overlap,B.element))}if(B!=this.last_active){Droppables.activate(B)
}}},fire:function(B,A){if(!this.last_active){return }Position.prepare();if(this.isAffected([Event.pointerX(B),Event.pointerY(B)],A,this.last_active)){if(this.last_active.onDrop){this.last_active.onDrop(A,this.last_active.element,B);
return true}}},reset:function(){if(this.last_active){this.deactivate(this.last_active)
}}};var Draggables={drags:[],observers:[],register:function(A){if(this.drags.length==0){this.eventMouseUp=this.endDrag.bindAsEventListener(this);
this.eventMouseMove=this.updateDrag.bindAsEventListener(this);this.eventKeypress=this.keyPress.bindAsEventListener(this);
Event.observe(document,"mouseup",this.eventMouseUp);Event.observe(document,"mousemove",this.eventMouseMove);
Event.observe(document,"keypress",this.eventKeypress)}this.drags.push(A)},unregister:function(A){this.drags=this.drags.reject(function(B){return B==A
});if(this.drags.length==0){Event.stopObserving(document,"mouseup",this.eventMouseUp);
Event.stopObserving(document,"mousemove",this.eventMouseMove);Event.stopObserving(document,"keypress",this.eventKeypress)
}},activate:function(A){if(A.options.delay){this._timeout=setTimeout(function(){Draggables._timeout=null;
window.focus();Draggables.activeDraggable=A}.bind(this),A.options.delay)}else{window.focus();
this.activeDraggable=A}},deactivate:function(){this.activeDraggable=null},updateDrag:function(A){if(!this.activeDraggable){return 
}var B=[Event.pointerX(A),Event.pointerY(A)];if(this._lastPointer&&(this._lastPointer.inspect()==B.inspect())){return 
}this._lastPointer=B;this.activeDraggable.updateDrag(A,B)},endDrag:function(A){if(this._timeout){clearTimeout(this._timeout);
this._timeout=null}if(!this.activeDraggable){return }this._lastPointer=null;this.activeDraggable.endDrag(A);
this.activeDraggable=null},keyPress:function(A){if(this.activeDraggable){this.activeDraggable.keyPress(A)
}},addObserver:function(A){this.observers.push(A);this._cacheObserverCallbacks()},removeObserver:function(A){this.observers=this.observers.reject(function(B){return B.element==A
});this._cacheObserverCallbacks()},notify:function(B,A,C){if(this[B+"Count"]>0){this.observers.each(function(D){if(D[B]){D[B](B,A,C)
}})}if(A.options[B]){A.options[B](A,C)}},_cacheObserverCallbacks:function(){["onStart","onEnd","onDrag"].each(function(A){Draggables[A+"Count"]=Draggables.observers.select(function(B){return B[A]
}).length})}};var Draggable=Class.create({initialize:function(B){var C={handle:false,reverteffect:function(F,E,D){var G=Math.sqrt(Math.abs(E^2)+Math.abs(D^2))*0.02;
new Effect.Move(F,{x:-D,y:-E,duration:G,queue:{scope:"_draggable",position:"end"}})
},endeffect:function(E){var D=Object.isNumber(E._opacity)?E._opacity:1;new Effect.Opacity(E,{duration:0.2,from:0.7,to:D,queue:{scope:"_draggable",position:"end"},afterFinish:function(){Draggable._dragging[E]=false
}})},zindex:1000,revert:false,quiet:false,scroll:false,scrollSensitivity:20,scrollSpeed:15,snap:false,delay:0};
if(!arguments[1]||Object.isUndefined(arguments[1].endeffect)){Object.extend(C,{starteffect:function(D){D._opacity=Element.getOpacity(D);
Draggable._dragging[D]=true;new Effect.Opacity(D,{duration:0.2,from:D._opacity,to:0.7})
}})}var A=Object.extend(C,arguments[1]||{});this.element=$(B);if(A.handle&&Object.isString(A.handle)){this.handle=this.element.down("."+A.handle,0)
}if(!this.handle){this.handle=$(A.handle)}if(!this.handle){this.handle=this.element
}if(A.scroll&&!A.scroll.scrollTo&&!A.scroll.outerHTML){A.scroll=$(A.scroll);this._isScrollChild=Element.childOf(this.element,A.scroll)
}Element.makePositioned(this.element);this.options=A;this.dragging=false;this.eventMouseDown=this.initDrag.bindAsEventListener(this);
Event.observe(this.handle,"mousedown",this.eventMouseDown);Draggables.register(this)
},destroy:function(){Event.stopObserving(this.handle,"mousedown",this.eventMouseDown);
Draggables.unregister(this)},currentDelta:function(){return([parseInt(Element.getStyle(this.element,"left")||"0"),parseInt(Element.getStyle(this.element,"top")||"0")])
},initDrag:function(A){if(!Object.isUndefined(Draggable._dragging[this.element])&&Draggable._dragging[this.element]){return 
}if(Event.isLeftClick(A)){var C=Event.element(A);if((tag_name=C.tagName.toUpperCase())&&(tag_name=="INPUT"||tag_name=="SELECT"||tag_name=="OPTION"||tag_name=="BUTTON"||tag_name=="TEXTAREA")){return 
}var B=[Event.pointerX(A),Event.pointerY(A)];var D=Position.cumulativeOffset(this.element);
this.offset=[0,1].map(function(E){return(B[E]-D[E])});Draggables.activate(this);Event.stop(A)
}},startDrag:function(B){this.dragging=true;if(!this.delta){this.delta=this.currentDelta()
}if(this.options.zindex){this.originalZ=parseInt(Element.getStyle(this.element,"z-index")||0);
this.element.style.zIndex=this.options.zindex}if(this.options.ghosting){this._clone=this.element.cloneNode(true);
this.element._originallyAbsolute=(this.element.getStyle("position")=="absolute");
if(!this.element._originallyAbsolute){Position.absolutize(this.element)}this.element.parentNode.insertBefore(this._clone,this.element)
}if(this.options.scroll){if(this.options.scroll==window){var A=this._getWindowScroll(this.options.scroll);
this.originalScrollLeft=A.left;this.originalScrollTop=A.top}else{this.originalScrollLeft=this.options.scroll.scrollLeft;
this.originalScrollTop=this.options.scroll.scrollTop}}Draggables.notify("onStart",this,B);
if(this.options.starteffect){this.options.starteffect(this.element)}},updateDrag:function(event,pointer){if(!this.dragging){this.startDrag(event)
}if(!this.options.quiet){Position.prepare();Droppables.show(pointer,this.element)
}Draggables.notify("onDrag",this,event);this.draw(pointer);if(this.options.change){this.options.change(this)
}if(this.options.scroll){this.stopScrolling();var p;if(this.options.scroll==window){with(this._getWindowScroll(this.options.scroll)){p=[left,top,left+width,top+height]
}}else{p=Position.page(this.options.scroll);p[0]+=this.options.scroll.scrollLeft+Position.deltaX;
p[1]+=this.options.scroll.scrollTop+Position.deltaY;p.push(p[0]+this.options.scroll.offsetWidth);
p.push(p[1]+this.options.scroll.offsetHeight)}var speed=[0,0];if(pointer[0]<(p[0]+this.options.scrollSensitivity)){speed[0]=pointer[0]-(p[0]+this.options.scrollSensitivity)
}if(pointer[1]<(p[1]+this.options.scrollSensitivity)){speed[1]=pointer[1]-(p[1]+this.options.scrollSensitivity)
}if(pointer[0]>(p[2]-this.options.scrollSensitivity)){speed[0]=pointer[0]-(p[2]-this.options.scrollSensitivity)
}if(pointer[1]>(p[3]-this.options.scrollSensitivity)){speed[1]=pointer[1]-(p[3]-this.options.scrollSensitivity)
}this.startScrolling(speed)}if(Prototype.Browser.WebKit){window.scrollBy(0,0)}Event.stop(event)
},finishDrag:function(B,E){this.dragging=false;if(this.options.quiet){Position.prepare();
var D=[Event.pointerX(B),Event.pointerY(B)];Droppables.show(D,this.element)}if(this.options.ghosting){if(!this.element._originallyAbsolute){Position.relativize(this.element)
}delete this.element._originallyAbsolute;Element.remove(this._clone);this._clone=null
}var F=false;if(E){F=Droppables.fire(B,this.element);if(!F){F=false}}if(F&&this.options.onDropped){this.options.onDropped(this.element)
}Draggables.notify("onEnd",this,B);var A=this.options.revert;if(A&&Object.isFunction(A)){A=A(this.element)
}var C=this.currentDelta();if(A&&this.options.reverteffect){if(F==0||A!="failure"){this.options.reverteffect(this.element,C[1]-this.delta[1],C[0]-this.delta[0])
}}else{this.delta=C}if(this.options.zindex){this.element.style.zIndex=this.originalZ
}if(this.options.endeffect){this.options.endeffect(this.element)}Draggables.deactivate(this);
Droppables.reset()},keyPress:function(A){if(A.keyCode!=Event.KEY_ESC){return }this.finishDrag(A,false);
Event.stop(A)},endDrag:function(A){if(!this.dragging){return }this.stopScrolling();
this.finishDrag(A,true);Event.stop(A)},draw:function(A){var F=Position.cumulativeOffset(this.element);
if(this.options.ghosting){var C=Position.realOffset(this.element);F[0]+=C[0]-Position.deltaX;
F[1]+=C[1]-Position.deltaY}var E=this.currentDelta();F[0]-=E[0];F[1]-=E[1];if(this.options.scroll&&(this.options.scroll!=window&&this._isScrollChild)){F[0]-=this.options.scroll.scrollLeft-this.originalScrollLeft;
F[1]-=this.options.scroll.scrollTop-this.originalScrollTop}var D=[0,1].map(function(G){return(A[G]-F[G]-this.offset[G])
}.bind(this));if(this.options.snap){if(Object.isFunction(this.options.snap)){D=this.options.snap(D[0],D[1],this)
}else{if(Object.isArray(this.options.snap)){D=D.map(function(G,H){return(G/this.options.snap[H]).round()*this.options.snap[H]
}.bind(this))}else{D=D.map(function(G){return(G/this.options.snap).round()*this.options.snap
}.bind(this))}}}var B=this.element.style;if((!this.options.constraint)||(this.options.constraint=="horizontal")){B.left=D[0]+"px"
}if((!this.options.constraint)||(this.options.constraint=="vertical")){B.top=D[1]+"px"
}if(B.visibility=="hidden"){B.visibility=""}},stopScrolling:function(){if(this.scrollInterval){clearInterval(this.scrollInterval);
this.scrollInterval=null;Draggables._lastScrollPointer=null}},startScrolling:function(A){if(!(A[0]||A[1])){return 
}this.scrollSpeed=[A[0]*this.options.scrollSpeed,A[1]*this.options.scrollSpeed];this.lastScrolled=new Date();
this.scrollInterval=setInterval(this.scroll.bind(this),10)},scroll:function(){var current=new Date();
var delta=current-this.lastScrolled;this.lastScrolled=current;if(this.options.scroll==window){with(this._getWindowScroll(this.options.scroll)){if(this.scrollSpeed[0]||this.scrollSpeed[1]){var d=delta/1000;
this.options.scroll.scrollTo(left+d*this.scrollSpeed[0],top+d*this.scrollSpeed[1])
}}}else{this.options.scroll.scrollLeft+=this.scrollSpeed[0]*delta/1000;this.options.scroll.scrollTop+=this.scrollSpeed[1]*delta/1000
}Position.prepare();Droppables.show(Draggables._lastPointer,this.element);Draggables.notify("onDrag",this);
if(this._isScrollChild){Draggables._lastScrollPointer=Draggables._lastScrollPointer||$A(Draggables._lastPointer);
Draggables._lastScrollPointer[0]+=this.scrollSpeed[0]*delta/1000;Draggables._lastScrollPointer[1]+=this.scrollSpeed[1]*delta/1000;
if(Draggables._lastScrollPointer[0]<0){Draggables._lastScrollPointer[0]=0}if(Draggables._lastScrollPointer[1]<0){Draggables._lastScrollPointer[1]=0
}this.draw(Draggables._lastScrollPointer)}if(this.options.change){this.options.change(this)
}},_getWindowScroll:function(w){var T,L,W,H;with(w.document){if(w.document.documentElement&&documentElement.scrollTop){T=documentElement.scrollTop;
L=documentElement.scrollLeft}else{if(w.document.body){T=body.scrollTop;L=body.scrollLeft
}}if(w.innerWidth){W=w.innerWidth;H=w.innerHeight}else{if(w.document.documentElement&&documentElement.clientWidth){W=documentElement.clientWidth;
H=documentElement.clientHeight}else{W=body.offsetWidth;H=body.offsetHeight}}}return{top:T,left:L,width:W,height:H}
}});Draggable._dragging={};var SortableObserver=Class.create({initialize:function(B,A){this.element=$(B);
this.observer=A;this.lastValue=Sortable.serialize(this.element)},onStart:function(){this.lastValue=Sortable.serialize(this.element)
},onEnd:function(){Sortable.unmark();if(this.lastValue!=Sortable.serialize(this.element)){this.observer(this.element)
}}});var Sortable={SERIALIZE_RULE:/^[^_\-](?:[A-Za-z0-9\-\_]*)[_](.*)$/,sortables:{},_findRootElement:function(A){while(A.tagName.toUpperCase()!="BODY"){if(A.id&&Sortable.sortables[A.id]){return A
}A=A.parentNode}},options:function(A){A=Sortable._findRootElement($(A));if(!A){return 
}return Sortable.sortables[A.id]},destroy:function(A){var B=Sortable.options(A);if(B){Draggables.removeObserver(B.element);
B.droppables.each(function(C){Droppables.remove(C)});B.draggables.invoke("destroy");
delete Sortable.sortables[B.element.id]}},create:function(C){C=$(C);var B=Object.extend({element:C,tag:"li",dropOnEmpty:false,tree:false,treeTag:"ul",overlap:"vertical",constraint:"vertical",containment:C,handle:false,only:false,delay:0,hoverclass:null,ghosting:false,quiet:false,scroll:false,scrollSensitivity:20,scrollSpeed:15,format:this.SERIALIZE_RULE,elements:false,handles:false,onChange:Prototype.emptyFunction,onUpdate:Prototype.emptyFunction},arguments[1]||{});
this.destroy(C);var A={revert:true,quiet:B.quiet,scroll:B.scroll,scrollSpeed:B.scrollSpeed,scrollSensitivity:B.scrollSensitivity,delay:B.delay,ghosting:B.ghosting,constraint:B.constraint,handle:B.handle};
if(B.starteffect){A.starteffect=B.starteffect}if(B.reverteffect){A.reverteffect=B.reverteffect
}else{if(B.ghosting){A.reverteffect=function(F){F.style.top=0;F.style.left=0}}}if(B.endeffect){A.endeffect=B.endeffect
}if(B.zindex){A.zindex=B.zindex}var D={overlap:B.overlap,containment:B.containment,tree:B.tree,hoverclass:B.hoverclass,onHover:Sortable.onHover};
var E={onHover:Sortable.onEmptyHover,overlap:B.overlap,containment:B.containment,hoverclass:B.hoverclass};
Element.cleanWhitespace(C);B.draggables=[];B.droppables=[];if(B.dropOnEmpty||B.tree){Droppables.add(C,E);
B.droppables.push(C)}(B.elements||this.findElements(C,B)||[]).each(function(H,F){var G=B.handles?$(B.handles[F]):(B.handle?$(H).select("."+B.handle)[0]:H);
B.draggables.push(new Draggable(H,Object.extend(A,{handle:G})));Droppables.add(H,D);
if(B.tree){H.treeNode=C}B.droppables.push(H)});if(B.tree){(Sortable.findTreeElements(C,B)||[]).each(function(F){Droppables.add(F,E);
F.treeNode=C;B.droppables.push(F)})}this.sortables[C.id]=B;Draggables.addObserver(new SortableObserver(C,B.onUpdate))
},findElements:function(B,A){return Element.findChildren(B,A.only,A.tree?true:false,A.tag)
},findTreeElements:function(B,A){return Element.findChildren(B,A.only,A.tree?true:false,A.treeTag)
},onHover:function(E,D,A){if(Element.isParent(D,E)){return }if(A>0.33&&A<0.66&&Sortable.options(D).tree){return 
}else{if(A>0.5){Sortable.mark(D,"before");if(D.previousSibling!=E){var B=E.parentNode;
E.style.visibility="hidden";D.parentNode.insertBefore(E,D);if(D.parentNode!=B){Sortable.options(B).onChange(E)
}Sortable.options(D.parentNode).onChange(E)}}else{Sortable.mark(D,"after");var C=D.nextSibling||null;
if(C!=E){var B=E.parentNode;E.style.visibility="hidden";D.parentNode.insertBefore(E,C);
if(D.parentNode!=B){Sortable.options(B).onChange(E)}Sortable.options(D.parentNode).onChange(E)
}}}},onEmptyHover:function(E,G,H){var I=E.parentNode;var A=Sortable.options(G);if(!Element.isParent(G,E)){var F;
var C=Sortable.findElements(G,{tag:A.tag,only:A.only});var B=null;if(C){var D=Element.offsetSize(G,A.overlap)*(1-H);
for(F=0;F<C.length;F+=1){if(D-Element.offsetSize(C[F],A.overlap)>=0){D-=Element.offsetSize(C[F],A.overlap)
}else{if(D-(Element.offsetSize(C[F],A.overlap)/2)>=0){B=F+1<C.length?C[F+1]:null;
break}else{B=C[F];break}}}}G.insertBefore(E,B);Sortable.options(I).onChange(E);A.onChange(E)
}},unmark:function(){if(Sortable._marker){Sortable._marker.hide()}},mark:function(B,A){var D=Sortable.options(B.parentNode);
if(D&&!D.ghosting){return }if(!Sortable._marker){Sortable._marker=($("dropmarker")||Element.extend(document.createElement("DIV"))).hide().addClassName("dropmarker").setStyle({position:"absolute"});
document.getElementsByTagName("body").item(0).appendChild(Sortable._marker)}var C=Position.cumulativeOffset(B);
Sortable._marker.setStyle({left:C[0]+"px",top:C[1]+"px"});if(A=="after"){if(D.overlap=="horizontal"){Sortable._marker.setStyle({left:(C[0]+B.clientWidth)+"px"})
}else{Sortable._marker.setStyle({top:(C[1]+B.clientHeight)+"px"})}}Sortable._marker.show()
},_tree:function(E,B,F){var D=Sortable.findElements(E,B)||[];for(var C=0;C<D.length;
++C){var A=D[C].id.match(B.format);if(!A){continue}var G={id:encodeURIComponent(A?A[1]:null),element:E,parent:F,children:[],position:F.children.length,container:$(D[C]).down(B.treeTag)};
if(G.container){this._tree(G.container,B,G)}F.children.push(G)}return F},tree:function(D){D=$(D);
var C=this.options(D);var B=Object.extend({tag:C.tag,treeTag:C.treeTag,only:C.only,name:D.id,format:C.format},arguments[1]||{});
var A={id:null,parent:null,children:[],container:D,position:0};return Sortable._tree(D,B,A)
},_constructIndex:function(B){var A="";do{if(B.id){A="["+B.position+"]"+A}}while((B=B.parent)!=null);
return A},sequence:function(B){B=$(B);var A=Object.extend(this.options(B),arguments[1]||{});
return $(this.findElements(B,A)||[]).map(function(C){return C.id.match(A.format)?C.id.match(A.format)[1]:""
})},setSequence:function(B,C){B=$(B);var A=Object.extend(this.options(B),arguments[2]||{});
var D={};this.findElements(B,A).each(function(E){if(E.id.match(A.format)){D[E.id.match(A.format)[1]]=[E,E.parentNode]
}E.parentNode.removeChild(E)});C.each(function(E){var F=D[E];if(F){F[1].appendChild(F[0]);
delete D[E]}})},serialize:function(C){C=$(C);var B=Object.extend(Sortable.options(C),arguments[1]||{});
var A=encodeURIComponent((arguments[1]&&arguments[1].name)?arguments[1].name:C.id);
if(B.tree){return Sortable.tree(C,arguments[1]).children.map(function(D){return[A+Sortable._constructIndex(D)+"[id]="+encodeURIComponent(D.id)].concat(D.children.map(arguments.callee))
}).flatten().join("&")}else{return Sortable.sequence(C,arguments[1]).map(function(D){return A+"[]="+encodeURIComponent(D)
}).join("&")}}};Element.isParent=function(B,A){if(!B.parentNode||B==A){return false
}if(B.parentNode==A){return true}return Element.isParent(B.parentNode,A)};Element.findChildren=function(D,B,A,C){if(!D.hasChildNodes()){return null
}C=C.toUpperCase();if(B){B=[B].flatten()}var E=[];$A(D.childNodes).each(function(G){if(G.tagName&&G.tagName.toUpperCase()==C&&(!B||(Element.classNames(G).detect(function(H){return B.include(H)
})))){E.push(G)}if(A){var F=Element.findChildren(G,B,A,C);if(F){E.push(F)}}});return(E.length>0?E.flatten():[])
};Element.offsetSize=function(A,B){return A["offset"+((B=="vertical"||B=="height")?"Height":"Width")]
};Array.prototype.indexOf=function(B){for(var A=0;A<this.length;A++){if(this[A]==B){return A
}}return -1};Array.prototype.filter=function(C){var B=[];for(var A=0;A<this.length;
A++){if(C(this[A])){B[B.length]=this[A]}}return B};String.prototype.right=function(A){if(A>=this.length){return this
}else{return this.substr(this.length-A,A)}};var Class={create:function(){return function(){this.initialize.apply(this,arguments)
}}};Object.extend=function(A,C){for(var B in C){A[B]=C[B]}return A};var DateBocks=Class.create();
DateBocks.VERSION="3.0.0";DateBocks.prototype={dateType:"numeric",dateBocksElement:null,autoRollOver:true,monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],weekdayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dateParsePatterns:[{re:/^tod|now/i,handler:function(A,B){return new Date()
}},{re:/^tom/i,handler:function(A,B){var C=new Date();C.setDate(C.getDate()+1);return C
}},{re:/^yes/i,handler:function(A,B){var C=new Date();C.setDate(C.getDate()-1);return C
}},{re:/^(\d{1,2})(st|nd|rd|th)?$/i,handler:function(B,C){var E=new Date();var F=E.getFullYear();
var A=parseInt(C[1],10);var D=E.getMonth();if(B.dateInRange(F,D,A)){return B.getDateObj(F,D,A)
}}},{re:/^(\d{1,2})(?:st|nd|rd|th)? (?:of\s)?(\w+)$/i,handler:function(B,C){var E=new Date();
var F=E.getFullYear();var A=parseInt(C[1],10);var D=B.parseMonth(C[2]);if(B.dateInRange(F,D,A)){return B.getDateObj(F,D,A)
}}},{re:/^(\d{1,2})(?:st|nd|rd|th)? (?:of )?(\w+),? (\d{4})$/i,handler:function(A,B){var C=new Date();
C.setDate(parseInt(B[1],10));C.setMonth(A.parseMonth(B[2]));C.setYear(B[3]);return C
}},{re:/^(\w+) (\d{1,2})(?:st|nd|rd|th)?$/i,handler:function(B,C){var E=new Date();
var F=E.getFullYear();var A=parseInt(C[2],10);var D=B.parseMonth(C[1]);if(B.dateInRange(F,D,A)){return B.getDateObj(F,D,A)
}}},{re:/^(\w+) (\d{1,2})(?:st|nd|rd|th)?,? (\d{4})$/i,handler:function(B,C){var E=parseInt(C[3],10);
var A=parseInt(C[2],10);var D=B.parseMonth(C[1]);if(B.dateInRange(E,D,A)){return B.getDateObj(E,D,A)
}}},{re:/((next|last)\s(week|month|year))/i,handler:function(I,H){var E=new Date();
var F=E.getDate();var B=E.getMonth();var C=E.getFullYear();switch(H[3]){case"week":var D=(H[2]=="next")?(F+7):(F-7);
E.setDate(D);break;case"month":var G=(H[2]=="next")?(B+1):(B-1);E.setMonth(G);break;
case"year":var A=(H[2]=="next")?(C+1):(C-1);E.setYear(A);break}return E}},{re:/^(next|this)?\s?(\w+)$/i,handler:function(C,E){var F=new Date();
var B=F.getDay();var D=C.parseWeekday(E[2]);var A=D-B;if(D<=B){A+=7}F.setDate(F.getDate()+A);
return F}},{re:/^last (\w+)$/i,handler:function(B,E){var F=new Date();var D=F.getDay();
var C=B.parseWeekday(E[1]);var A=(-1*(D+7-C))%7;if(0==A){A=-7}F.setDate(F.getDate()+A);
return F}},{re:/(\d{1,2})\/(\d{1,2})\/(\d{4})/,handler:function(B,C){if(B.dateType=="dd/mm/yyyy"){var E=parseInt(C[3],10);
var A=parseInt(C[1],10);var D=parseInt(C[2],10)-1}else{var E=parseInt(C[3],10);var A=parseInt(C[2],10);
var D=parseInt(C[1],10)-1}if(B.dateInRange(E,D,A)){return B.getDateObj(E,D,A)}}},{re:/(\d{1,2})\/(\d{1,2})\/(\d{1,2})/,handler:function(B,C){var E=new Date();
var F=E.getFullYear()-(E.getFullYear()%100)+parseInt(C[3],10);var A=parseInt(C[2],10);
var D=parseInt(C[1],10)-1;if(B.dateInRange(F,D,A)){return B.getDateObj(F,D,A)}}},{re:/(\d{1,2})\/(\d{1,2})/,handler:function(B,C){var E=new Date();
var F=E.getFullYear();var A=parseInt(C[2],10);var D=parseInt(C[1],10)-1;if(B.dateInRange(F,D,A)){return B.getDateObj(F,D,A)
}}},{re:/(\d{1,2})-(\d{1,2})-(\d{4})/,handler:function(B,C){if(B.dateType=="dd-mm-yyyy"){var E=parseInt(C[3],10);
var A=parseInt(C[1],10);var D=parseInt(C[2],10)-1}else{var E=parseInt(C[3],10);var A=parseInt(C[2],10);
var D=parseInt(C[1],10)-1}if(B.dateInRange(E,D,A)){return B.getDateObj(E,D,A)}}},{re:/(\d{1,2})\.(\d{1,2})\.(\d{4})/,handler:function(B,C){var A=parseInt(C[1],10);
var D=parseInt(C[2],10)-1;var E=parseInt(C[3],10);if(B.dateInRange(E,D,A)){return B.getDateObj(E,D,A)
}}},{re:/(\d{4})-(\d{1,2})-(\d{1,2})/,handler:function(B,C){var E=parseInt(C[1],10);
var A=parseInt(C[3],10);var D=parseInt(C[2],10)-1;if(B.dateInRange(E,D,A)){return B.getDateObj(E,D,A)
}}},{re:/(\d{1,2})-(\d{1,2})-(\d{1,2})/,handler:function(B,C){var E=new Date();var F=E.getFullYear()-(E.getFullYear()%100)+parseInt(C[1],10);
var A=parseInt(C[3],10);var D=parseInt(C[2],10)-1;if(B.dateInRange(F,D,A)){return B.getDateObj(F,D,A)
}}},{re:/(\d{1,2})-(\d{1,2})/,handler:function(B,C){var E=new Date();var F=E.getFullYear();
var A=parseInt(C[2],10);var D=parseInt(C[1],10)-1;if(B.dateInRange(F,D,A)){return B.getDateObj(F,D,A)
}}},{re:/(\d{1,2})-(\w+)-(\d{4})/,handler:function(B,C){var E=parseInt(C[3],10);var A=parseInt(C[1],10);
var D=B.parseMonth(C[2]);if(B.dateInRange(E,D,A)){return B.getDateObj(E,D,A)}}},],initialize:function(A){Object.extend(this,A)
},parseMonth:function(B){var A=this.monthNames.filter(function(C){return new RegExp("^"+B,"i").test(C)
});if(A.length==0){throw new Error("Invalid month string")}if(A.length<1){throw new Error("Ambiguous month")
}return this.monthNames.indexOf(A[0])},parseWeekday:function(B){var A=this.weekdayNames.filter(function(C){return new RegExp("^"+B,"i").test(C)
});if(A.length==0){throw new Error("Invalid day string")}if(A.length<1){throw new Error("Ambiguous weekday")
}return this.weekdayNames.indexOf(A[0])},dateInRange:function(D,C,A){if(C<0||C>11){throw new Error("Invalid month value.  Valid months values are 1 to 12")
}if(!this.autoRollOver){var B=(11==C)?new Date(D+1,0,0):new Date(D,C+1,0);if(A<1||A>B.getDate()){throw new Error("Invalid date value.  Valid date values for "+this.monthNames[C]+" are 1 to "+B.getDate().toString())
}}return true},getDateObj:function(D,C,A){var B=new Date();B.setDate(1);B.setYear(D);
B.setMonth(C);B.setDate(A);return B},parseDateString:function(D){var E=this.dateParsePatterns;
for(var A=0;A<E.length;A++){var C=E[A].re;var B=E[A].handler;var F=C.exec(D);if(F){return B(this,F)
}}throw new Error("Invalid date string")},zeroPad:function(A){if(A<10){return"0"+A
}else{return A}},magicDate:function(){var B=this.dateBocksElement;try{var F=this.parseDateString(B.value);
var A=this.zeroPad(F.getDate());var E=this.zeroPad(F.getMonth()+1);var C=F.getFullYear();
switch(this.dateType){case"numeric":B.value=C+""+E+""+A;break;case"dd/mm/yyyy":B.value=A+"/"+E+"/"+C;
break;case"dd-mm-yyyy":B.value=A+"-"+E+"-"+C;break;case"mm/dd/yyyy":case"us":B.value=E+"/"+A+"/"+C;
break;case"mm.dd.yyyy":case"de":B.value=E+"."+A+"."+C;break;case"default":case"iso":case"yyyy-mm-dd":default:B.value=C+"-"+E+"-"+A;
break}B.className=""}catch(D){}},trim:function(A){return A.replace(/^\s+|\s+$/,"")
},keyObserver:function(A,B){var C=A.keyCode?A.keyCode:((A.which)?A.which:A.charCode);
if(C==13||C==10){switch(B){case"parse":this.magicDate();break;case"return":case"false":default:return false;
break}}}};function autoInit_trees(){var B=document.getElementsByTagName("ul");for(var A=0;
A<B.length;A++){if(B[A].className&&B[A].className.indexOf("tree")!=-1){initTree(B[A]);
B[A].className=B[A].className.replace(/ ?unformatted ?/," ")}}}function initTree(A){var E,D;
var H,G,F;var C,J,B;for(E=0;E<A.childNodes.length;E++){if(A.childNodes[E].tagName&&A.childNodes[E].tagName.toLowerCase()=="li"){var I=A.childNodes[E];
H=document.createElement("span");G=document.createElement("span");F=document.createElement("span");
H.appendChild(G);G.appendChild(F);H.className="a "+I.className.replace("closed","spanClosed");
H.onMouseOver=function(){};G.className="b";G.onclick=update;F.className="c";J=I.childNodes.length;
C=0;B=null;for(D=0;D<I.childNodes.length;D++){if(I.childNodes[D].tagName&&I.childNodes[D].tagName.toLowerCase()=="div"){C=D+1;
continue}if(I.childNodes[D].tagName&&I.childNodes[D].tagName.toLowerCase()=="ul"){B=I.childNodes[D];
J=D;break}}for(D=C;D<J;D++){F.appendChild(I.childNodes[C])}if(I.childNodes.length>C){I.insertBefore(H,I.childNodes[C])
}else{I.appendChild(H)}if(B!=null){if(initTree(B)){addClass(I,"children","closed");
addClass(H,"children","spanClosed")}}}}if(I){addClass(I,"last","closed");addClass(H,"last","spanClosed");
return true}else{return false}}function treeToggle(C,D){while(C!=null&&(!C.tagName||C.tagName.toLowerCase()!="li")){C=C.parentNode
}var A=findChildWithTag(C,"ul");var B=findChildWithTag(C,"span");if(D!=null){if(D=="open"){treeOpen(B,C)
}else{if(D=="close"){treeClose(B,C)}}}else{if(A!=null){if(!C.className.match(/(^| )closed($| )/)){treeClose(B,C)
}else{treeOpen(B,C)}}}}function treeOpen(B,A){removeClass(B,"spanClosed");removeClass(A,"closed")
}function treeClose(B,A){addClass(B,"spanClosed");addClass(A,"closed")}function findChildWithTag(C,A){for(var B=0;
B<C.childNodes.length;B++){if(C.childNodes[B].tagName!=null&&C.childNodes[B].tagName.toLowerCase()==A){return C.childNodes[B]
}}return null}function addClass(C,B,A){if(A!=null&&C.className.match(new RegExp("(^| )"+A))){C.className=C.className.replace(new RegExp("( |^)"+A),"$1"+B+" "+A)
}else{if(!C.className.match(new RegExp("(^| )"+B+"($| )"))){C.className+=" "+B;C.className=C.className.replace(/(^ +)|( +$)/g,"")
}}}function removeClass(C,B){var A=C.className;var D=" "+C.className+" ";D=D.replace(new RegExp(" ("+B+" +)+","g")," ");
C.className=D.replace(/(^ +)|( +$)/g,"")}_LOADERS=Array();function callAllLoaders(){var B,A;
for(B=0;B<_LOADERS.length;B++){A=_LOADERS[B];if(A!=callAllLoaders){A()}}}function appendLoader(A){if(window.onload&&window.onload!=callAllLoaders){_LOADERS[_LOADERS.length]=window.onload
}window.onload=callAllLoaders;_LOADERS[_LOADERS.length]=A}appendLoader(autoInit_trees);
var Window=Class.create();Window.keepMultiModalWindow=false;Window.hasEffectLib=(typeof Effect!="undefined");
Window.resizeEffectDuration=0.4;Window.prototype={initialize:function(){var C;var B=0;
if(arguments.length>0){if(typeof arguments[0]=="string"){C=arguments[0];B=1}else{C=arguments[0]?arguments[0].id:null
}}if(!C){C="window_"+new Date().getTime()}if($(C)){alert("Window "+C+" is already registered in the DOM! Make sure you use setDestroyOnClose() or destroyOnClose: true in the constructor")
}this.options=Object.extend({className:"dialog",blurClassName:null,minWidth:100,minHeight:20,resizable:true,closable:true,minimizable:true,maximizable:true,draggable:true,userData:null,showEffect:(Window.hasEffectLib?Effect.Appear:Element.show),hideEffect:(Window.hasEffectLib?Effect.Fade:Element.hide),showEffectOptions:{},hideEffectOptions:{},effectOptions:null,parent:document.body,title:"&nbsp;",url:null,onload:Prototype.emptyFunction,width:200,height:300,opacity:1,recenterAuto:true,wiredDrag:false,closeCallback:null,destroyOnClose:false,gridX:1,gridY:1},arguments[B]||{});
if(this.options.blurClassName){this.options.focusClassName=this.options.className
}if(typeof this.options.top=="undefined"&&typeof this.options.bottom=="undefined"){this.options.top=this._round(Math.random()*500,this.options.gridY)
}if(typeof this.options.left=="undefined"&&typeof this.options.right=="undefined"){this.options.left=this._round(Math.random()*500,this.options.gridX)
}if(this.options.effectOptions){Object.extend(this.options.hideEffectOptions,this.options.effectOptions);
Object.extend(this.options.showEffectOptions,this.options.effectOptions);if(this.options.showEffect==Element.Appear){this.options.showEffectOptions.to=this.options.opacity
}}if(Window.hasEffectLib){if(this.options.showEffect==Effect.Appear){this.options.showEffectOptions.to=this.options.opacity
}if(this.options.hideEffect==Effect.Fade){this.options.hideEffectOptions.from=this.options.opacity
}}if(this.options.hideEffect==Element.hide){this.options.hideEffect=function(){Element.hide(this.element);
if(this.options.destroyOnClose){this.destroy()}}.bind(this)}if(this.options.parent!=document.body){this.options.parent=$(this.options.parent)
}this.element=this._createWindow(C);this.element.win=this;this.eventMouseDown=this._initDrag.bindAsEventListener(this);
this.eventMouseUp=this._endDrag.bindAsEventListener(this);this.eventMouseMove=this._updateDrag.bindAsEventListener(this);
this.eventOnLoad=this._getWindowBorderSize.bindAsEventListener(this);this.eventMouseDownContent=this.toFront.bindAsEventListener(this);
this.eventResize=this._recenter.bindAsEventListener(this);this.topbar=$(this.element.id+"_top");
this.bottombar=$(this.element.id+"_bottom");this.content=$(this.element.id+"_content");
Event.observe(this.topbar,"mousedown",this.eventMouseDown);Event.observe(this.bottombar,"mousedown",this.eventMouseDown);
Event.observe(this.content,"mousedown",this.eventMouseDownContent);Event.observe(window,"load",this.eventOnLoad);
Event.observe(window,"resize",this.eventResize);Event.observe(window,"scroll",this.eventResize);
Event.observe(this.options.parent,"scroll",this.eventResize);if(this.options.draggable){var A=this;
[this.topbar,this.topbar.up().previous(),this.topbar.up().next()].each(function(D){D.observe("mousedown",A.eventMouseDown);
D.addClassName("top_draggable")});[this.bottombar.up(),this.bottombar.up().previous(),this.bottombar.up().next()].each(function(D){D.observe("mousedown",A.eventMouseDown);
D.addClassName("bottom_draggable")})}if(this.options.resizable){this.sizer=$(this.element.id+"_sizer");
Event.observe(this.sizer,"mousedown",this.eventMouseDown)}this.useLeft=null;this.useTop=null;
if(typeof this.options.left!="undefined"){this.element.setStyle({left:parseFloat(this.options.left)+"px"});
this.useLeft=true}else{this.element.setStyle({right:parseFloat(this.options.right)+"px"});
this.useLeft=false}if(typeof this.options.top!="undefined"){this.element.setStyle({top:parseFloat(this.options.top)+"px"});
this.useTop=true}else{this.element.setStyle({bottom:parseFloat(this.options.bottom)+"px"});
this.useTop=false}this.storedLocation=null;this.setOpacity(this.options.opacity);
if(this.options.zIndex){this.setZIndex(this.options.zIndex)}if(this.options.destroyOnClose){this.setDestroyOnClose(true)
}this._getWindowBorderSize();this.width=this.options.width;this.height=this.options.height;
this.visible=false;this.constraint=false;this.constraintPad={top:0,left:0,bottom:0,right:0};
if(this.width&&this.height){this.setSize(this.options.width,this.options.height)}this.setTitle(this.options.title);
Windows.register(this)},destroy:function(){this._notify("onDestroy");Event.stopObserving(this.topbar,"mousedown",this.eventMouseDown);
Event.stopObserving(this.bottombar,"mousedown",this.eventMouseDown);Event.stopObserving(this.content,"mousedown",this.eventMouseDownContent);
Event.stopObserving(window,"load",this.eventOnLoad);Event.stopObserving(window,"resize",this.eventResize);
Event.stopObserving(window,"scroll",this.eventResize);Event.stopObserving(this.content,"load",this.options.onload);
if(this._oldParent){var C=this.getContent();var A=null;for(var B=0;B<C.childNodes.length;
B++){A=C.childNodes[B];if(A.nodeType==1){break}A=null}if(A){this._oldParent.appendChild(A)
}this._oldParent=null}if(this.sizer){Event.stopObserving(this.sizer,"mousedown",this.eventMouseDown)
}if(this.options.url){this.content.src=null}if(this.iefix){Element.remove(this.iefix)
}Element.remove(this.element);Windows.unregister(this)},setCloseCallback:function(A){this.options.closeCallback=A
},getContent:function(){return this.content},setContent:function(G,F,B){var A=$(G);
if(null==A){throw"Unable to find element '"+G+"' in DOM"}this._oldParent=A.parentNode;
var E=null;var D=null;if(F){E=Element.getDimensions(A)}if(B){D=Position.cumulativeOffset(A)
}var C=this.getContent();this.setHTMLContent("");C=this.getContent();C.appendChild(A);
A.show();if(F){this.setSize(E.width,E.height)}if(B){this.setLocation(D[1]-this.heightN,D[0]-this.widthW)
}},setHTMLContent:function(A){if(this.options.url){this.content.src=null;this.options.url=null;
var B='<div id="'+this.getId()+'_content" class="'+this.options.className+'_content"> </div>';
$(this.getId()+"_table_content").innerHTML=B;this.content=$(this.element.id+"_content")
}this.getContent().innerHTML=A},setAjaxContent:function(B,A,D,C){this.showFunction=D?"showCenter":"show";
this.showModal=C||false;A=A||{};this.setHTMLContent("");this.onComplete=A.onComplete;
if(!this._onCompleteHandler){this._onCompleteHandler=this._setAjaxContent.bind(this)
}A.onComplete=this._onCompleteHandler;new Ajax.Request(B,A);A.onComplete=this.onComplete
},_setAjaxContent:function(A){Element.update(this.getContent(),A.responseText);if(this.onComplete){this.onComplete(A)
}this.onComplete=null;this[this.showFunction](this.showModal)},setURL:function(A){if(this.options.url){this.content.src=null
}this.options.url=A;var B="<iframe frameborder='0' name='"+this.getId()+"_content'  id='"+this.getId()+"_content' src='"+A+"' width='"+this.width+"' height='"+this.height+"'> </iframe>";
$(this.getId()+"_table_content").innerHTML=B;this.content=$(this.element.id+"_content")
},getURL:function(){return this.options.url?this.options.url:null},refresh:function(){if(this.options.url){$(this.element.getAttribute("id")+"_content").src=this.options.url
}},setCookie:function(B,C,M,E,A){B=B||this.element.id;this.cookie=[B,C,M,E,A];var K=WindowUtilities.getCookie(B);
if(K){var L=K.split(",");var I=L[0].split(":");var H=L[1].split(":");var J=parseFloat(L[2]),F=parseFloat(L[3]);
var G=L[4];var D=L[5];this.setSize(J,F);if(G=="true"){this.doMinimize=true}else{if(D=="true"){this.doMaximize=true
}}this.useLeft=I[0]=="l";this.useTop=H[0]=="t";this.element.setStyle(this.useLeft?{left:I[1]}:{right:I[1]});
this.element.setStyle(this.useTop?{top:H[1]}:{bottom:H[1]})}},getId:function(){return this.element.id
},setDestroyOnClose:function(){this.options.destroyOnClose=true},setConstraint:function(A,B){this.constraint=A;
this.constraintPad=Object.extend(this.constraintPad,B||{});if(this.useTop&&this.useLeft){this.setLocation(parseFloat(this.element.style.top),parseFloat(this.element.style.left))
}},_initDrag:function(B){if(Event.element(B)==this.sizer&&this.isMinimized()){return 
}if(Event.element(B)!=this.sizer&&this.isMaximized()){return }if(Prototype.Browser.IE&&this.heightN==0){this._getWindowBorderSize()
}this.pointer=[this._round(Event.pointerX(B),this.options.gridX),this._round(Event.pointerY(B),this.options.gridY)];
if(this.options.wiredDrag){this.currentDrag=this._createWiredElement()}else{this.currentDrag=this.element
}if(Event.element(B)==this.sizer){this.doResize=true;this.widthOrg=this.width;this.heightOrg=this.height;
this.bottomOrg=parseFloat(this.element.getStyle("bottom"));this.rightOrg=parseFloat(this.element.getStyle("right"));
this._notify("onStartResize")}else{this.doResize=false;var A=$(this.getId()+"_close");
if(A&&Position.within(A,this.pointer[0],this.pointer[1])){this.currentDrag=null;return 
}this.toFront();if(!this.options.draggable){return }this._notify("onStartMove")}Event.observe(document,"mouseup",this.eventMouseUp,false);
Event.observe(document,"mousemove",this.eventMouseMove,false);WindowUtilities.disableScreen("__invisible__","__invisible__",this.overlayOpacity);
document.body.ondrag=function(){return false};document.body.onselectstart=function(){return false
};this.currentDrag.show();Event.stop(B)},_round:function(B,A){return A==1?B:B=Math.floor(B/A)*A
},_updateDrag:function(B){var A=[this._round(Event.pointerX(B),this.options.gridX),this._round(Event.pointerY(B),this.options.gridY)];
var J=A[0]-this.pointer[0];var I=A[1]-this.pointer[1];if(this.doResize){var H=this.widthOrg+J;
var D=this.heightOrg+I;J=this.width-this.widthOrg;I=this.height-this.heightOrg;if(this.useLeft){H=this._updateWidthConstraint(H)
}else{this.currentDrag.setStyle({right:(this.rightOrg-J)+"px"})}if(this.useTop){D=this._updateHeightConstraint(D)
}else{this.currentDrag.setStyle({bottom:(this.bottomOrg-I)+"px"})}this.setSize(H,D);
this._notify("onResize")}else{this.pointer=A;if(this.useLeft){var C=parseFloat(this.currentDrag.getStyle("left"))+J;
var G=this._updateLeftConstraint(C);this.pointer[0]+=G-C;this.currentDrag.setStyle({left:G+"px"})
}else{this.currentDrag.setStyle({right:parseFloat(this.currentDrag.getStyle("right"))-J+"px"})
}if(this.useTop){var F=parseFloat(this.currentDrag.getStyle("top"))+I;var E=this._updateTopConstraint(F);
this.pointer[1]+=E-F;this.currentDrag.setStyle({top:E+"px"})}else{this.currentDrag.setStyle({bottom:parseFloat(this.currentDrag.getStyle("bottom"))-I+"px"})
}this._notify("onMove")}if(this.iefix){this._fixIEOverlapping()}this._removeStoreLocation();
Event.stop(B)},_endDrag:function(A){WindowUtilities.enableScreen("__invisible__");
if(this.doResize){this._notify("onEndResize")}else{this._notify("onEndMove")}Event.stopObserving(document,"mouseup",this.eventMouseUp,false);
Event.stopObserving(document,"mousemove",this.eventMouseMove,false);Event.stop(A);
this._hideWiredElement();this._saveCookie();document.body.ondrag=null;document.body.onselectstart=null
},_updateLeftConstraint:function(B){if(this.constraint&&this.useLeft&&this.useTop){var A=this.options.parent==document.body?WindowUtilities.getPageSize().windowWidth:this.options.parent.getDimensions().width;
if(B<this.constraintPad.left){B=this.constraintPad.left}if(B+this.width+this.widthE+this.widthW>A-this.constraintPad.right){B=A-this.constraintPad.right-this.width-this.widthE-this.widthW
}}return B},_updateTopConstraint:function(C){if(this.constraint&&this.useLeft&&this.useTop){var A=this.options.parent==document.body?WindowUtilities.getPageSize().windowHeight:this.options.parent.getDimensions().height;
var B=this.height+this.heightN+this.heightS;if(C<this.constraintPad.top){C=this.constraintPad.top
}if(C+B>A-this.constraintPad.bottom){C=A-this.constraintPad.bottom-B}}return C},_updateWidthConstraint:function(A){if(this.constraint&&this.useLeft&&this.useTop){var B=this.options.parent==document.body?WindowUtilities.getPageSize().windowWidth:this.options.parent.getDimensions().width;
var C=parseFloat(this.element.getStyle("left"));if(C+A+this.widthE+this.widthW>B-this.constraintPad.right){A=B-this.constraintPad.right-C-this.widthE-this.widthW
}}return A},_updateHeightConstraint:function(B){if(this.constraint&&this.useLeft&&this.useTop){var A=this.options.parent==document.body?WindowUtilities.getPageSize().windowHeight:this.options.parent.getDimensions().height;
var C=parseFloat(this.element.getStyle("top"));if(C+B+this.heightN+this.heightS>A-this.constraintPad.bottom){B=A-this.constraintPad.bottom-C-this.heightN-this.heightS
}}return B},_createWindow:function(A){var F=this.options.className;var D=document.createElement("div");
D.setAttribute("id",A);D.className="dialog";var E;if(this.options.url){E='<iframe frameborder="0" name="'+A+'_content"  id="'+A+'_content" src="'+this.options.url+'"> </iframe>'
}else{E='<div id="'+A+'_content" class="'+F+'_content"> </div>'}var G=this.options.closable?"<div class='"+F+"_close' id='"+A+"_close' onclick='Windows.close(\""+A+"\", event)'> </div>":"";
var H=this.options.minimizable?"<div class='"+F+"_minimize' id='"+A+"_minimize' onclick='Windows.minimize(\""+A+"\", event)'> </div>":"";
var I=this.options.maximizable?"<div class='"+F+"_maximize' id='"+A+"_maximize' onclick='Windows.maximize(\""+A+"\", event)'> </div>":"";
var C=this.options.resizable?"class='"+F+"_sizer' id='"+A+"_sizer'":"class='"+F+"_se'";
var B="../themes/default/blank.gif";D.innerHTML=G+H+I+"      <table id='"+A+"_row1' class=\"top table_window\">        <tr>          <td class='"+F+"_nw'></td>          <td class='"+F+"_n'><div id='"+A+"_top' class='"+F+"_title title_window'>"+this.options.title+"</div></td>          <td class='"+F+"_ne'></td>        </tr>      </table>      <table id='"+A+"_row2' class=\"mid table_window\">        <tr>          <td class='"+F+"_w'></td>            <td id='"+A+"_table_content' class='"+F+"_content' valign='top'>"+E+"</td>          <td class='"+F+"_e'></td>        </tr>      </table>        <table id='"+A+"_row3' class=\"bot table_window\">        <tr>          <td class='"+F+"_sw'></td>            <td class='"+F+"_s'><div id='"+A+"_bottom' class='status_bar'><span style='float:left; width:1px; height:1px'></span></div></td>            <td "+C+"></td>        </tr>      </table>    ";
Element.hide(D);this.options.parent.insertBefore(D,this.options.parent.firstChild);
Event.observe($(A+"_content"),"load",this.options.onload);return D},changeClassName:function(A){var B=this.options.className;
var C=this.getId();$A(["_close","_minimize","_maximize","_sizer","_content"]).each(function(D){this._toggleClassName($(C+D),B+D,A+D)
}.bind(this));this._toggleClassName($(C+"_top"),B+"_title",A+"_title");$$("#"+C+" td").each(function(D){D.className=D.className.sub(B,A)
});this.options.className=A},_toggleClassName:function(C,B,A){if(C){C.removeClassName(B);
C.addClassName(A)}},setLocation:function(C,B){C=this._updateTopConstraint(C);B=this._updateLeftConstraint(B);
var A=this.currentDrag||this.element;A.setStyle({top:C+"px"});A.setStyle({left:B+"px"});
this.useLeft=true;this.useTop=true},getLocation:function(){var A={};if(this.useTop){A=Object.extend(A,{top:this.element.getStyle("top")})
}else{A=Object.extend(A,{bottom:this.element.getStyle("bottom")})}if(this.useLeft){A=Object.extend(A,{left:this.element.getStyle("left")})
}else{A=Object.extend(A,{right:this.element.getStyle("right")})}return A},getSize:function(){return{width:this.width,height:this.height}
},setSize:function(C,B,A){C=parseFloat(C);B=parseFloat(B);if(!this.minimized&&C<this.options.minWidth){C=this.options.minWidth
}if(!this.minimized&&B<this.options.minHeight){B=this.options.minHeight}if(this.options.maxHeight&&B>this.options.maxHeight){B=this.options.maxHeight
}if(this.options.maxWidth&&C>this.options.maxWidth){C=this.options.maxWidth}if(this.useTop&&this.useLeft&&Window.hasEffectLib&&Effect.ResizeWindow&&A){new Effect.ResizeWindow(this,null,null,C,B,{duration:Window.resizeEffectDuration})
}else{this.width=C;this.height=B;var E=this.currentDrag?this.currentDrag:this.element;
E.setStyle({width:C+this.widthW+this.widthE+"px"});E.setStyle({height:B+this.heightN+this.heightS+"px"});
if(!this.currentDrag||this.currentDrag==this.element){var D=$(this.element.id+"_content");
D.setStyle({height:B+"px"});D.setStyle({width:C+"px"})}}},updateHeight:function(){this.setSize(this.width,this.content.scrollHeight,true)
},updateWidth:function(){this.setSize(this.content.scrollWidth,this.height,true)},toFront:function(){if(this.element.style.zIndex<Windows.maxZIndex){this.setZIndex(Windows.maxZIndex+1)
}if(this.iefix){this._fixIEOverlapping()}},getBounds:function(B){if(!this.width||!this.height||!this.visible){this.computeBounds()
}var A=this.width;var C=this.height;if(!B){A+=this.widthW+this.widthE;C+=this.heightN+this.heightS
}var D=Object.extend(this.getLocation(),{width:A+"px",height:C+"px"});return D},computeBounds:function(){if(!this.width||!this.height){var A=WindowUtilities._computeSize(this.content.innerHTML,this.content.id,this.width,this.height,0,this.options.className);
if(this.height){this.width=A+5}else{this.height=A+5}}this.setSize(this.width,this.height);
if(this.centered){this._center(this.centerTop,this.centerLeft)}},show:function(B){this.visible=true;
if(B){if(typeof this.overlayOpacity=="undefined"){var A=this;setTimeout(function(){A.show(B)
},10);return }Windows.addModalWindow(this);this.modal=true;this.setZIndex(Windows.maxZIndex+1);
Windows.unsetOverflow(this)}else{if(!this.element.style.zIndex){this.setZIndex(Windows.maxZIndex+1)
}}if(this.oldStyle){this.getContent().setStyle({overflow:this.oldStyle})}this.computeBounds();
this._notify("onBeforeShow");if(this.options.showEffect!=Element.show&&this.options.showEffectOptions){this.options.showEffect(this.element,this.options.showEffectOptions)
}else{this.options.showEffect(this.element)}this._checkIEOverlapping();WindowUtilities.focusedWindow=this;
this._notify("onShow")},showCenter:function(A,C,B){this.centered=true;this.centerTop=C;
this.centerLeft=B;this.show(A)},isVisible:function(){return this.visible},_center:function(C,B){var D=WindowUtilities.getWindowScroll(this.options.parent);
var A=WindowUtilities.getPageSize(this.options.parent);if(typeof C=="undefined"){C=(A.windowHeight-(this.height+this.heightN+this.heightS))/2
}C+=D.top;if(typeof B=="undefined"){B=(A.windowWidth-(this.width+this.widthW+this.widthE))/2
}B+=D.left;this.setLocation(C,B);this.toFront()},_recenter:function(B){if(this.centered){var A=WindowUtilities.getPageSize(this.options.parent);
var C=WindowUtilities.getWindowScroll(this.options.parent);if(this.pageSize&&this.pageSize.windowWidth==A.windowWidth&&this.pageSize.windowHeight==A.windowHeight&&this.windowScroll.left==C.left&&this.windowScroll.top==C.top){return 
}this.pageSize=A;this.windowScroll=C;if($("overlay_modal")){$("overlay_modal").setStyle({height:(A.pageHeight+"px")})
}if(this.options.recenterAuto){this._center(this.centerTop,this.centerLeft)}}},hide:function(){this.visible=false;
if(this.modal){Windows.removeModalWindow(this);Windows.resetOverflow()}this.oldStyle=this.getContent().getStyle("overflow")||"auto";
this.getContent().setStyle({overflow:"hidden"});this.options.hideEffect(this.element,this.options.hideEffectOptions);
if(this.iefix){this.iefix.hide()}if(!this.doNotNotifyHide){this._notify("onHide")
}},close:function(){if(this.visible){if(this.options.closeCallback&&!this.options.closeCallback(this)){return 
}if(this.options.destroyOnClose){var A=this.destroy.bind(this);if(this.options.hideEffectOptions.afterFinish){var B=this.options.hideEffectOptions.afterFinish;
this.options.hideEffectOptions.afterFinish=function(){B();A()}}else{this.options.hideEffectOptions.afterFinish=function(){A()
}}}Windows.updateFocusedWindow();this.doNotNotifyHide=true;this.hide();this.doNotNotifyHide=false;
this._notify("onClose")}},minimize:function(){if(this.resizing){return }var A=$(this.getId()+"_row2");
if(!this.minimized){this.minimized=true;var D=A.getDimensions().height;this.r2Height=D;
var C=this.element.getHeight()-D;if(this.useLeft&&this.useTop&&Window.hasEffectLib&&Effect.ResizeWindow){new Effect.ResizeWindow(this,null,null,null,this.height-D,{duration:Window.resizeEffectDuration})
}else{this.height-=D;this.element.setStyle({height:C+"px"});A.hide()}if(!this.useTop){var B=parseFloat(this.element.getStyle("bottom"));
this.element.setStyle({bottom:(B+D)+"px"})}}else{this.minimized=false;var D=this.r2Height;
this.r2Height=null;if(this.useLeft&&this.useTop&&Window.hasEffectLib&&Effect.ResizeWindow){new Effect.ResizeWindow(this,null,null,null,this.height+D,{duration:Window.resizeEffectDuration})
}else{var C=this.element.getHeight()+D;this.height+=D;this.element.setStyle({height:C+"px"});
A.show()}if(!this.useTop){var B=parseFloat(this.element.getStyle("bottom"));this.element.setStyle({bottom:(B-D)+"px"})
}this.toFront()}this._notify("onMinimize");this._saveCookie()},maximize:function(){if(this.isMinimized()||this.resizing){return 
}if(Prototype.Browser.IE&&this.heightN==0){this._getWindowBorderSize()}if(this.storedLocation!=null){this._restoreLocation();
if(this.iefix){this.iefix.hide()}}else{this._storeLocation();Windows.unsetOverflow(this);
var G=WindowUtilities.getWindowScroll(this.options.parent);var B=WindowUtilities.getPageSize(this.options.parent);
var F=G.left;var E=G.top;if(this.options.parent!=document.body){G={top:0,left:0,bottom:0,right:0};
var D=this.options.parent.getDimensions();B.windowWidth=D.width;B.windowHeight=D.height;
E=0;F=0}if(this.constraint){B.windowWidth-=Math.max(0,this.constraintPad.left)+Math.max(0,this.constraintPad.right);
B.windowHeight-=Math.max(0,this.constraintPad.top)+Math.max(0,this.constraintPad.bottom);
F+=Math.max(0,this.constraintPad.left);E+=Math.max(0,this.constraintPad.top)}var C=B.windowWidth-this.widthW-this.widthE;
var A=B.windowHeight-this.heightN-this.heightS;if(this.useLeft&&this.useTop&&Window.hasEffectLib&&Effect.ResizeWindow){new Effect.ResizeWindow(this,E,F,C,A,{duration:Window.resizeEffectDuration})
}else{this.setSize(C,A);this.element.setStyle(this.useLeft?{left:F}:{right:F});this.element.setStyle(this.useTop?{top:E}:{bottom:E})
}this.toFront();if(this.iefix){this._fixIEOverlapping()}}this._notify("onMaximize");
this._saveCookie()},isMinimized:function(){return this.minimized},isMaximized:function(){return(this.storedLocation!=null)
},setOpacity:function(A){if(Element.setOpacity){Element.setOpacity(this.element,A)
}},setZIndex:function(A){this.element.setStyle({zIndex:A});Windows.updateZindex(A,this)
},setTitle:function(A){if(!A||A==""){A="&nbsp;"}Element.update(this.element.id+"_top",A)
},getTitle:function(){return $(this.element.id+"_top").innerHTML},setStatusBar:function(B){var A=$(this.getId()+"_bottom");
if(typeof (B)=="object"){if(this.bottombar.firstChild){this.bottombar.replaceChild(B,this.bottombar.firstChild)
}else{this.bottombar.appendChild(B)}}else{this.bottombar.innerHTML=B}},_checkIEOverlapping:function(){if(!this.iefix&&(navigator.appVersion.indexOf("MSIE")>0)&&(navigator.userAgent.indexOf("Opera")<0)&&(this.element.getStyle("position")=="absolute")){new Insertion.After(this.element.id,'<iframe id="'+this.element.id+'_iefix" style="display:none;position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);" src="javascript:false;" frameborder="0" scrolling="no"></iframe>');
this.iefix=$(this.element.id+"_iefix")}if(this.iefix){setTimeout(this._fixIEOverlapping.bind(this),50)
}},_fixIEOverlapping:function(){Position.clone(this.element,this.iefix);this.iefix.style.zIndex=this.element.style.zIndex-1;
this.iefix.show()},_getWindowBorderSize:function(B){var C=this._createHiddenDiv(this.options.className+"_n");
this.heightN=Element.getDimensions(C).height;C.parentNode.removeChild(C);var C=this._createHiddenDiv(this.options.className+"_s");
this.heightS=Element.getDimensions(C).height;C.parentNode.removeChild(C);var C=this._createHiddenDiv(this.options.className+"_e");
this.widthE=Element.getDimensions(C).width;C.parentNode.removeChild(C);var C=this._createHiddenDiv(this.options.className+"_w");
this.widthW=Element.getDimensions(C).width;C.parentNode.removeChild(C);var C=document.createElement("div");
C.className="overlay_"+this.options.className;document.body.appendChild(C);var A=this;
setTimeout(function(){A.overlayOpacity=($(C).getStyle("opacity"));C.parentNode.removeChild(C)
},10);if(Prototype.Browser.IE){this.heightS=$(this.getId()+"_row3").getDimensions().height;
this.heightN=$(this.getId()+"_row1").getDimensions().height}if(Prototype.Browser.WebKit&&Prototype.Browser.WebKitVersion<420){this.setSize(this.width,this.height)
}if(this.doMaximize){this.maximize()}if(this.doMinimize){this.minimize()}},_createHiddenDiv:function(B){var A=document.body;
var C=document.createElement("div");C.setAttribute("id",this.element.id+"_tmp");C.className=B;
C.style.display="none";C.innerHTML="";A.insertBefore(C,A.firstChild);return C},_storeLocation:function(){if(this.storedLocation==null){this.storedLocation={useTop:this.useTop,useLeft:this.useLeft,top:this.element.getStyle("top"),bottom:this.element.getStyle("bottom"),left:this.element.getStyle("left"),right:this.element.getStyle("right"),width:this.width,height:this.height}
}},_restoreLocation:function(){if(this.storedLocation!=null){this.useLeft=this.storedLocation.useLeft;
this.useTop=this.storedLocation.useTop;if(this.useLeft&&this.useTop&&Window.hasEffectLib&&Effect.ResizeWindow){new Effect.ResizeWindow(this,this.storedLocation.top,this.storedLocation.left,this.storedLocation.width,this.storedLocation.height,{duration:Window.resizeEffectDuration})
}else{this.element.setStyle(this.useLeft?{left:this.storedLocation.left}:{right:this.storedLocation.right});
this.element.setStyle(this.useTop?{top:this.storedLocation.top}:{bottom:this.storedLocation.bottom});
this.setSize(this.storedLocation.width,this.storedLocation.height)}Windows.resetOverflow();
this._removeStoreLocation()}},_removeStoreLocation:function(){this.storedLocation=null
},_saveCookie:function(){if(this.cookie){var A="";if(this.useLeft){A+="l:"+(this.storedLocation?this.storedLocation.left:this.element.getStyle("left"))
}else{A+="r:"+(this.storedLocation?this.storedLocation.right:this.element.getStyle("right"))
}if(this.useTop){A+=",t:"+(this.storedLocation?this.storedLocation.top:this.element.getStyle("top"))
}else{A+=",b:"+(this.storedLocation?this.storedLocation.bottom:this.element.getStyle("bottom"))
}A+=","+(this.storedLocation?this.storedLocation.width:this.width);A+=","+(this.storedLocation?this.storedLocation.height:this.height);
A+=","+this.isMinimized();A+=","+this.isMaximized();WindowUtilities.setCookie(A,this.cookie)
}},_createWiredElement:function(){if(!this.wiredElement){if(Prototype.Browser.IE){this._getWindowBorderSize()
}var B=document.createElement("div");B.className="wired_frame "+this.options.className+"_wired_frame";
B.style.position="absolute";this.options.parent.insertBefore(B,this.options.parent.firstChild);
this.wiredElement=$(B)}if(this.useLeft){this.wiredElement.setStyle({left:this.element.getStyle("left")})
}else{this.wiredElement.setStyle({right:this.element.getStyle("right")})}if(this.useTop){this.wiredElement.setStyle({top:this.element.getStyle("top")})
}else{this.wiredElement.setStyle({bottom:this.element.getStyle("bottom")})}var A=this.element.getDimensions();
this.wiredElement.setStyle({width:A.width+"px",height:A.height+"px"});this.wiredElement.setStyle({zIndex:Windows.maxZIndex+30});
return this.wiredElement},_hideWiredElement:function(){if(!this.wiredElement||!this.currentDrag){return 
}if(this.currentDrag==this.element){this.currentDrag=null}else{if(this.useLeft){this.element.setStyle({left:this.currentDrag.getStyle("left")})
}else{this.element.setStyle({right:this.currentDrag.getStyle("right")})}if(this.useTop){this.element.setStyle({top:this.currentDrag.getStyle("top")})
}else{this.element.setStyle({bottom:this.currentDrag.getStyle("bottom")})}this.currentDrag.hide();
this.currentDrag=null;if(this.doResize){this.setSize(this.width,this.height)}}},_notify:function(A){if(this.options[A]){this.options[A](this)
}else{Windows.notify(A,this)}}};var Windows={windows:[],modalWindows:[],observers:[],focusedWindow:null,maxZIndex:0,overlayShowEffectOptions:{duration:0.5},overlayHideEffectOptions:{duration:0.5},addObserver:function(A){this.removeObserver(A);
this.observers.push(A)},removeObserver:function(A){this.observers=this.observers.reject(function(B){return B==A
})},notify:function(A,B){this.observers.each(function(C){if(C[A]){C[A](A,B)}})},getWindow:function(A){return this.windows.detect(function(B){return B.getId()==A
})},getFocusedWindow:function(){return this.focusedWindow},updateFocusedWindow:function(){this.focusedWindow=this.windows.length>=2?this.windows[this.windows.length-2]:null
},register:function(A){this.windows.push(A)},addModalWindow:function(A){if(this.modalWindows.length==0){WindowUtilities.disableScreen(A.options.className,"overlay_modal",A.overlayOpacity,A.getId(),A.options.parent)
}else{if(Window.keepMultiModalWindow){$("overlay_modal").style.zIndex=Windows.maxZIndex+1;
Windows.maxZIndex+=1;WindowUtilities._hideSelect(this.modalWindows.last().getId())
}else{this.modalWindows.last().element.hide()}WindowUtilities._showSelect(A.getId())
}this.modalWindows.push(A)},removeModalWindow:function(A){this.modalWindows.pop();
if(this.modalWindows.length==0){WindowUtilities.enableScreen()}else{if(Window.keepMultiModalWindow){this.modalWindows.last().toFront();
WindowUtilities._showSelect(this.modalWindows.last().getId())}else{this.modalWindows.last().element.show()
}}},register:function(A){this.windows.push(A)},unregister:function(A){this.windows=this.windows.reject(function(B){return B==A
})},closeAll:function(){this.windows.each(function(A){Windows.close(A.getId())})},closeAllModalWindows:function(){WindowUtilities.enableScreen();
this.modalWindows.each(function(A){if(A){A.close()}})},minimize:function(C,A){var B=this.getWindow(C);
if(B&&B.visible){B.minimize()}Event.stop(A)},maximize:function(C,A){var B=this.getWindow(C);
if(B&&B.visible){B.maximize()}Event.stop(A)},close:function(C,A){var B=this.getWindow(C);
if(B){B.close()}if(A){Event.stop(A)}},blur:function(B){var A=this.getWindow(B);if(!A){return 
}if(A.options.blurClassName){A.changeClassName(A.options.blurClassName)}if(this.focusedWindow==A){this.focusedWindow=null
}A._notify("onBlur")},focus:function(B){var A=this.getWindow(B);if(!A){return }if(this.focusedWindow){this.blur(this.focusedWindow.getId())
}if(A.options.focusClassName){A.changeClassName(A.options.focusClassName)}this.focusedWindow=A;
A._notify("onFocus")},unsetOverflow:function(A){this.windows.each(function(B){B.oldOverflow=B.getContent().getStyle("overflow")||"auto";
B.getContent().setStyle({overflow:"hidden"})});if(A&&A.oldOverflow){A.getContent().setStyle({overflow:A.oldOverflow})
}},resetOverflow:function(){this.windows.each(function(A){if(A.oldOverflow){A.getContent().setStyle({overflow:A.oldOverflow})
}})},updateZindex:function(A,B){if(A>this.maxZIndex){this.maxZIndex=A;if(this.focusedWindow){this.blur(this.focusedWindow.getId())
}}this.focusedWindow=B;if(this.focusedWindow){this.focus(this.focusedWindow.getId())
}}};var Dialog={dialogId:null,onCompleteFunc:null,callFunc:null,parameters:null,confirm:function(D,C){if(D&&typeof D!="string"){Dialog._runAjaxRequest(D,C,Dialog.confirm);
return }D=D||"";C=C||{};var F=C.okLabel?C.okLabel:"Ok";var A=C.cancelLabel?C.cancelLabel:"Cancel";
C=Object.extend(C,C.windowParameters||{});C.windowParameters=C.windowParameters||{};
C.className=C.className||"alert";var B="class ='"+(C.buttonClass?C.buttonClass+" ":"")+" ok_button'";
var E="class ='"+(C.buttonClass?C.buttonClass+" ":"")+" cancel_button'";var D="      <div class='"+C.className+"_message'>"+D+"</div>        <div class='"+C.className+"_buttons'>          <input type='button' value='"+F+"' onclick='Dialog.okCallback()' "+B+"/>          <input type='button' value='"+A+"' onclick='Dialog.cancelCallback()' "+E+"/>        </div>    ";
return this._openDialog(D,C)},alert:function(C,B){if(C&&typeof C!="string"){Dialog._runAjaxRequest(C,B,Dialog.alert);
return }C=C||"";B=B||{};var D=B.okLabel?B.okLabel:"Ok";B=Object.extend(B,B.windowParameters||{});
B.windowParameters=B.windowParameters||{};B.className=B.className||"alert";var A="class ='"+(B.buttonClass?B.buttonClass+" ":"")+" ok_button'";
var C="      <div class='"+B.className+"_message'>"+C+"</div>        <div class='"+B.className+"_buttons'>          <input type='button' value='"+D+"' onclick='Dialog.okCallback()' "+A+"/>        </div>";
return this._openDialog(C,B)},info:function(B,A){if(B&&typeof B!="string"){Dialog._runAjaxRequest(B,A,Dialog.info);
return }B=B||"";A=A||{};A=Object.extend(A,A.windowParameters||{});A.windowParameters=A.windowParameters||{};
A.className=A.className||"alert";var B="<div id='modal_dialog_message' class='"+A.className+"_message'>"+B+"</div>";
if(A.showProgress){B+="<div id='modal_dialog_progress' class='"+A.className+"_progress'>  </div>"
}A.ok=null;A.cancel=null;return this._openDialog(B,A)},setInfoMessage:function(A){$("modal_dialog_message").update(A)
},closeInfo:function(){Windows.close(this.dialogId)},_openDialog:function(E,D){var C=D.className;
if(!D.height&&!D.width){D.width=WindowUtilities.getPageSize(D.options.parent||document.body).pageWidth/2
}if(D.id){this.dialogId=D.id}else{var B=new Date();this.dialogId="modal_dialog_"+B.getTime();
D.id=this.dialogId}if(!D.height||!D.width){var A=WindowUtilities._computeSize(E,this.dialogId,D.width,D.height,5,C);
if(D.height){D.width=A+5}else{D.height=A+5}}D.effectOptions=D.effectOptions;D.resizable=D.resizable||false;
D.minimizable=D.minimizable||false;D.maximizable=D.maximizable||false;D.draggable=D.draggable||false;
D.closable=D.closable||false;var F=new Window(D);F.getContent().innerHTML=E;F.showCenter(true,D.top,D.left);
F.setDestroyOnClose();F.cancelCallback=D.onCancel||D.cancel;F.okCallback=D.onOk||D.ok;
return F},_getAjaxContent:function(A){Dialog.callFunc(A.responseText,Dialog.parameters)
},_runAjaxRequest:function(C,B,A){if(C.options==null){C.options={}}Dialog.onCompleteFunc=C.options.onComplete;
Dialog.parameters=B;Dialog.callFunc=A;C.options.onComplete=Dialog._getAjaxContent;
new Ajax.Request(C.url,C.options)},okCallback:function(){var A=Windows.focusedWindow;
if(!A.okCallback||A.okCallback(A)){$$("#"+A.getId()+" input").each(function(B){B.onclick=null
});A.close()}},cancelCallback:function(){var A=Windows.focusedWindow;$$("#"+A.getId()+" input").each(function(B){B.onclick=null
});A.close();if(A.cancelCallback){A.cancelCallback(A)}}};if(Prototype.Browser.WebKit){var array=navigator.userAgent.match(new RegExp(/AppleWebKit\/([\d\.\+]*)/));
Prototype.Browser.WebKitVersion=parseFloat(array[1])}var WindowUtilities={getWindowScroll:function(parent){var T,L,W,H;
parent=parent||document.body;if(parent!=document.body){T=parent.scrollTop;L=parent.scrollLeft;
W=parent.scrollWidth;H=parent.scrollHeight}else{var w=window;with(w.document){if(w.document.documentElement&&documentElement.scrollTop){T=documentElement.scrollTop;
L=documentElement.scrollLeft}else{if(w.document.body){T=body.scrollTop;L=body.scrollLeft
}}if(w.innerWidth){W=w.innerWidth;H=w.innerHeight}else{if(w.document.documentElement&&documentElement.clientWidth){W=documentElement.clientWidth;
H=documentElement.clientHeight}else{W=body.offsetWidth;H=body.offsetHeight}}}}return{top:T,left:L,width:W,height:H}
},getPageSize:function(D){D=D||document.body;var C,G;var E,B;if(D!=document.body){C=D.getWidth();
G=D.getHeight();B=D.scrollWidth;E=D.scrollHeight}else{var F,A;if(window.innerHeight&&window.scrollMaxY){F=document.body.scrollWidth;
A=window.innerHeight+window.scrollMaxY}else{if(document.body.scrollHeight>document.body.offsetHeight){F=document.body.scrollWidth;
A=document.body.scrollHeight}else{F=document.body.offsetWidth;A=document.body.offsetHeight
}}if(self.innerHeight){C=self.innerWidth;G=self.innerHeight}else{if(document.documentElement&&document.documentElement.clientHeight){C=document.documentElement.clientWidth;
G=document.documentElement.clientHeight}else{if(document.body){C=document.body.clientWidth;
G=document.body.clientHeight}}}if(A<G){E=G}else{E=A}if(F<C){B=C}else{B=F}}return{pageWidth:B,pageHeight:E,windowWidth:C,windowHeight:G}
},disableScreen:function(C,A,D,E,B){WindowUtilities.initLightbox(A,C,function(){this._disableScreen(C,A,D,E)
}.bind(this),B||document.body)},_disableScreen:function(C,B,E,F){var D=$(B);var A=WindowUtilities.getPageSize(D.parentNode);
if(F&&Prototype.Browser.IE){WindowUtilities._hideSelect();WindowUtilities._showSelect(F)
}D.style.height=(A.pageHeight+"px");D.style.display="none";if(B=="overlay_modal"&&Window.hasEffectLib&&Windows.overlayShowEffectOptions){D.overlayOpacity=E;
new Effect.Appear(D,Object.extend({from:0,to:E},Windows.overlayShowEffectOptions))
}else{D.style.display="block"}},enableScreen:function(B){B=B||"overlay_modal";var A=$(B);
if(A){if(B=="overlay_modal"&&Window.hasEffectLib&&Windows.overlayHideEffectOptions){new Effect.Fade(A,Object.extend({from:A.overlayOpacity,to:0},Windows.overlayHideEffectOptions))
}else{A.style.display="none";A.parentNode.removeChild(A)}if(B!="__invisible__"){WindowUtilities._showSelect()
}}},_hideSelect:function(A){if(Prototype.Browser.IE){A=A==null?"":"#"+A+" ";$$(A+"select").each(function(B){if(!WindowUtilities.isDefined(B.oldVisibility)){B.oldVisibility=B.style.visibility?B.style.visibility:"visible";
B.style.visibility="hidden"}})}},_showSelect:function(A){if(Prototype.Browser.IE){A=A==null?"":"#"+A+" ";
$$(A+"select").each(function(B){if(WindowUtilities.isDefined(B.oldVisibility)){try{B.style.visibility=B.oldVisibility
}catch(C){B.style.visibility="visible"}B.oldVisibility=null}else{if(B.style.visibility){B.style.visibility="visible"
}}})}},isDefined:function(A){return typeof (A)!="undefined"&&A!=null},initLightbox:function(E,C,A,B){if($(E)){Element.setStyle(E,{zIndex:Windows.maxZIndex+1});
Windows.maxZIndex++;A()}else{var D=document.createElement("div");D.setAttribute("id",E);
D.className="overlay_"+C;D.style.display="none";D.style.position="absolute";D.style.top="0";
D.style.left="0";D.style.zIndex=Windows.maxZIndex+1;Windows.maxZIndex++;D.style.width="100%";
B.insertBefore(D,B.firstChild);if(Prototype.Browser.WebKit&&E=="overlay_modal"){setTimeout(function(){A()
},10)}else{A()}}},setCookie:function(B,A){document.cookie=A[0]+"="+escape(B)+((A[1])?"; expires="+A[1].toGMTString():"")+((A[2])?"; path="+A[2]:"")+((A[3])?"; domain="+A[3]:"")+((A[4])?"; secure":"")
},getCookie:function(C){var B=document.cookie;var E=C+"=";var D=B.indexOf("; "+E);
if(D==-1){D=B.indexOf(E);if(D!=0){return null}}else{D+=2}var A=document.cookie.indexOf(";",D);
if(A==-1){A=B.length}return unescape(B.substring(D+E.length,A))},_computeSize:function(E,A,B,G,D,F){var I=document.body;
var C=document.createElement("div");C.setAttribute("id",A);C.className=F+"_content";
if(G){C.style.height=G+"px"}else{C.style.width=B+"px"}C.style.position="absolute";
C.style.top="0";C.style.left="0";C.style.display="none";C.innerHTML=E;I.insertBefore(C,I.firstChild);
var H;if(G){H=$(C).getDimensions().width+D}else{H=$(C).getDimensions().height+D}I.removeChild(C);
return H}};function dialog(B,A){Dialog.info("",{showProgress:true,windowParameters:{title:A?A:"Help",className:"popup",width:500,height:300,resizable:true,closable:true,draggable:true,url:BASE+"context/"+B}})
}var UniProt={};var setSecurityDomain=function(){var A=/uniprot.org/;if(A.test(location.href)){document.domain="uniprot.org"
}};Array.prototype.contains=function(B){for(var A=0;A<this.length;A++){if(this[A]===B){return true
}}return false};Array.prototype.remove=function(B){var C=false;for(var A=0;A<this.length;
A++){if(this[A]===B){this.splice(A,1);C=true}}return C};Array.prototype.clear=function(){this.length=0;
return this};String.prototype.trim=function(){return this.replace(/^\s\s*/,"").replace(/\s\s*$/,"")
};function addShowEvent(B){var A=window.onpageshow;if(typeof window.onpageshow!="function"){window.onpageshow=B
}else{window.onpageshow=function(){A();B()}}}function addHideEvent(B){var A=window.onpagehide;
if(typeof window.onpagehide!="function"){window.onpagehide=B}else{window.onpagehide=function(){A();
B()}}}var domainUniprot;function initDomainCart(A){if(A!=null&&A!=""){domainUniprot=A
}}function getCookie(C){var D=document.cookie.indexOf(C+"=");var A=D+C.length+1;if((!D)&&(C!=document.cookie.substring(0,C.length))){return null
}if(D==-1){return null}var B=document.cookie.indexOf(";",A);if(B==-1){B=document.cookie.length
}return unescape(document.cookie.substring(A,B))}function setCookie(C,E,H,A,D,G){var B=new Date();
B.setTime(B.getTime());if(A>0){A=A*1000*60*60*24}var F=A>=0?new Date(B.getTime()+(A)):new Date(0);
document.cookie=C+"="+escape(E)+((A)?";expires="+F.toGMTString():"")+((H)?";path="+H:"")+((domainUniprot)?";domain="+domainUniprot:"")+((G)?";secure":"")
}function deleteCookie(A,C,B){if(getCookie(A)){if(C&&C.charAt(0)!="/"){C=BASE+C+"/"
}setCookie(A,"",C?C:"/",-1,B)}}function save(A,B,C){if(C&&C.charAt(0)!="/"){C=BASE+C+"/"
}setCookie(A,B,C?C:"/",365)}function save_tmp(A,B,C){if(C&&C.charAt(0)!="/"){C=BASE+C+"/"
}setCookie(A,B,C?C:"/")}function load(A){return getCookie(A)}function checkReferenceToggle(A,B){if($(B).style.display=="none"){toggleLargeScale(A);
$("large-scale-hide-link").hide();$("large-scale-show-link").show()}}function toggleLargeScale(A){for(var D=0;
D<A;D++){var B=D+1;var C="rp_"+B;if($(C)!=null){var E="ref"+B;$(E).toggle()}}}linkTargets={embl:"http://www.ebi.ac.uk/cgi-bin/expasyfetch?",embl_cds:"http://www.ebi.ac.uk/cgi-bin/dbfetch?db=emblcds&id=",genbank:"http://www.ncbi.nlm.nih.gov/entrez/viewer.fcgi?db=nuccore&id=",ddbj:"http://getentry.ddbj.nig.ac.jp/search/get_entry?accnumber=",genbank_cds:"http://www.ncbi.nlm.nih.gov/entrez/query.fcgi?db=protein&cmd=&term=",ddbj_cds:"http://srs.ddbj.nig.ac.jp/cgi-bin/wgetz?-e+[DADRELEASE:]",pdb:"http://www.pdb.org/pdb/cgi/explore.cgi?pdbId=",pdbe:"http://www.ebi.ac.uk/pdbe-srv/view/entry/"};
configuredLinks={insd:"embl",insd_cds:"embl_cds",pdb:"pdb"};function configureLink(B,A){configuredLinks[B]=A;
if(B=="insd"){var D=$$("a.embl");for(var C=0;C<D.length;++C){var E=D[C];E.href=E.href.replace(linkTargets.embl,linkTargets[A]);
E.href=E.href.replace(linkTargets.genbank,linkTargets[A]);E.href=E.href.replace(linkTargets.ddbj,linkTargets[A])
}}if(B=="insd_cds"){var D=$$("a.embl_cds");for(var C=0;C<D.length;++C){var E=D[C];
E.href=E.href.replace(linkTargets.embl_cds,linkTargets[A]);E.href=E.href.replace(linkTargets.genbank_cds,linkTargets[A]);
E.href=E.href.replace(linkTargets.ddbj_cds,linkTargets[A])}}if(B=="pdb"){var D=$$("a.pdb");
for(var C=0;C<D.length;++C){var E=D[C];E.href=E.href.replace(linkTargets.pdb,linkTargets[A]);
E.href=E.href.replace(linkTargets.pdbe,linkTargets[A])}}}function openLink(B){var C=$(B);
var A=C.options[C.selectedIndex];if(A!=""){window.location=A.value;return false}return true
}function checkJobStatus(){new Ajax.Request(window.location.href+".stat",{method:"get",onSuccess:function(A){if(A.responseText.match(/COMPLETED/)){clearInterval(interval);
window.location.reload()}else{if(A.responseText.match(/FAILED/)){clearInterval(interval);
window.location.reload()}}},onFailure:function(A){clearInterval(interval);window.location.reload()
}})}var shiftPressed=false;var ctrlPressed=false;function keyDown(A){if(document.all){A=window.event
}if(A.keyCode==16){shiftPressed=true}else{if(A.keyCode==17){ctrlPressed=true}}}function keyUp(A){if(document.all){A=window.event
}if(A.keyCode==16){shiftPressed=false}else{if(A.keyCode==17){ctrlPressed=false}}}function isShiftPressed(){return shiftPressed
}function isCtrlPressed(){return ctrlPressed}addHideEvent(function(){shiftPressed=false;
ctrlPressed=false});addShowEvent(function(){shiftPressed=false;ctrlPressed=false});
var sequences=new Array();function initCart(){var A=load("cart");if(A){sequences=A.split(" ");
refreshCart()}else{if(sequences.length>0){sequences.clear();refreshCart()}}}function refreshCart(){var H=document.createTextNode(""+sequences.length);
var E=$("cart-count");if(E){E.replaceChild(H,E.firstChild)}var G=$("cart-list");if(G){var F="";
var C=0;var B=false;if(sequences.length>0){for(var D=sequences.length-1;D>-1;D--){if(C<4){F+="<strong>"+formatCartItem(sequences[D])+"</strong><a onclick=\"addCart('"+sequences[D]+'\'); return false" href="#" class="hide"><img title="Drop" alt="Drop" src="'+image_x_inverse+'"></a> '
}else{if(!B){B=true;F+="<span id='cart-show'><strong><a href='#' onclick='$(\"cart-all-ids\").show(); $(\"cart-show\").hide(); $(\"cart-hide\").show(); return false;'>More &raquo;</a></strong></span>";
F+="<span id='cart-all-ids' style='display:none;'>"}F+="<strong>"+formatCartItem(sequences[D])+"</strong><a onclick=\"addCart('"+sequences[D]+'\'); return false" href="#" class="hide"><img title="Drop" alt="Drop" src="'+image_x_inverse+'"></a> '
}C++}if(C>=4){F+="</span>";F+="<span id='cart-hide' style='display:none;'><strong><a href='#' onclick='$(\"cart-all-ids\").hide(); $(\"cart-show\").show(); $(\"cart-hide\").hide(); return false;'>&laquo; Hide</a></strong></span>"
}}G.innerHTML=F}setVisible("cart",sequences.length>0);$("cart-align").disabled=sequences.length<2;
if(sequences.length!=1&&sequences.length<500){$("cart-blast").disabled=true}else{$("cart-blast").disabled=false
}var A=document.getElementsByClassName("cart-item");for(var D=0;D<A.length;++D){A[D].checked=sequences.contains(A[D].id)
}}function formatCartItemTitle(D,A){var C=D.replace(/_(.+?)_$/,"").replace(/_(\d+)$/,"").replace(/\-\d+/,"");
if(C.length==6){var B="/uniprot/"+C+".txt";new Ajax.Request(B,{method:"get",onSuccess:function(H){var E=H.responseText||"no response text";
var G=/^ID   ([A-Z\d_]+) (.+)/;var F=G.exec(E);document.getElementById("cartItem"+A).title=F[1]
}})}}function formatCartItem(B,A){return B.replace(/_(.+?)_$/,"[$1]").replace(/_(\d+)$/,":$1")
}function addCart(A){if(sequences.contains(A)){sequences.remove(A)}else{sequences.push(A)
}setTimeout(refreshCart,0);save_tmp("cart",sequences.join(" "))}function appendCart(E,D){var B=new Array();
var A=document.getElementsByClassName("cart-item",D);for(var C=0;C<A.length;++C){if(A[C].id==E){B.push(A[C].id);
fillCart(B);break}else{if(sequences.contains(A[C].id)){B.clear()}else{B.push(A[C].id)
}}}}function addOrAppendCart(B,A){if(isShiftPressed()){appendCart(B,A)}else{addCart(B)
}}function addOrAppendCartMulti(D,A){var C=D.split("%0A");var B=0;while(B<C.length){if(C[B].length!=0){addOrAppendCart(C[B],A)
}B++}}function fillCart(A){var C=0;for(var B=0;B<A.length;++B){if(!sequences.contains(A[B])){sequences.push(A[B]);
++C}}if(C>0){setTimeout(refreshCart,0);save_tmp("cart",sequences.join(" "))}}function clearCart(){sequences.clear();
refreshCart();deleteCookie("cart")}function submitCart(){var A=$("align-form");A.elements.query.value=getCartData();
A.elements.redirect.value=isCtrlPressed()?"no":"yes";A.submit()}function fetchCart(){var A=$("batch-form");
A.elements.query.value=getCartData();A.submit()}function blastCart(){var A=$("blast-form");
A.elements.query.value=getCartData();A.submit()}function getCartData(){var B="";for(var A=0;
A<sequences.length;A++){B+=formatCartItem(sequences[A]);B+="\n"}return B}addShowEvent(function(A){if(A&&A.persisted){initCart()
}});function toggle(B){var A=$(B);if(A!=null){A.toggle()}}function showAll(B,E,C){var D=document.getElementsByClassName(B,C);
for(var A=0;A<D.length;++A){setVisible(D[A],E)}}function setVisible(C,B){var A=$(C);
if(A!=null){B?A.show():A.hide()}}function loadEntryAsText(D){if(D.length>0){var A=BASE+"uniprot/"+D+".txt";
var C="";var B=new Ajax.Request(A,{method:"get",parameters:C,onComplete:showResponse})
}else{document.forms["feedback-form"].elements.subject.value="UniProtKB entry update request"
}}function showResponse(B){var A=B.status;if(A==200){var D="";var E=B.responseText;
document.forms["feedback-form"].elements.text.value=E;var G=new RegExp("^ID   .* Reviewed;");
var F=G.test(E);var C=F?"UniProtKB/Swiss-Prot":"UniProtKB/TrEMBL";document.forms["feedback-form"].elements.subject.value=C+" "+document.forms["feedback-form"].elements.entry.value+" entry update request";
if(!F){D='<label for="none"><span>&nbsp;</span></label>This is currently an unreviewed entry. We are going to update it and integrate it as a reviewed entry in UniProtKB/Swiss-Prot.<br/>'
}D+='<label for="none"><span>&nbsp;</span></label>Please post your update in the text field below, or <a href="#" onclick="displayTextEntry();">load the entry</a> in text format and add your comment.';
document.getElementById("additionalInfo").innerHTML=D}else{alert("Entry not found or problem during request.")
}}function displayTextEntry(){var A=document.forms["feedback-form"].elements.text.value;
if(A.length>190000){alert("Entry size too large to be submitted. Please use free comments.")
}else{document.forms["feedback-form"].elements.message.value=A}}function resetText(){document.forms["feedback-form"].elements.message.value=""
}function replaceGraph(C){Element.extend(C);var D=C.readAttribute("query");var B=D+"&format=graph";
var A=document.getElementById("graph");Element.extend(A);if(typeof A!="undefined"&&A!=null){Element.extend(A);
new Ajax.Request(B,{method:"get",onSuccess:function(E){A.update(E.responseText)},onFailure:function(E){A.update(E.responseText)
}})}}function recordLocation(B){Element.extend(B);var D=B.id;if(location.hash.length>0){var A=location.hash.substring(1);
var C=new RegExp("("+D.substring(5)+",)|(,"+D.substring(5)+")|(#"+D.substring(5)+")","g");
if(!C.test(location.hash)){location.hash=location.hash+","+D.substring(5)}}else{location.hash=D.substring(5)
}}function reopenLocation(){if(location.hash.length>0){var B=Element.extend(document.getElementById("content"));
var D=new Element("p",{"class":"warn"});D.update("Please wait while rebuilding tree");
B.insert(D,{position:Element.before});var A=location.hash.substring(1).split(",");
while(A.length>0){var C=A.shift();if(A.length==0){reopenChild(C,true)}else{reopenChild(C,false)
}}D.remove()}}function reopenChild(C,B){var B=B;var A=Element.extend(document.getElementById("item-"+C));
if(typeof A!="undefined"&&A!=null){if(B){replaceGraph(A)}insertChild(A,B)}else{window.setTimeout("reopenChild("+C+","+B+")",200)
}}function insertChild(C,F){var E=C.readAttribute("query");var G=C.readAttribute("id");
G=G.substring(5);var B=E+"&format=browse-table";var A=Element.extend(document.getElementById("child-"+G));
Element.extend(A);var D=Element.extend(document.getElementById("item-"+G));Element.extend(D);
Element.extend(lastActive);if(lastActive!=""){lastActive.removeClassName("active")
}if(D.hasClassName("closed")&&!D.hasClassName("loaded")){C.addClassName("fetching");
new Ajax.Request(B,{method:"get",onSuccess:function(H){A.update(H.responseText);initTree(A);
treeToggle(D,"open");if(F){C.addClassName("active")}C.addClassName("loaded");C.removeClassName("fetching");
lastActive=C},onFailure:function(H){alert("failed "+B);A.update('<li><p class="warn">Ajax loading failed for subnode <a href='+E+"> the data is available here</a></p></li>");
treeToggle(D,"open");lastActive=C}})}else{lastActive=C;treeToggle(D);if(F){C.addClassName("active")
}}}function showBlastOptions(){$("blast-options-show").hide();$("blast-options-hide").show();
$("blast-options").show();save("blast-options","show")}function hideBlastOptions(){$("blast-options-hide").hide();
$("blast-options-show").show();$("blast-options").hide();deleteCookie("blast-options")
}function initBlastOptions(){if(getCookie("blast-options")=="show"){showBlastOptions()
}}UniProt.addOptionGroup=function addOptionGroup(B,A,D,F){var E=Builder.node("optgroup",{label:B});
for(var C=0;C<A.length;++C){if(!A[C].hasOwnProperty("from")||A[C].from===F){E.appendChild(Builder.node("option",{value:A[C].value},A[C].label))
}}D.appendChild(E)};UniProt.mappingOptions=function mappingOptions(){for(var B=0;
B<UniProt.mappingBuilders.length;++B){UniProt.addOptionGroup(UniProt.mappingBuilders[B].label,UniProt.mappingBuilders[B].members,$("map-from"),true)
}for(var A=0;A<UniProt.mappingBuilders.length;++A){UniProt.addOptionGroup(UniProt.mappingBuilders[A].label,UniProt.mappingBuilders[A].members,$("map-to"),false)
}UniProt.mappingSelected()};UniProt.mappingSelected=function mappingSelected(){var B=5;
var A=0;var D=document.getElementById("map-from-label").getAttribute("from");var C=document.getElementById("map-to-label").getAttribute("to");
if(typeof D==="string"&&D!==""){D=D.replace(/\s/,"+");B=UniProt.mappingFindSelected(true,D)
}if(typeof C==="string"&&C!==""){A=UniProt.mappingFindSelected(false,C)}document.getElementById("map-from").options[B].selected=true;
document.getElementById("map-to").options[A].selected=true};UniProt.mappingFindSelected=function mappingFindSelected(B,G){var A=-1;
var F=-1;for(var D=0;D<UniProt.mappingBuilders.length;++D){for(var C=0;C<UniProt.mappingBuilders[D].members.length;
++C){var E=UniProt.mappingBuilders[D].members[C];if(!E.hasOwnProperty("from")||E.from===B){A++
}if(E.value===G){F=A}}}return F};UniProt.mappingFaq=function mappingSelected(){var F=document.getElementById("mapping-faq-table");
for(var E=0;E<UniProt.mappingBuilders.length;++E){var B=new Element("th",{colspan:"3"});
B.update(UniProt.mappingBuilders[E].label);F.appendChild(B);for(var C=0;C<UniProt.mappingBuilders[E].members.length;
++C){var D=UniProt.mappingBuilders[E].members[C];var G=new Element("tr");var A=new Element("td");
var H=new Element("td");A.update(D.label);H.update(D.value);G.appendChild(A);G.appendChild(H);
var I=new Element("td");if(D.hasOwnProperty("from")){if(D.from){I.update("from")}else{I.update("to")
}}else{I.update("both")}G.appendChild(I);F.appendChild(G)}}};UniProt.mappingBuilders=[{label:"UniProt",members:[{value:"ACC+ID",label:"UniProtKB AC/ID",from:true},{value:"ACC",label:"UniProtKB AC",from:false},{value:"ID",label:"UniProtKB ID",from:false},{value:"UPARC",label:"UniParc"},{value:"NF50",label:"UniRef50"},{value:"NF90",label:"UniRef90"},{value:"NF100",label:"UniRef100"}]},{label:"Other sequence databases",members:[{value:"EMBL_ID",label:"EMBL/GenBank/DDBJ"},{value:"EMBL",label:"EMBL/GenBank/DDBJ CDS"},{value:"PIR",label:"PIR"},{value:"UNIGENE_ID",label:"UniGene"},{value:"P_ENTREZGENEID",label:"Entrez Gene (GeneID)"},{value:"P_GI",label:"GI number*"},{value:"P_IPI",label:"IPI"},{value:"P_REFSEQ_AC",label:"RefSeq"}]},{label:"3D structure databases",members:[{value:"PDB_ID",label:"PDB/PDBe"},{value:"DISPROT_ID",label:"DisProt"},{value:"HSSP_ID",label:"HSSP"}]},{label:"Protein-protein interaction databases",members:[{value:"DIP_ID",label:"DIP"}]},{label:"Protein family/group databases",members:[{value:"MEROPS_ID",label:"MEROPS"},{value:"PEROXIBASE_ID",label:"PeroxiBase"},{value:"PPTASEDB_ID",label:"PptaseDB"},{value:"REBASE_ID",label:"REBASE"},{value:"TCDB_ID",label:"TCDB"}]},{label:"2D gel databases",members:[{value:"2DBASE_ECOLI_ID",label:"2DBase-Ecoli"},{value:"AARHUS_GHENT_2DPAGE_ID",label:"Aarhus/Ghent-2DPAGE"},{value:"ANU_2DPAGE_ID",label:"ANU-2DPAGE"},{value:"DOSAC_COBS_2DPAGE_ID",label:"DOSAC-COBS-2DPAGE"},{value:"ECO2DBASE_ID",label:"ECO2DBASE"},{value:"WORLD_2DPAGE_ID",label:"World-2DPAGE"}]},{label:"Genome annotation databases",members:[{value:"ENSEMBL_ID",label:"Ensembl"},{value:"P_ENTREZGENEID",label:"GeneID"},{value:"GENOMEREVIEWS_ID",label:"GenomeReviews"},{value:"KEGG_ID",label:"KEGG"},{value:"TIGR_ID",label:"TIGR"},{value:"VECTORBASE_ID",label:"VectorBase"}]},{label:"Organism-specific gene databases",members:[{value:"AGD_ID",label:"AGD"},{value:"BURULIST_ID",label:"BuruList"},{value:"CGD",label:"CGD"},{value:"CYGD_ID",label:"CYGD"},{value:"DICTYBASE_ID",label:"dictyBase"},{value:"ECHOBASE_ID",label:"EchoBASE"},{value:"ECOGENE_ID",label:"EcoGene"},{value:"EUHCVDB_ID",label:"euHCVdb"},{value:"FLYBASE_ID",label:"FlyBase"},{value:"GENECARDS_ID",label:"GeneCards"},{value:"GENEDB_SPOMBE_ID",label:"GeneDB_Spombe"},{value:"GENEFARM_ID",label:"GeneFarm"},{value:"H_INVDB_ID",label:"H-InvDB"},{value:"HGNC_ID",label:"HGNC"},{value:"HPA_ID",label:"HPA"},{value:"LEGIOLIST_ID",label:"LegioList"},{value:"LEPROMA_ID",label:"Leproma"},{value:"LISTILIST_ID",label:"ListiList"},{value:"MAIZEGDB_ID",label:"MaizeGDB"},{value:"MIM_ID",label:"MIM"},{value:"MGI_ID",label:"MGI"},{value:"MYPULIST_ID",label:"MypuList"},{value:"NMPDR",label:"NMPDR"},{value:"PHARMGKB_ID",label:"PharmGKB"},{value:"PHOTOLIST_ID",label:"PhotoList"},{value:"PSEUDOCAP_ID",label:"PseudoCAP"},{value:"RGD_ID",label:"RGD"},{value:"SAGALIST_ID",label:"SagaList"},{value:"SGD_ID",label:"SGD"},{value:"SUBTILIST_ID",label:"SubtiList"},{value:"TAIR_ID",label:"TAIR"},{value:"TUBERCULIST_ID",label:"TubercuList"},{value:"WORMBASE_ID",label:"WormBase"},{value:"WORMPEP_ID",label:"WormPep"},{value:"XENBASE_ID",label:"Xenbase"},{value:"ZFIN_ID",label:"ZFIN"}]},{label:"Enzyme and pathway databases",members:[{value:"BIOCYC_ID",label:"BioCyc"},{value:"REACTOME_ID",label:"Reactome"}]},{label:"Gene expression databases",members:[{value:"CLEANEX_ID",label:"CleanEx"},{value:"GERMONLINE_ID",label:"GermOnline"}]},{label:"Other",members:[{value:"DRUGBANK_ID",label:"DrugBank"},{value:"LINKHUB_ID",label:"LinkHub"},{value:"NEXTBIO_ID",label:"NextBio"}]}];
var builderNodes=new Array();var builderNode;var submitNode;var builder;var FieldBuilder=Class.create();
FieldBuilder.prototype={addPart:function(F,C,D){var A=Builder.node("td");builderNodes.push(A);
if(submitNode){C.insertBefore(A,submitNode)}else{C.appendChild(A)}var E=Builder.node("p",{className:"label"},F);
A.appendChild(E);var B=Builder.node("p");A.appendChild(B);D(this,B)},quote:function(A){if(this.id.length>0&&A.indexOf(" ")!=-1){A='"'+A+'"'
}return A},prefix:function(A){if(this.id.length>0&&this.id!="content"&&A.length>0){A=this.getFieldName()+":"+A
}return A},getFieldName:function(){s=this.id;if(s.length>0&&s.indexOf(".")!=-1){s=s.substring(0,s.indexOf("."))
}return s},postprocess:function(A){return A}};var TextFieldBuilder=Class.create();
TextFieldBuilder.prototype={initialize:function(C,A,B){this.id=C;this.label=A;this.size=B?B:41
},render:function(A,B){this.addPart(B?this.label:"Term",A,function(C,D){C.inputElem=document.createElement("input");
C.inputElem.setAttribute("type","text");C.inputElem.setAttribute("size",C.size);D.appendChild(C.inputElem)
})},build:function(){return this.prefix(this.quote(this.inputElem.value))},activate:function(A){this.inputElem.value=A;
this.inputElem.focus()},deactivate:function(){return this.inputElem.value}};Object.extend(TextFieldBuilder.prototype,FieldBuilder.prototype);
var SubQueryTextFieldBuilder=Class.create();SubQueryTextFieldBuilder.prototype={initialize:function(C,A,B){this.id=C;
this.label=A;this.size=B?B:41},render:function(A,B){this.addPart(B?this.label:"Term",A,function(C,D){C.inputElem=document.createElement("input");
C.inputElem.setAttribute("type","text");C.inputElem.setAttribute("size",C.size);D.appendChild(C.inputElem)
})},build:function(){return this.getFieldName()+":("+this.quote(this.inputElem.value)+")"
},activate:function(A){this.inputElem.value=A;this.inputElem.focus()},deactivate:function(){return this.inputElem.value
}};Object.extend(SubQueryTextFieldBuilder.prototype,FieldBuilder.prototype);Http=new Object();
Http.Autocompleter=Class.create();Object.extend(Object.extend(Http.Autocompleter.prototype,Autocompleter.Base.prototype),{initialize:function(B,D,C,A){this.baseInitialize(B,D,A);
this.options.method="get";this.options.asynchronous=true;this.options.indicator="autocomplete-indicator";
this.options.onComplete=this.onComplete.bind(this);this.url_template=C},getUpdatedChoices:function(){this.startIndicator();
var A=encodeURIComponent(this.getToken());new Ajax.Request(this.expand_uri(this.url_template,{query:A}),this.options)
},onComplete:function(A){this.updateChoices(A.responseText)},expand_uri:function(D,G){var F=D.match(/{[^}]+}/g);
if(!F){return D}for(var A=0;A<F.length;A++){var B=/{([^}]+)}/.exec(F[A])[1];var E=G[B];
var C=new RegExp("{"+B+"}");D=D.replace(C,E)}return D}});var AutoCompleteFieldBuilder=Class.create();
AutoCompleteFieldBuilder.prototype={initialize:function(D,A,B,C){this.id=D;this.label=A;
this.namespace=B;this.field=C},render:function(A,B){this.addPart(B?this.label:"Term",A,function(C,E){var D=Builder.node("input",{id:"autocomplete-target",type:"text",size:42});
C.inputElem=D;E.appendChild(C.inputElem);var F=Builder.node("div",{id:"autocomplete-choices"}," ");
$("content").appendChild(F);E.appendChild(Builder.node("span",{style:"position: relative;"},[Builder.node("img",{src:BASE+"images/progress_inactive.gif",alt:"",title:"Ready for auto-completion",style:"position: absolute; left: -20px; top: 0.1em;"}),Builder.node("img",{id:"autocomplete-indicator",src:BASE+"images/progress.gif",alt:"",title:"Running auto-completion...",style:"position: absolute; left: -20px; top: 0.1em; display: none"})]));
new Http.Autocompleter(D,F,BASE+C.namespace+"/?format=hint&limit=100&sort=score&query="+(C.field?C.field+":":"")+"{query}",{minChars:2})
})},build:function(){return this.prefix(this.quote(this.inputElem.value))},activate:function(A){this.inputElem.value=A;
this.inputElem.focus()},deactivate:function(){return this.inputElem.value}};Object.extend(AutoCompleteFieldBuilder.prototype,FieldBuilder.prototype);
var LocalAutoCompleteFieldBuilder=Class.create();LocalAutoCompleteFieldBuilder.prototype={initialize:function(C,A,B){this.id=C;
this.label=A;this.choices=B},render:function(A,B){this.addPart(B?this.label:"Term",A,function(C,D){C.inputElem=Builder.node("input",{id:"autocomplete-target",type:"text",size:42});
D.appendChild(C.inputElem);D.appendChild(Builder.node("div",{id:"autocomplete-choices"}," "));
new Autocompleter.Local("autocomplete-target","autocomplete-choices",C.choices,{minChars:1})
})},build:function(){return this.prefix(this.quote(this.inputElem.value))},activate:function(A){this.inputElem.value=A;
this.inputElem.focus()},deactivate:function(){return this.inputElem.value}};Object.extend(LocalAutoCompleteFieldBuilder.prototype,FieldBuilder.prototype);
var ListFieldBuilder=Class.create();ListFieldBuilder.prototype={initialize:function(D,B,A,C){this.id=D;
this.label=B;this.values=A;this.labels=C},render:function(A,B){this.addPart(B?this.label:"Choose",A,function(C,F){C.selectElem=document.createElement("select");
var E=C.selectElem;for(var D=0;D<C.values.length;++D){if(C.values[D]==null){E=document.createElement("optgroup");
E.setAttribute("label",C.labels[D]);C.selectElem.appendChild(E)}else{addOption(C.values[D],C.labels[D],E)
}}C.selectElem.selectedIndex=0;F.appendChild(C.selectElem)})},build:function(){return this.prefix(this.quote(this.selectElem.value))
}};Object.extend(ListFieldBuilder.prototype,FieldBuilder.prototype);function BooleanFieldBuilder(B,A){return new ListFieldBuilder(B,A,["yes","no"],["yes","no"])
}var RangeFieldBuilder=Class.create();RangeFieldBuilder.prototype={initialize:function(B,A){this.id=B;
this.label=A},render:function(A,B){this.addPart(B?this.label:"From",A,function(C,D){C.fromElem=document.createElement("input");
C.fromElem.setAttribute("type","text");C.fromElem.setAttribute("size","7");D.appendChild(C.fromElem);
D.appendChild(document.createTextNode(" \u2013"))});this.addPart(B?"":"To",A,function(C,D){C.toElem=document.createElement("input");
C.toElem.setAttribute("type","text");C.toElem.setAttribute("size","7");D.appendChild(C.toElem)
})},build:function(){var B=this.fromElem.value.length>0?this.fromElem.value:"*";var A=this.toElem.value.length>0?this.toElem.value:"*";
return(B!="*"||A!="*")?this.prefix("["+B+" TO "+A+"]"):""}};Object.extend(RangeFieldBuilder.prototype,FieldBuilder.prototype);
var DateRangeFieldBuilder=Class.create();DateRangeFieldBuilder.prototype={initialize:function(B,A){this.id=B;
this.label=A},render:function(A,B){builder.label=document.createElement("acronym");
builder.label.setAttribute("onclick","dialog('27')");builder.label.appendChild(document.createTextNode("From"));
this.addPart(B?this.label:builder.label,A,function(D,E){D.fromElem=document.createElement("input");
D.fromElem.setAttribute("type","text");D.fromElem.setAttribute("size","14");var C=new DateBocks({dateBocksElement:D.fromElem});
D.fromElem.onchange=function(){C.magicDate()};D.fromElem.onkeypress=function(F){C.keyObserver(F,"parse");
return C.keyObserver(F,"return")};E.appendChild(D.fromElem)});builder.label=document.createElement("acronym");
builder.label.setAttribute("onclick","dialog('27')");builder.label.appendChild(document.createTextNode("To"));
this.addPart(B?"...":builder.label,A,function(D,E){D.toElem=document.createElement("input");
D.toElem.setAttribute("type","text");D.toElem.setAttribute("size","14");var C=new DateBocks({dateBocksElement:D.toElem});
D.toElem.onchange=function(){C.magicDate()};D.toElem.onkeypress=function(F){C.keyObserver(F,"parse");
return C.keyObserver(F,"return")};E.appendChild(D.toElem)})},build:function(){var B=this.fromElem.value.length>0?this.fromElem.value:"*";
var A=this.toElem.value.length>0?this.toElem.value:"*";return(B!="*"||A!="*")?this.prefix("["+B+" TO "+A+"]"):""
}};Object.extend(DateRangeFieldBuilder.prototype,FieldBuilder.prototype);var MultiFieldBuilder=Class.create();
MultiFieldBuilder.prototype={initialize:function(C,A,B){this.id=C;this.label=A;this.builders=B;
if(arguments.length==4){this.prefixWithField=arguments[3]}else{this.prefixWithField=true
}},render:function(B){for(var A=0;A<this.builders.length;++A){if(this.builders[A]){this.builders[A].render(B,true)
}}},build:function(){var C="";for(var A=0;A<this.builders.length;++A){if(this.builders[A]){var B=this.builders[A].build();
if(B){if(C.length==0){C+=this.getFieldName()+":("}else{C+=" "}C+=B}}}if(C.length>0){C+=")"
}return this.postprocess(C)},activate:function(B){for(var A=0;A<this.builders.length;
++A){if(this.builders[A]&&this.builders[A].activate){this.builders[A].activate(B);
break}}},deactivate:function(){for(var A=0;A<this.builders.length;++A){if(this.builders[A]&&this.builders[A].deactivate){return this.builders[A].deactivate()
}}return""}};Object.extend(MultiFieldBuilder.prototype,FieldBuilder.prototype);var builders={uniprot:[new TextFieldBuilder("content","All"),"",new TextFieldBuilder("name","Protein name [DE]"),new TextFieldBuilder("gene","Gene name [GN]"),new TextFieldBuilder("family","Protein family"),new TextFieldBuilder("domain","Domain"),"",new AutoCompleteFieldBuilder("organism","Organism [OS]","taxonomy","annotated:yes content"),new AutoCompleteFieldBuilder("taxonomy","Taxonomy [OC]","taxonomy"),new AutoCompleteFieldBuilder("host","Virus host [OH]","taxonomy"),new LocalAutoCompleteFieldBuilder("organelle","Organelle [OG]",["Hydrogenosome","Mitochondrion","Nucleomorph","Plasmid","Plastid","Apicoplast","Chloroplast","Organellar chromatophore","Cyanelle","Non-photosynthetic plastid"]),"",new MultiFieldBuilder("annotation.nonpositional","General annotation [CC]",[new ListFieldBuilder("type","Topic",["non-positional","allergen","alternative products","alternative promoter usage","alternative splicing","alternative initiation","ribosomal frameshifting","biophysico*","absorption","kinetics","ph dependence","redox potential","temperature dependence","biotechnology","catalytic activity","caution","cofactor","developmental stage","disease","disruption phenotype","non-positional domain","enzyme regulation","function","induction","mass","miscellaneous","pathway","pharmaceutical","polymorphism","ptm","rna editing","sequence caution","frameshift","erroneous initiation","erroneous termination","erroneous gene model prediction","erroneous translation","miscellaneous discrepancy","similarity","location","subunit","tissue specificity","toxic dose"],["Any","Allergenic properties","Alternative products","  Alternative promoter usage","  Alternative splicing","  Alternative initiation","  Ribosomal frameshifting","Biophysicochemical properties","  Absorption","  Kinetics","  pH dependence","  Redox potential","  Temperature dependence","Biotechnological use","Catalytic activity","Caution","Cofactor","Developmental stage","Involvement in disease","Disruption phenotype","Domain","Enzyme regulation","Function","Induction","Mass spectrometry","Miscellaneous","Pathway","Pharmaceutical use","Polymorphism","Post-translational modification","RNA Editing","Sequence caution","  Frameshift","  Erroneous initiation","  Erroneous termination","  Erroneous gene model prediction","  Erroneous translation","  Miscellaneous discrepancy","Sequence similarities","Subcellular Location","Subunit structure","Tissue specificity","Toxic dose"]),new TextFieldBuilder("content","Term"),new ListFieldBuilder("confidence","Confidence",["","proven","probable","potential","by_similarity"],["Any","Proven","Probable","Potential","By similarity"])]),new MultiFieldBuilder("annotation.positional","Sequence annotation [FT]",[new ListFieldBuilder("type","Topic",["positional","molecule_processing","chain","init_met","peptide","propep","signal","transit","regions","ca_bind","coiled","compbias","dna_bind","positional domain","motif","np_bind","repeat","region","topo_dom","transmem","zn_fing","sites","act_site","metal","binding","site","amino_acid_modifications","crosslnk","disulfid","carbohyd","lipid","mod_res","non_std","natural_variations","variant","var_seq","experimental_info","mutagen","non_cons","non_ter","conflict","unsure","secondary_structure","helix","turn","strand"],[" Any","*Molecule processing"," Chain"," Initiator methionine"," Peptide"," Propeptide"," Signal peptide"," Transit peptide","*Regions"," Calcium binding"," Coiled-coil"," Compositional bias"," DNA binding"," Domain"," Motif"," Nucleotide binding"," Repeat"," Region"," Topological domain"," Transmembrane"," Zinc finger","*Sites"," Active site"," Metal binding"," Binding site"," Other","*Amino acid modifications"," Cross-link"," Disulfide bond"," Glycosylation"," Lipidation"," Modified residue"," Non-standard residue","*Natural variations"," Natural variant"," Alternative sequence","*Experimental info"," Mutagenesis"," Non-adjacent residues"," Non-terminal residue"," Sequence conflict"," Sequence uncertainty","*Secondary structure"," Helix"," Turn"," Beta strand"]),new TextFieldBuilder("content","Term",21),new RangeFieldBuilder("length","Length"),new ListFieldBuilder("confidence","Confidence",["","proven","probable","potential","by_similarity"],["Any","Proven","Probable","Potential","By similarity"])]),Object.extend(new TextFieldBuilder("interactor","Interacts with"),{build:function(){var A=this.inputElem.value.trim();
if(A.toLowerCase=="self"){A="self"}else{if(A.toLowerCase=="xeno"){A="xeno"}else{if(A.match(/EBI-[0-9]+/i)){A=A.toUpperCase()
}else{if(A.match(/[A-Z][0-9][A-Z0-9]{3}[0-9](?:-[0-9+])?/i)){A=A.toUpperCase()}else{A="("+A+")"
}}}}return this.prefix(A)}}),"",new AutoCompleteFieldBuilder("keyword","Keyword [KW]","keywords","name"),new AutoCompleteFieldBuilder("location","Subcellular Location","locations","name"),new AutoCompleteFieldBuilder("go","Gene Ontology (GO)","go"),new AutoCompleteFieldBuilder("ec","Enzyme classification (EC)","enzymes"),new ListFieldBuilder("existence","Protein existence [PE]",["evidence at protein level","evidence at transcript level","inferred from homology","predicted","uncertain"],["Evidence at protein level","Evidence at transcript level","Inferred from homology","Predicted","Uncertain"]),"",new MultiFieldBuilder("citation","Literature citation [R]",[new TextFieldBuilder("content","Title & Abstract",21),new TextFieldBuilder("author","Author",21),new TextFieldBuilder("journal","Journal",21),new TextFieldBuilder("published","Year",4)]),new TextFieldBuilder("scope","Cited for... [RP]"),Object.extend(new MultiFieldBuilder("related","Cross-reference [DR]",[new ListFieldBuilder("database","Database",[null,"embl","ipi","pir","refseq","unigene",null,"pdb","hssp","smr","disprot",null,"dip","intact",null,"merops","peroxibase","pptasedb","rebase","tcdb",null,"glycosuitedb","phosphosite","phossite",null,"swiss-2dpage","2dbase-ecoli","aarhus/ghent-2dpage","anu-2dpage","compluyeast-2dpage","cornea-2dpage","dosac-cobs-2dpage","eco2dbase","hsc-2dpage","ogp","phci-2dpage","pmma-2dpage","rat-heart-2dpage","reproduction-2dpage","siena-2dpage","world-2dpage",null,"peptideatlas","pride","promex",null,"ensembl","genecards","geneid","genomereviews","kegg","tigr","vectorbase",null,"agd","burulist","cgd","cygd","dictybase","echobase","ecogene","euhcvdb","flybase","genedb_spombe","genefarm","gramene","h-invdb","hgnc","hpa","legiolist","leproma","listilist","maizegdb","mim","mgi","mypulist","nmpdr","orphanet","pharmgkb","photolist","pseudocap","rgd","sagalist","sgd","subtilist","tair","tuberculist","wormbase","wormpep","xenbase","zfin",null,"hogenom","hovergen",null,"biocyc","brenda","pathway_interaction_db","reactome",null,"arrayexpress","bgee","cleanex","germonline",null,"hamap","interpro","gene3d","panther","pfam","pirsf","prints","prodom","smart","tigrfams","prosite",null,"bindingdb","drugbank","linkhub","nextbio"],["Sequence databases","EMBL/GenBank/DDBJ","IPI","PIR","RefSeq","UniGene","3D structure databases","PDB/MSD","HSSP","SMR","DisProt","Protein-protein interaction databases","DIP","IntAct","Protein family/group databases","MEROPS","PeroxiBase","PptaseDB","REBASE","TCDB","PTM databases","GlycoSuiteDB","PhosphoSite","PhosSite","2D gel databases","SWISS-2DPAGE","2DBase-Ecoli","Aarhus/Ghent-2DPAGE","ANU-2DPAGE","COMPLUYEAST-2DPAGE","Cornea-2DPAGE","DOSAC-COBS-2DPAGE","ECO2DBASE","HSC-2DPAGE","OGP","PHCI-2DPAGE","PMMA-2DPAGE","Rat-heart-2DPAGE","REPRODUCTION-2DPAGE","Siena-2DPAGE","World-2DPAGE","Proteomic databases","PeptideAtlas","PRIDE","ProMEX","Genome annotation databases","Ensembl","GeneCards","GeneID","GenomeReviews","KEGG","TIGR","VectorBase","Organism-specific databases","AGD","BuruList","CGD","CYGD","dictyBase","EchoBASE","EcoGene","euHCVdb","FlyBase","GeneDB_Spombe","GeneFarm","Gramene","H-InvDB","HGNC","HPA","LegioList","Leproma","ListiList","MaizeGDB","MIM","MGI","MypuList","NMPDR","Orphanet","PharmGKB","PhotoList","PseudoCAP","RGD","SagaList","SGD","SubtiList","TAIR","TubercuList","WormBase","WormPep","Xenbase","ZFIN","Phylogenomic databases","HOGENOM","HOVERGEN","Enzyme and pathway databases","BioCyc","BRENDA","Pathway_Interaction_DB","Reactome","Gene expression databases","ArrayExpress","Bgee","CleanEx","GermOnline","Family and domain databases","HAMAP","InterPro","Gene3D","PANTHER","Pfam","PIRSF","PRINTS","ProDom","SMART","TIGRFAMs","PROSITE","Other","BindingDB","DrugBank","LinkHub","NextBio"]),new TextFieldBuilder("content","Identifier")]),{postprocess:function(A){A=A.replace(/^related:\(/,"").replace(/\)$/,"");
if(A.indexOf(" ")!=-1){A='"'+A.replace(/^database:/,"")+'"'}return A}}),new TextFieldBuilder("web","Web resource"),"",new RangeFieldBuilder("length","Sequence length"),BooleanFieldBuilder("fragment","Fragment (yes/no)"),"",new DateRangeFieldBuilder("created","Date entry integrated"),new DateRangeFieldBuilder("modified","Date entry modified"),new DateRangeFieldBuilder("sequence_modified","Date sequence modified"),"",BooleanFieldBuilder("reviewed","Reviewed (yes/no)"),BooleanFieldBuilder("active","Active (yes/no)"),"",new TextFieldBuilder("key","UniProtKB ID",21),new SubQueryTextFieldBuilder("cluster","UniRef ID",21),new SubQueryTextFieldBuilder("sequence","UniParc ID",21)],uniref:[new TextFieldBuilder("content","All"),"",new TextFieldBuilder("name","Cluster name"),new AutoCompleteFieldBuilder("taxonomy","Taxonomy","taxonomy"),new ListFieldBuilder("identity","Sequence identity",["1.0","0.9","0.5"],["100%","90%","50%"]),new RangeFieldBuilder("count","Cluster size"),new RangeFieldBuilder("length","Sequence length"),new DateRangeFieldBuilder("published","Date published"),"",new TextFieldBuilder("key","UniRef ID",21),new TextFieldBuilder("member","UniProtKB ID/AC",21),new TextFieldBuilder("member","UniParc ID",21)],uniparc:[new TextFieldBuilder("content","All"),"",new ListFieldBuilder("database","Database",["embl-cds","emblwgs","embl_anncon","embl_tpa","ensembl","epo","flybase","h_inv","ipi","jpo","pdb","pir","pirarc","prf","refseq","remtrembl","sgd","tair_arabidopsis","tremblnew","trome","unimes","uniprot","isoforms","uspto","vega","wormbase"],["EMBL CDS","EMBL Whole genome Shotgun (WGS)","EMBL Annotated CONs","EMBL Third Party Annotation (TPA)","Ensembl","European Patent Office (EPO)","FlyBase","H-Invitational Database (H-InvDB)","International Protein Index (IPI)","Japan Patent Office (JPO)","PDB","PIR-PSD","PIR-PSD Archive","Protein Research Foundation (PRF)","RefSeq","REM-TrEMBL","Saccharomyces Genome Database (SGD)","Arabidopsis Information Resource (TAIR)","TrEMBLnew","TROME","UniProt Metagenomic and Environmental Sequences (UniMES)","UniProt Knowledgebase (UniProtKB)","UniProtKB Protein Isoforms","US Patent Office (USPTO)","Vega","WormBase"]),new AutoCompleteFieldBuilder("taxonomy","Taxonomy","taxonomy"),new TextFieldBuilder("checksum","Checksum (CRC64/MD5)",42),"",new TextFieldBuilder("key","UniParc ID",21),new TextFieldBuilder("uniprot","UniProtKB AC",21),new TextFieldBuilder("isoform","UniProtKB isoform ID",21),new SubQueryTextFieldBuilder("cluster","UniRef ID",21)],taxonomy:[new TextFieldBuilder("content","All"),"",new TextFieldBuilder("scientific","Scientific name"),new TextFieldBuilder("common","Common name"),new TextFieldBuilder("mnemonic","Mnemonic (organism code)"),"",new ListFieldBuilder("rank","Rank",["superkingdom","kingdom","subkingdom","superphylum","phylum","subphylum","superclass","class","subclass","infraclass","superorder","order","suborder","infraorder","parvorder","superfamily","family","subfamily","tribe","subtribe","genus","subgenus","species_group","species_subgroup","species","subspecies","varietas","forma","none"],["Superkingdom","Kingdom","Subkingdom","Superphylum","Phylum","Subphylum","Superclass","Class","Subclass","Infraclass","Superorder","Order","Suborder","Infraorder","Parvorder","Superfamily","Family","Subfamily","Tribe","Subtribe","Genus","Subgenus","Species group","Species subgroup","Species","Subspecies","Varietas","Forma","None"]),new TextFieldBuilder("strain","Strain"),new AutoCompleteFieldBuilder("host","Virus host","taxonomy"),BooleanFieldBuilder("complete","Complete proteome (yes/no)"),BooleanFieldBuilder("linked","External info (yes/no)"),"",new TextFieldBuilder("key","Taxon ID",21)],keywords:[new TextFieldBuilder("content","All"),"",new AutoCompleteFieldBuilder("name","Name","keywords","name"),"",new TextFieldBuilder("key","Keyword AC",21)],locations:[new TextFieldBuilder("content","All"),"",new AutoCompleteFieldBuilder("name","Name","locations","name"),,"",new TextFieldBuilder("key","Location AC",21)],tissues:[new TextFieldBuilder("content","All"),"",new TextFieldBuilder("name","Name"),"",new TextFieldBuilder("key","Tissue AC",21),new TextFieldBuilder("evoc","eVoc ID",21)],citations:[new TextFieldBuilder("content","All"),"",new TextFieldBuilder("title","Title"),new TextFieldBuilder("author","Author",21),new TextFieldBuilder("journal","Journal",21),new TextFieldBuilder("published","Year published",4),"",new TextFieldBuilder("key","PubMed ID",21),new TextFieldBuilder("doi","DOI")],news:[new TextFieldBuilder("content","All"),"",new DateRangeFieldBuilder("published","Date published")],docs:[new TextFieldBuilder("content","All"),"",new DateRangeFieldBuilder("published","Date published"),"",new TextFieldBuilder("uniprot","UniProtKB AC",21)],help:[new TextFieldBuilder("content","All"),"",new DateRangeFieldBuilder("published","Date published"),new ListFieldBuilder("category","Category",["background","services","website"],["Background","Services","Website"])],faq:[new TextFieldBuilder("content","All"),"",new DateRangeFieldBuilder("published","Date published")],manual:[new TextFieldBuilder("content","All"),"",new DateRangeFieldBuilder("published","Date published")]};
function showBuilder(){var G=document.forms["search-form"].elements.dataset.value;
var K=$("query-builder-container");var A=Builder.node("form",{action:"#",onsubmit:"addConstraint(); return false"});
K.appendChild(A);var L=Builder.node("table",{id:"query-builder"});var I=Builder.node("tbody");
L.appendChild(I);var B=Builder.node("tr");I.appendChild(B);builderNode=B;addOperatorSelector(B,getQueryField().value.length==0);
var F=Builder.node("td");B.appendChild(F);var E=Builder.node("p",{className:"label"},"Field");
F.appendChild(E);var D=document.createElement("p");F.appendChild(D);var C=Builder.node("select",{onchange:"showField('"+G+"', this.value)"});
D.appendChild(C);var J=builders[G];for(var H=0;H<J.length;++H){if(J[H]){C.appendChild(Builder.node("option",{value:J[H].id},J[H].label))
}else{C.appendChild(Builder.node("option",{disabled:"disabled"},"--"))}}C.selectedIndex=0;
showField(G,J[0].id);showBuilderSubmit(B);Form.disable(document.forms["search-form"]);
A.appendChild(L)}function addOperatorSelector(D,F){var A=document.createElement("td");
D.appendChild(A);var E=Builder.node("p",{className:"invisible-label"},"...");A.appendChild(E);
var C=Builder.node("p");A.appendChild(C);var B=Builder.node("select",{id:"query-builder-op"});
C.appendChild(B);if(F){addOption("","",B);addOption("NOT","NOT",B)}else{addOption("AND","AND",B);
addOption("NOT","NOT",B);addOption("OR","OR",B)}B.selectedIndex=0}function addOption(D,B,C){var A={value:D};
if(B.charAt(0)=="*"){B=B.substr(1);A.className="topitem"}else{if(B.charAt(0)==" "){B=B.substr(1);
A.className="subitem"}}C.appendChild(Builder.node("option",A,B))}function showBuilderSubmit(D){var A=Builder.node("td");
D.appendChild(A);submitNode=A;A.appendChild(Builder.node("p",{className:"invisible-label"},"..."));
var C=Builder.node("p",{style:"white-space: nowrap"});A.appendChild(C);C.appendChild(Builder.node("input",{type:"submit",value:"Add & Search"}));
C.appendChild(document.createTextNode(" "));C.appendChild(Builder.node("input",{type:"button",value:"Cancel",onclick:"closeConstraint()"}));
var B=Builder.node("td",{className:"full-width"});D.appendChild(B)}function showField(E,D){while(builderNodes.length>0){var C=builderNodes.pop();
if(C.remove){C.remove()}else{C.parentNode.removeChild(C)}}var F=builders[E];for(var B=0;
B<F.length;++B){if(F[B].id==D){F[B].render(builderNode);var A="";if(builder&&builder.deactivate){A=builder.deactivate()
}builder=F[B];if(builder.activate){builder.activate(A)}break}}}function addConstraint(){var B=builder.build();
if(B){var A=getQueryField();var C=$("query-builder-op");if(C.value){if(isPrecedenceAffected(A.value,C.value)){A.value="("+A.value+")"
}A.value+=" "+C.value+" "}A.value+=B;closeConstraint();if(!isShiftPressed()){document.forms["search-form"].submit()
}}}function isPrecedenceAffected(B,A){return A=="AND"&&B.match(/ OR /i)||A=="NOT"&&B.match(/ OR /i)||A=="OR"&&B.match(/ (AND|NOT) /i)
}function closeConstraint(B){builderNodes.clear();builderNode=null;submitNode=null;
builder=null;$("query-builder").remove();$("query-builder-link").show();Form.enable(document.forms["search-form"]);
var A=getQueryField();A.focus()}function getQueryField(){return document.forms["search-form"].elements.query
}function filter(B){var A=getQueryField();if(A.value){A.value+=" AND "}A.value+=B;
document.forms["search-form"].submit()}function updateFrom(){if(isUniProtKB("map-to")==false){document.getElementById("map-from").options[0].selected=true
}}function updateTo(){if(isUniProtKB("map-from")==false){document.getElementById("map-to").options[0].selected=true
}}function isUniProtKB(A){if(document.getElementById(A).options[document.getElementById(A).selectedIndex].value=="ACC+ID"||document.getElementById(A).options[document.getElementById(A).selectedIndex].value=="ACC"||document.getElementById(A).options[document.getElementById(A).selectedIndex].value=="ID"){return true
}return false}function swapSelection(C,A){var D=$(C).selectedIndex;var B=$(A).selectedIndex;
if(D>0){D+=1}if(B>1){B-=1}$(C).selectedIndex=B;$(A).selectedIndex=D}function focusSearch(A){showOne("searchbar",A,$("searchbar"),"div")
}function focusQuery(A){document.forms[A].elements.query.focus()}function showOne(B,E,C){var D=document.getElementsByClassName(B,C);
for(var A=0;A<D.length;++A){setVisible(D[A],D[A].id==E)}}function addComplexColumns(I,F){var B=$(I).childNodes;
var H=$(F);for(z=0;z<B.length;z++){var A=B[z].value;var D=B[z];var E=I.substr(0,I.length-7);
if(D.checked){var G=false;for(j=0;j<H.options.length;j++){if(H.options[j].value===E+"("+A+")"){G=true
}}if(!G){var C=new Option(E+"("+A+")",E+"("+A+")");H.options[H.length]=C;H.selectedIndex=H.options.length-1
}}else{removeDoubleAddedComplexOption(H,E+"("+A+")")}}}var moveToList=function moveToList(G,F){var E=$(G);
var C=$(F);for(var A=0;A<E.options.length;++A){var D=E.options[A];var B=new Option(D.text,D.value);
if(D.selected&&D.value!="id"&&D.className!=="complex"){C.options[C.length]=B;E.options[A]=null;
--A;C.selectedIndex=C.options.length-1}if(D.selected&&D.value!="id"&&D.className==="complex"){toggleBetweenAllAndComplex(D.value)
}C.focus(D)}};var toggleBetweenAllAndComplex=function toggleBetweenAllAndComplex(A){document.getElementById("hiddenColumns").toggle();
document.getElementById("customize-show").toggle();document.getElementById(A+"Options").toggle();
document.getElementById(A+"Add").toggle()};function copyNonComplexToList(G,F){var E=$(G);
var C=$(F);for(var A=0;A<E.options.length;++A){var D=E.options[A];if(D.selected&&D.value!="id"&&D.value.indexOf("(",0)==-1){var B=new Option(D.text,D.value);
C.options[C.length]=B;E.options[A]=null;--A;C.selectedIndex=C.options.length-1}else{if(D.selected&&D.value!="id"){E.options[A]=null;
--A}}hideAllComplexOptions();C.focus()}}function hideAllComplexOptions(){var B=document.getElementById("complexConfiguration");
for(var A=0;A<B.length;++A){B[A].hide()}}function moveUp(E){var C=$(E);for(var A=1;
A<C.options.length;++A){var D=C.options[A];var B=C.options[A-1];if(D.selected&&!B.selected){swap(D,B)
}}}function moveDown(E){var C=$(E);for(var A=C.options.length-2;A>=0;--A){var D=C.options[A];
var B=C.options[A+1];if(D.selected&&!B.selected){swap(B,D)}}}function swap(B,A){B.parentNode.insertBefore(B,A)
}function saveConfiguration(C){var B=listColumns("visibleColumns");if(B){save(C+"-columns",B,C.split("-")[0])
}var A=getSelectedOption("set-limit");if(A){save("limit",A)}}function listColumns(D){var B=$(D);
var C;if(B){C="id";for(var A=0;A<B.options.length;++A){C+=","+B.options[A].value}}return C
}function getSelectedOption(B){var A=$(B);if(A){return A.options[A.selectedIndex].value
}}function resetConfiguration(A){deleteCookie(A+"-columns",A.split("-")[0]);deleteCookie("limit")
}function removeDoubleAddedComplexOption(A,B){for(j=0;j<A.options.length;j++){if(A.options[j].value===B){A.options[j].remove()
}}}function formatInterval(E){var F="";var H=Math.floor(E/1000%60);var D=Math.floor(E/(1000*60)%60);
var C=Math.floor(E/(1000*60*60));if(H+D+C>0){var B=0;var A=0;var G="";if(C>0){B=C;
A=D;G="h"}else{if(D>0){B=D;A=H;G="min"}else{if(H>0){B=H;G="s"}}}if(B>0){F+=B}if(A>0){F+=":";
if(A<10){F+="0"}F+=A}F=" for "+F+G}return F}var hiddenSections=[];function setToggle(A,B,C){A.toggle();
visible=!hiddenSections.contains(A.id);if(A.id){if(!visible){hiddenSections.remove(A.id)
}else{hiddenSections.push(A.id)}if(hiddenSections.length>0){save("sections-hide",hiddenSections.join(" "),"uniprot")
}else{deleteCookie("sections-hide","uniprot")}if(C){setToggleText(C,!visible)}}}function setToggleText(A,B){A.innerHTML=B?"Hide":"Show"
}function initHideSections(){var A=load("sections-hide");if(A){hiddenSections=A.split(" ");
refreshSections()}else{if(hiddenSections.length>0){hiddenSections.clear();refreshSections()
}}}function initOrderSections(){var C=load("sections-order");if(C){var E=C.split(" ");
var B=$("sections");for(var A=E.length-1;A>-1;--A){var D=B.removeChild($(E[A]));if(D){B.insertBefore(D,B.firstChild)
}}}}function refreshSections(){var D=document.getElementsByClassName("nice-content");
for(var B=0;B<D.length;++B){var C=!hiddenSections.contains(D[B].id);setVisible(D[B],C);
var A=$("toggle-"+D[B].id);if(A){A.innerHTML=C?"Hide":"Show"}}}function initLink(C){var B=load(C+"-target");
if(B){configuredLinks[C]=B;var A=$(C+"-target-selector");if(A){for(var D=0;D<A.options.length;
++D){A.options[D].selected=A.options[D].value.toLowerCase()==B}}}}function clickAll(B){for(var A=0;
A<B.length;A++){B[A].click()}}function switchAllNone(){if(document.getElementById("all_none").innerHTML=="All"){document.getElementById("all_none").innerHTML="None"
}else{document.getElementById("all_none").innerHTML="All"}}function toggleClasses(D,F){var E=document.getElementsByClassName(D);
for(var C=0;E.length>C;++C){E[C].show()}var B=document.getElementsByClassName(F);
for(var A=0;B.length>A;++A){B[A].hide()}};