/* Module icons are drawn locally in the browser. Exported PNGs contain no external images. */
(function () {
  'use strict';
  var styles=['circle','badge','square','outline'], style='circle', base=512;
  var el=function(id){return document.getElementById(id);};
  function values(){return {number:el('icon-number').value.trim(),label:el('icon-label').value.trim()};}
  function alt(){var v=values();return [v.label,v.number].filter(Boolean).join(' ');}
  function filename(){return (alt().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'module')+'-'+style+'.png';}
  function circle(ctx,x,y,r,fill,stroke,width){
    ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.lineWidth=width;ctx.strokeStyle=stroke;ctx.stroke();}
  }
  function rounded(ctx,x,y,w,h,r,fill,stroke,width){
    ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}
  }
  function text(ctx,value,x,y,maxW,maxH,color,size,weight){
    if(!value)return;
    var m;
    do{
      ctx.font=weight+' '+size+'px Arial, Helvetica, sans-serif';m=ctx.measureText(value);
      if(m.width<=maxW && m.actualBoundingBoxAscent+m.actualBoundingBoxDescent<=maxH)break;
      size--;
    }while(size>5);
    ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='alphabetic';
    ctx.fillText(value,x,y+(m.actualBoundingBoxAscent-m.actualBoundingBoxDescent)/2);
  }
  function render(which,size){
    var cv=document.createElement('canvas');cv.width=size;cv.height=size;
    var ctx=cv.getContext('2d');ctx.scale(size/base,size/base);
    if(el('white-bg').checked){ctx.fillStyle='#FFFFFF';ctx.fillRect(0,0,base,base);}
    var p=window.BannerPalette.current(),v=values(),n=v.number||'?',label=v.label.toUpperCase();
    if(which==='circle'){
      circle(ctx,256,256,240,p.bg);
      circle(ctx,256,256,216,null,p.trim,18);
      text(ctx,n,256,256,330,270,p.ink,292,700);
    }else if(which==='badge'){
      circle(ctx,256,240,220,p.dark);
      circle(ctx,256,240,208,p.trim);
      circle(ctx,256,240,169,p.bg);
      text(ctx,n,256,label?220:240,260,label?210:250,p.ink,label?238:268,700);
      if(label){
        rounded(ctx,22,350,468,102,10,'#FFFFFF',p.dark,8);
        text(ctx,label,256,400,428,66,p.text,64,700);
      }
    }else if(which==='square'){
      rounded(ctx,20,20,472,472,70,p.bg);
      rounded(ctx,37,37,438,438,55,p.bg,p.trim,7);
      if(label)text(ctx,label,256,110,380,42,p.ink,40,700);
      text(ctx,n,256,label?286:256,344,label?220:285,p.ink,label?240:292,700);
      ctx.fillStyle=p.trim;ctx.fillRect(211,430,90,6);
    }else{
      circle(ctx,256,256,230,'#FFFFFF',p.text,8);
      circle(ctx,256,256,211,null,p.trim,7);
      text(ctx,n,256,label?225:256,310,label?230:275,p.text,label?248:292,700);
      if(label){
        ctx.fillStyle=p.trim;ctx.fillRect(211,364,90,5);
        text(ctx,label,256,407,260,32,p.text,34,700);
      }
    }
    return cv;
  }
  function refresh(){
    var v=values(),size=Number(el('icon-size').value),canvas=render(style,size);
    el('preview').src=canvas.toDataURL('image/png');
    el('preview').alt='Preview: '+(v.number?alt():'add a module number');
    el('meta').textContent=size+' × '+size+' px · '+filename()+' · '+(el('white-bg').checked?'white background':'transparent background');
    styles.forEach(function(name){
      el('thumb-'+name).src=render(name,128).toDataURL('image/png');
      el('style-'+name).setAttribute('aria-pressed',String(style===name));
    });
    el('alt-text').textContent=v.number?alt():'(add a number or short text)';
    el('download').disabled=!v.number;
    el('copy-alt').disabled=!v.number;
  }
  styles.forEach(function(name){el('style-'+name).addEventListener('click',function(){style=name;refresh();});});
  ['icon-number','icon-label'].forEach(function(id){el(id).addEventListener('input',refresh);});
  ['icon-size','white-bg'].forEach(function(id){el(id).addEventListener('change',refresh);});
  el('download').addEventListener('click',function(){
    if(!values().number)return;
    var name=filename();
    render(style,Number(el('icon-size').value)).toBlob(function(blob){
      if(!blob){el('status').textContent='The image could not be created. Try again.';return;}
      var url=URL.createObjectURL(blob),a=document.createElement('a');
      a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
      setTimeout(function(){URL.revokeObjectURL(url);},4000);
      el('status').textContent='Downloaded '+name+'. Change the number to make the next icon in your set.';
    },'image/png');
  });
  el('copy-alt').addEventListener('click',function(){
    function select(){
      var range=document.createRange();range.selectNodeContents(el('alt-text'));
      var selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
      el('status').textContent='Alt text selected. Use your device’s Copy command.';
    }
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(alt()).then(function(){el('status').textContent='Alt text copied.';},select);
    }else select();
  });
  window.BannerPalette.bind(refresh);refresh();
  window.moduleIconDebug={render:render};
}());
