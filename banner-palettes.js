/* Shared, curated output palettes for both makers. No random colors or uploads. */
(function () {
  'use strict';
  var palettes = {
    navy: {name:'Blue',bg:'#00467F',ink:'#FFFFFF',trim:'#E7A614',sub:'#FFFFFF',text:'#00467F',dark:'#011D41'},
    gold: {name:'Gold',bg:'#E7A614',ink:'#011D41',trim:'#011D41',sub:'#011D41',text:'#00467F',dark:'#011D41'},
    lagoon: {name:'Lagoon',bg:'#086568',ink:'#FFFFFF',trim:'#F4CB63',sub:'#FFFFFF',text:'#086568',dark:'#063E40'},
    plum: {name:'Plum',bg:'#623B77',ink:'#FFFFFF',trim:'#F5BC80',sub:'#FFFFFF',text:'#623B77',dark:'#412653'},
    coral: {name:'Coral',bg:'#A33948',ink:'#FFFFFF',trim:'#FFD4B5',sub:'#FFFFFF',text:'#A33948',dark:'#591E2A'},
    forest: {name:'Forest',bg:'#285B47',ink:'#FFFFFF',trim:'#EBC56D',sub:'#FFFFFF',text:'#285B47',dark:'#193E2F'}
  };
  var mode='navy', studio='lagoon';
  function current() { return palettes[mode==='studio'?studio:mode]; }
  function paint() {
    ['navy','gold','studio'].forEach(function(name){document.getElementById('color-'+name).setAttribute('aria-pressed',String(mode===name));});
    document.getElementById('studio-palettes').hidden=mode!=='studio';
    ['lagoon','plum','coral','forest'].forEach(function(name){document.getElementById('palette-'+name).setAttribute('aria-pressed',String(studio===name));});
    document.getElementById('palette-status').textContent='Selected palette: '+current().name+'.';
  }
  window.BannerPalette={
    current:current,
    bind:function(refresh){
      ['navy','gold','studio'].forEach(function(name){document.getElementById('color-'+name).addEventListener('click',function(){mode=name;paint();refresh();});});
      ['lagoon','plum','coral','forest'].forEach(function(name){document.getElementById('palette-'+name).addEventListener('click',function(){studio=name;paint();refresh();});});
      paint();
    },
    onAccent:function(){
      var h=current().trim.slice(1),r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);
      return r*.299+g*.587+b*.114>150?'#18212B':'#FFFFFF';
    }
  };
}());
