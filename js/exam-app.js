/* =========================================================================
   共通テスト対策キット — アプリ本体
   ・保存キーは 'gvexam.v1'。通常版/Pro版（'glassvocab.v1'）とは完全に独立。
     ここでの学習履歴・採点結果は本編のXP・レベル・SRSに一切影響しません。
   ・購入権利（owned）だけは Pro版のストアが 'gvexam.v1' に書き込みます。
   ========================================================================= */
(function(){
  'use strict';

  /* ---------------------------------------------------------------
     0. 基本ユーティリティ
     --------------------------------------------------------------- */
  var KEY = 'gvexam.v1';
  var K = window.EXAM_KIT;
  var $ = function(id){ return document.getElementById(id); };
  function esc(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function clone(o){ return JSON.parse(JSON.stringify(o)); }
  function merge(base, add){
    var out = clone(base), k;
    for(k in add){
      if(!Object.prototype.hasOwnProperty.call(add,k)) continue;
      if(add[k] && typeof add[k]==='object' && !Array.isArray(add[k]) && out[k] && typeof out[k]==='object'){
        out[k] = merge(out[k], add[k]);
      }else if(add[k]!==undefined && add[k]!==null){
        out[k] = add[k];
      }
    }
    return out;
  }

  /* ---------------------------------------------------------------
     1. 保存データ（独立ストア）
     --------------------------------------------------------------- */
  var DEF = {
    owned:false, order:null, at:0, price:(K&&K.meta?K.meta.price:560),
    progress:{},          /* 長文ごと: { ans:{ itemId:{p,ok,at} }, done, score, at, tries } */
    marks:{},             /* 見直しマーク: { itemId:true } */
    known:{},             /* 語彙シートの「覚えた」: { word:true } */
    settings:{ timer:false, autoTrans:false, fs:1, reduceMotion:false, haptics:true },
    stats:{ attempts:0, best:0, lastAt:0 }
  };
  var S = clone(DEF);
  function load(){
    try{
      var raw = localStorage.getItem(KEY);
      if(raw) S = merge(DEF, JSON.parse(raw) || {});
    }catch(e){ S = clone(DEF); }
  }
  function save(){
    try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){}
  }

  /* ---------------------------------------------------------------
     2. アイコン（インラインSVG）
     --------------------------------------------------------------- */
  var ICONS = {
    lock:'<rect x="5.5" y="10.5" width="13" height="9.5" rx="2.6"/><path d="M8.5 10.5V8a3.5 3.5 0 017 0v2.5"/>',
    book:'<path d="M5 5h8a3 3 0 013 3v11H8a3 3 0 01-3-3z"/><path d="M16 8h3v11H8"/>',
    doc:'<path d="M7 4h7l4 4v12H7z"/><path d="M13.5 4v4.5H18"/><path d="M10 13h5M10 16h5"/>',
    pen:'<path d="M5 19h4l9.5-9.5a2.1 2.1 0 00-3-3L6 16z"/><path d="M14.5 7.5l2 2"/>',
    check:'<path d="M5 13l4.5 4.5L19 7"/>',
    x:'<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    flag:'<path d="M7 4v16"/><path d="M7 5h10l-2 3.5L17 12H7z"/>',
    speak:'<path d="M5 10v4h3l4 3.5v-11L8 10z"/><path d="M15.5 9.5a4 4 0 010 5"/><path d="M17.8 7.2a7 7 0 010 9.6"/>',
    gear:'<circle cx="12" cy="12" r="3.2"/><path d="M12 4.6v2M12 17.4v2M4.6 12h2M17.4 12h2M6.9 6.9l1.4 1.4M15.7 15.7l1.4 1.4M17.1 6.9l-1.4 1.4M8.3 15.7l-1.4 1.4"/>',
    back:'<path d="M15 5l-7 7 7 7"/>',
    fwd:'<path d="M9 5l7 7-7 7"/>',
    up:'<path d="M12 19V6"/><path d="M6.5 11.5L12 6l5.5 5.5"/>',
    search:'<circle cx="11" cy="11" r="6"/><path d="M15.5 15.5L20 20"/>',
    home:'<path d="M4 11.5L12 5l8 6.5V20H4z"/>',
    chart:'<path d="M5 19V9M12 19V5M19 19v-7"/>',
    time:'<circle cx="12" cy="12" r="7.5"/><path d="M12 8v4.4l3 1.8"/>',
    info:'<circle cx="12" cy="12" r="7.5"/><path d="M12 11v5M12 8.2v.6"/>',
    bag:'<path d="M6 8h12l-1 11H7z"/><path d="M9.5 8V6.6a2.5 2.5 0 015 0V8"/>',
    reset:'<path d="M19 12a7 7 0 11-3-5.7"/><path d="M19 4.5V9h-4.5"/>'
  };
  function icon(n, cls){
    return '<svg class="'+(cls||'')+'" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(ICONS[n]||'')+'</svg>';
  }

  /* ---------------------------------------------------------------
     3. モーション・触覚・読み上げ
     --------------------------------------------------------------- */
  function motionOK(){
    var mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    return !(mq && mq.matches) && !S.settings.reduceMotion;
  }
  function applyMotion(){
    document.documentElement.classList.toggle('nomotion', !motionOK());
    document.documentElement.style.setProperty('--fs', String(S.settings.fs || 1));
  }
  function haptic(ms){
    if(!S.settings.haptics) return;
    try{ if(navigator.vibrate) navigator.vibrate(ms); }catch(e){}
  }
  function speak(text){
    try{
      if(!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US'; u.rate = 0.92;
      window.speechSynthesis.speak(u);
    }catch(e){}
  }
  function toast(msg, ic){
    var wrap = $('toast');
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = icon(ic||'check') + '<span>'+esc(msg)+'</span>';
    wrap.appendChild(el);
    setTimeout(function(){ el.remove(); }, 2400);
  }

  /* ---------------------------------------------------------------
     4. データの平坦化（小問リスト）
     --------------------------------------------------------------- */
  var P_BY_ID = {}, ITEMS = {}, FLAT = {};
  (function build(){
    K.passages.forEach(function(p){
      P_BY_ID[p.id] = p;
      var list = [];
      p.qs.forEach(function(q, qi){
        q.items.forEach(function(it, ii){
          var rec = {
            it: it, q: q, p: p,
            no: q.no, field: q.field,
            label: q.no + (q.items.length>1 ? '（'+(ii+1)+'）' : ''),
            idx: list.length
          };
          list.push(rec);
          ITEMS[it.id] = rec;
        });
      });
      FLAT[p.id] = list;
    });
  })();
  function totalPoints(){
    var t = 0;
    K.passages.forEach(function(p){ FLAT[p.id].forEach(function(r){ t += r.it.pt; }); });
    return t;
  }
  var TOTAL_PT = totalPoints();

  function prog(pid){
    if(!S.progress[pid]) S.progress[pid] = { ans:{}, done:false, score:0, at:0, tries:0 };
    if(!S.progress[pid].ans) S.progress[pid].ans = {};
    return S.progress[pid];
  }
  function scoreOf(pid){
    var pr = prog(pid), s = 0;
    FLAT[pid].forEach(function(r){
      var a = pr.ans[r.it.id];
      if(a && a.ok) s += r.it.pt;
    });
    return s;
  }
  function maxOf(pid){
    var s = 0; FLAT[pid].forEach(function(r){ s += r.it.pt; }); return s;
  }
  function answeredOf(pid){
    var pr = prog(pid), n = 0;
    FLAT[pid].forEach(function(r){ if(pr.ans[r.it.id]) n++; });
    return n;
  }
  function kitScore(){
    var s = 0; K.passages.forEach(function(p){ s += scoreOf(p.id); }); return s;
  }
  function kitAnswered(){
    var n = 0; K.passages.forEach(function(p){ n += answeredOf(p.id); }); return n;
  }

  /* ---------------------------------------------------------------
     5. 画面遷移（View Transitions API 対応環境ではなめらかに）
     --------------------------------------------------------------- */
  var VIEWS = ['top','read','quiz','result','vocab','gram'];
  var view = 'top';
  function swap(fn){
    if(document.startViewTransition && motionOK()){
      try{ document.startViewTransition(fn); return; }catch(e){}
    }
    fn();
  }
  function nav(v, arg){
    swap(function(){
      view = v;
      VIEWS.forEach(function(x){ var el=$('v-'+x); if(el) el.hidden = (x!==v); });
      if(v==='top') renderTop();
      if(v==='read') renderRead(arg);
      if(v==='quiz') renderQuiz();
      if(v==='result') renderResult(arg);
      if(v==='vocab') renderVocab();
      if(v==='gram') renderGram();
      $('stage').scrollTop = 0;
      renderBar();
    });
  }

  /* ---------------------------------------------------------------
     6. ヘッダー（レール・タイマー）
     --------------------------------------------------------------- */
  var cur = { pid:null, i:0, only:null };   /* only: 復習対象のitem id配列 */
  var timer = { on:false, left:0, iv:null };

  function renderBar(){
    var right = '';
    if(S.settings.timer && (view==='read'||view==='quiz') && cur.pid){
      var m = Math.floor(Math.max(0,timer.left)/60), s = Math.max(0,timer.left)%60;
      right = '<span class="timer'+(timer.left<=0?' over':'')+'" id="timerBox">'+
        (timer.left<=0?'目安時間':(m+':'+('0'+s).slice(-2)))+'</span>';
    }
    var titleMain = '共通テスト対策キット';
    var titleSub  = K.meta.sub + ' ・ 独立保存';
    if(cur.pid && (view==='read'||view==='quiz'||view==='result')){
      titleMain = P_BY_ID[cur.pid].titleJa;
      titleSub  = P_BY_ID[cur.pid].tag + ' ・ ' + P_BY_ID[cur.pid].kind;
    }
    $('barTop').innerHTML =
      (view==='top'
        ? '<span class="brand"><span class="seal">共通</span><span style="min-width:0"><b>'+esc(titleMain)+'</b><small>'+esc(titleSub)+'</small></span></span>'
        : '<button class="hbtn" id="barBack" aria-label="戻る">'+icon('back')+'</button>'+
          '<span class="brand" style="margin-left:2px"><span style="min-width:0"><b>'+esc(titleMain)+'</b><small>'+esc(titleSub)+'</small></span></span>') +
      right +
      '<button class="hbtn" id="barSet" aria-label="設定">'+icon('gear')+'</button>';

    if($('barBack')) $('barBack').addEventListener('click', function(){
      if(view==='quiz') nav('read', cur.pid); else nav('top');
    });
    $('barSet').addEventListener('click', openSettings);

    /* レール（現在の長文の小問状態） */
    var rail = $('barRail');
    if(cur.pid && (view==='read'||view==='quiz'||view==='result')){
      var pr = prog(cur.pid), list = activeList();
      rail.hidden = false;
      rail.innerHTML =
        '<div class="rail">'+ list.map(function(r,i){
          var a = pr.ans[r.it.id];
          var c = a ? (a.ok?'ok':'ng') : (S.marks[r.it.id]?'mk':'');
          if(view==='quiz' && i===cur.i) c = 'now';
          return '<i class="'+c+'"></i>';
        }).join('') + '</div>'+
        '<div class="rail-meta"><span>'+esc(P_BY_ID[cur.pid].title.slice(0,26))+'</span>'+
        '<span>'+answeredOf(cur.pid)+' / '+FLAT[cur.pid].length+' 小問 ・ '+scoreOf(cur.pid)+'/'+maxOf(cur.pid)+'点</span></div>';
    }else{
      rail.hidden = true;
      rail.innerHTML = '';
    }
  }

  function activeList(){
    var list = FLAT[cur.pid] || [];
    if(cur.only && cur.only.length){
      return list.filter(function(r){ return cur.only.indexOf(r.it.id)>=0; });
    }
    return list;
  }

  function startTimer(mins){
    stopTimer();
    timer.left = Math.round(mins*60);
    if(!S.settings.timer) return;
    timer.iv = setInterval(function(){
      timer.left--;
      var box = $('timerBox');
      if(box){
        var m = Math.floor(Math.max(0,timer.left)/60), s = Math.max(0,timer.left)%60;
        box.textContent = timer.left<=0 ? '目安時間' : (m+':'+('0'+s).slice(-2));
        box.className = 'timer' + (timer.left<=0?' over':'');
      }
      if(timer.left===0){ toast('目安時間です。急がず続けて大丈夫です。','time'); stopTimer(); }
    }, 1000);
  }
  function stopTimer(){ if(timer.iv){ clearInterval(timer.iv); timer.iv=null; } }

  /* ---------------------------------------------------------------
     7. トップ（キット表紙）
     --------------------------------------------------------------- */
  function renderTop(){
    cur.pid = null; cur.only = null; stopTimer();
    var sc = kitScore(), ans = kitAnswered();
    var pct = TOTAL_PT ? Math.round(sc/TOTAL_PT*100) : 0;

    var cover =
      '<section class="cover">'+
        '<div class="kicker">GLASS VOCAB / EXAM KIT</div>'+
        '<h1>'+esc(K.meta.name)+'</h1>'+
        '<p>'+esc(K.meta.sub)+' ・ 長文'+K.meta.passages+'本 / 全'+K.meta.qs+'問 / 小問'+K.meta.items+' ・ '+K.meta.total+'点</p>'+
        '<div class="nums">'+
          '<div><b>'+sc+'</b><span>現在の得点</span></div>'+
          '<div><b>'+ans+'/'+K.meta.items+'</b><span>解答済み小問</span></div>'+
          '<div><b>'+(S.stats.best||0)+'</b><span>自己最高</span></div>'+
        '</div>'+
      '</section>';

    var ring =
      '<section class="card score">'+
        '<div class="ring" id="topRing"><b>'+pct+'<span style="font-size:.8rem">%</span></b><i>得点率</i></div>'+
        '<div style="flex:1;min-width:0">'+
          '<div class="kv"><span>合計</span><b>'+sc+' / '+TOTAL_PT+' 点</b></div>'+
          '<div class="kv"><span>解答済み</span><b>'+ans+' / '+K.meta.items+' 小問</b></div>'+
          '<div class="kv"><span>見直しマーク</span><b>'+Object.keys(S.marks).length+' 件</b></div>'+
          '<div class="kv"><span>挑戦回数</span><b>'+(S.stats.attempts||0)+' 回</b></div>'+
        '</div>'+
      '</section>';

    var cards = '<div class="plist">' + K.passages.map(function(p,i){
      var a = answeredOf(p.id), n = FLAT[p.id].length, s = scoreOf(p.id), mx = maxOf(p.id);
      var st = a===0 ? '未着手' : (a<n ? '途中（'+a+'/'+n+'）' : '採点済み '+s+'/'+mx+'点');
      return '<button class="pcard" data-p="'+p.id+'">'+
        '<span class="top"><span class="no">'+(i+1)+'</span>'+
          '<span class="chip">'+esc(p.tag)+'</span><span class="chip">'+esc(p.kind)+'</span></span>'+
        '<span class="en">'+esc(p.title)+'</span>'+
        '<span class="ja">'+esc(p.titleJa)+'</span>'+
        '<span class="bar"><i style="width:'+(n? Math.round(a/n*100):0)+'%"></i></span>'+
        '<span class="meta"><span>約'+p.mins+'分</span><span>'+p.words+' words</span><span>'+p.qs.length+'問 / 小問'+n+'</span><span>'+esc(st)+'</span></span>'+
      '</button>';
    }).join('') + '</div>';

    var links =
      '<div class="btn-row">'+
        '<button class="btn sm" id="toVocab">'+icon('book')+'語彙シート</button>'+
        '<button class="btn sm" id="toGram">'+icon('pen')+'文法ポイント</button>'+
      '</div>'+
      '<button class="btn sm" id="toResult">'+icon('chart')+'キット全体の成績を見る</button>';

    var note =
      '<section class="card flat">'+
        '<div class="chiprow" style="margin-bottom:8px"><span class="chip">'+icon('info')+'独立保存</span>'+
        '<span class="chip demo">DEMO 購入コンテンツ</span></div>'+
        '<p class="tiny">この対策キットの解答・採点・語彙メモは <b>gvexam.v1</b> に保存され、'+
        '通常版／Pro版の学習データ（XP・レベル・SRS・単語帳）とは完全に独立しています。'+
        'こちらで解いても本編のXPやレベルは変化しません。</p>'+
      '</section>';

    $('v-top').innerHTML = cover + ring + '<h2 class="h2">収録長文</h2>' + cards + '<hr class="rule">' + links + note;

    /* 得点リングのアニメーション（@property 対応環境） */
    requestAnimationFrame(function(){
      var r = $('topRing'); if(r) r.style.setProperty('--p', String(pct));
    });

    [].forEach.call($('v-top').querySelectorAll('.pcard'), function(b){
      b.addEventListener('click', function(){ haptic(8); openPassage(b.dataset.p); });
    });
    $('toVocab').addEventListener('click', function(){ nav('vocab'); });
    $('toGram').addEventListener('click', function(){ nav('gram'); });
    $('toResult').addEventListener('click', function(){ nav('result','kit'); });

    $('dock').innerHTML =
      '<button class="btn primary" id="dockStart">'+icon('doc')+ (kitAnswered()? '続きから解く' : '第1問から解きはじめる') +'</button>'+
      '<p class="tiny" style="text-align:center">解答はこの端末に自動保存されます</p>';
    $('dockStart').addEventListener('click', function(){
      var target = K.passages[0].id;
      for(var i=0;i<K.passages.length;i++){
        var p = K.passages[i];
        if(answeredOf(p.id) < FLAT[p.id].length){ target = p.id; break; }
      }
      openPassage(target);
    });
  }

  /* ---------------------------------------------------------------
     8. 本文（読解）
     --------------------------------------------------------------- */
  function openPassage(pid){
    cur.pid = pid; cur.i = 0; cur.only = null;
    startTimer(P_BY_ID[pid].mins);
    nav('read', pid);
  }

  function renderRead(pid){
    pid = pid || cur.pid; cur.pid = pid;
    var p = P_BY_ID[pid];
    var html = '<article class="passage">'+
      '<div class="p-head">'+
        '<div class="chiprow"><span class="chip solid">'+esc(p.tag)+'</span><span class="chip">'+esc(p.kind)+'</span>'+
        '<span class="chip">約'+p.mins+'分</span><span class="chip">'+p.words+' words</span></div>'+
        '<h1 class="en">'+esc(p.title)+'</h1>'+
        '<p class="sub">'+esc(p.titleJa)+'</p>'+
      '</div>';

    p.paras.forEach(function(pp,i){
      html += '<div class="para'+(S.settings.autoTrans?' open':'')+'" data-i="'+i+'">'+
        '<span class="n">'+(i+1)+'</span>'+
        '<p class="en">'+esc(pp.en)+'</p>'+
        '<p class="ja">'+esc(pp.ja)+'</p>'+
        '<p class="cue">タップで日本語訳を'+(S.settings.autoTrans?'隠す':'表示')+'</p>'+
      '</div>';
      if(p.table && p.tableAfter===i) html += tableHTML(p.table);
    });
    if(p.table && (p.tableAfter===undefined || p.tableAfter===null)) html += tableHTML(p.table);
    html += '</article>';

    $('v-read').innerHTML = html;

    [].forEach.call($('v-read').querySelectorAll('.para'), function(el){
      el.addEventListener('click', function(){
        el.classList.toggle('open');
        el.querySelector('.cue').textContent = 'タップで日本語訳を' + (el.classList.contains('open')?'隠す':'表示');
        haptic(6);
      });
    });

    $('dock').innerHTML =
      '<div class="seg" role="group" aria-label="表示切替">'+
        '<button id="segRead" aria-pressed="true">本文</button>'+
        '<button id="segQuiz" aria-pressed="false">問題（'+FLAT[pid].length+'）</button>'+
      '</div>'+
      '<div class="btn-row">'+
        '<button class="btn sm" id="rdAll">訳を全表示</button>'+
        '<button class="btn sm" id="rdSpeak">'+icon('speak')+'音読</button>'+
      '</div>'+
      '<button class="btn primary" id="rdGo">'+icon('pen')+'問題を解く</button>';

    $('segQuiz').addEventListener('click', gotoQuiz);
    $('rdGo').addEventListener('click', gotoQuiz);
    $('segRead').addEventListener('click', function(){});
    $('rdAll').addEventListener('click', function(){
      var open = $('v-read').querySelectorAll('.para.open').length < p.paras.length;
      [].forEach.call($('v-read').querySelectorAll('.para'), function(el){
        el.classList.toggle('open', open);
        el.querySelector('.cue').textContent = 'タップで日本語訳を' + (open?'隠す':'表示');
      });
      haptic(6);
    });
    $('rdSpeak').addEventListener('click', function(){
      speak(p.paras.map(function(x){ return x.en; }).join(' '));
      haptic(6);
    });
  }
  function tableHTML(t){
    return '<div class="tbl-wrap">'+
      '<div class="tbl-cap">'+esc(t.caption)+'</div>'+
      '<table class="tbl"><thead><tr>'+ t.head.map(function(h){ return '<th>'+esc(h)+'</th>'; }).join('') +
      '</tr></thead><tbody>'+
      t.rows.map(function(r){ return '<tr>'+ r.map(function(c){ return '<td>'+esc(c)+'</td>'; }).join('') +'</tr>'; }).join('')+
      '</tbody></table>'+
      (t.note? '<div class="tbl-note">'+esc(t.note)+'</div>' : '')+
    '</div>';
  }

  function gotoQuiz(){
    var list = activeList(), pr = prog(cur.pid), start = 0;
    for(var i=0;i<list.length;i++){ if(!pr.ans[list[i].it.id]){ start = i; break; } }
    cur.i = start;
    nav('quiz');
  }

  /* ---------------------------------------------------------------
     9. 設問
     --------------------------------------------------------------- */
  function renderQuiz(){
    var list = activeList();
    if(!list.length){ nav('top'); return; }
    if(cur.i >= list.length) cur.i = list.length-1;
    var r = list[cur.i], it = r.it, q = r.q, pr = prog(cur.pid);
    var a = pr.ans[it.id];
    var letters = ['A','B','C','D','E'];
    var fld = K.fields[r.field] || {n:''};

    /* 同じ問（大問）の小問タブ */
    var sibs = FLAT[cur.pid].filter(function(x){ return x.q === q; });
    var subnav = sibs.length>1 ? '<div class="subnav">'+ sibs.map(function(x){
        var done = pr.ans[x.it.id];
        return '<button data-go="'+x.it.id+'" aria-current="'+(x.it.id===it.id)+'" class="'+(done?'done':'')+'">'+
          '小問'+(sibs.indexOf(x)+1)+(done? (done.ok?' ○':' ×') :'')+'</button>';
      }).join('') + '</div>' : '';

    $('v-quiz').innerHTML =
      '<section class="card">'+
        '<div class="qhead">'+
          '<span class="qno">'+esc(r.label)+'</span>'+
          '<span class="chip solid">'+esc(fld.n)+'</span>'+
          '<span class="chip">'+it.pt+'点</span>'+
          (S.marks[it.id]? '<span class="chip mark">'+icon('flag')+'見直し</span>':'')+
        '</div>'+
        '<p class="qstem">'+esc(q.stem)+'<br><span style="color:var(--ink-3)">'+esc(q.stemJa)+'</span></p>'+
        subnav+
        '<p class="qtext">'+esc(it.q)+'</p>'+
        '<div id="verdictBox"></div>'+
      '</section>'+
      '<div class="choices" id="choiceBox">'+
        it.c.map(function(c,i){
          return '<button class="choice" data-i="'+i+'">'+
            '<span class="ltr">'+letters[i]+'</span><span class="txt">'+esc(c)+'</span></button>';
        }).join('')+
      '</div>'+
      '<p class="tiny">選択するとその場で採点し、プロの解説（解説／文法／語彙）を表示します。</p>';

    if(subnav){
      [].forEach.call($('v-quiz').querySelectorAll('[data-go]'), function(b){
        b.addEventListener('click', function(){
          var id = b.dataset.go, idx = -1;
          list.forEach(function(x,i){ if(x.it.id===id) idx=i; });
          if(idx>=0){ cur.i = idx; renderQuiz(); renderBar(); }
        });
      });
    }

    [].forEach.call($('choiceBox').querySelectorAll('.choice'), function(b){
      b.addEventListener('click', function(){ judge(parseInt(b.dataset.i,10)); });
    });

    if(a) paintAnswer(a.p, true);
    renderQuizDock();
  }

  function paintAnswer(pick, silent){
    var list = activeList(), r = list[cur.i], it = r.it;
    var btns = $('choiceBox').querySelectorAll('.choice');
    [].forEach.call(btns, function(b,i){
      b.classList.remove('correct','wrong','dim');
      if(i===it.a) b.classList.add('correct');
      else if(i===pick) b.classList.add('wrong');
      else b.classList.add('dim');
    });
    var ok = pick===it.a;
    $('verdictBox').innerHTML =
      '<div class="verdict '+(ok?'ok':'ng')+'">'+icon(ok?'check':'x')+
      (ok? '正解 ＋'+it.pt+'点' : '不正解（正解は '+['A','B','C','D','E'][it.a]+'）')+'</div>';
    renderQuizDock();
    if(!silent) openExp();
  }

  function judge(pick){
    var list = activeList(), r = list[cur.i], it = r.it, pr = prog(cur.pid);
    if(pr.ans[it.id]) return;
    var ok = pick===it.a;
    pr.ans[it.id] = { p:pick, ok:ok, at:Date.now() };
    if(answeredOf(cur.pid) === FLAT[cur.pid].length && !pr.done){
      pr.done = true; pr.at = Date.now(); pr.tries = (pr.tries||0)+1;
      S.stats.attempts = (S.stats.attempts||0)+1;
    }
    pr.score = scoreOf(cur.pid);
    var ks = kitScore();
    if(ks > (S.stats.best||0)) S.stats.best = ks;
    S.stats.lastAt = Date.now();
    save();
    haptic(ok? 10 : [8,40,8]);
    paintAnswer(pick);
    renderBar();
  }

  function renderQuizDock(){
    var list = activeList(), r = list[cur.i], it = r.it, pr = prog(cur.pid);
    var answered = !!pr.ans[it.id];
    var last = cur.i >= list.length-1;
    $('dock').innerHTML =
      '<div class="btn-row">'+
        '<button class="btn sm" id="qPrev" '+(cur.i===0?'disabled style="opacity:.45"':'')+'>'+icon('back')+'前へ</button>'+
        '<button class="btn sm" id="qMark">'+icon('flag')+(S.marks[it.id]?'マーク解除':'見直し')+'</button>'+
        '<button class="btn sm" id="qExp" '+(answered?'':'disabled style="opacity:.45"')+'>解説</button>'+
      '</div>'+
      '<button class="btn primary" id="qNext">'+
        (answered ? (last? icon('chart')+'採点結果を見る' : '次の小問へ'+icon('fwd')) : '本文を読み直す')+
      '</button>';

    $('qPrev').addEventListener('click', function(){
      if(cur.i>0){ cur.i--; renderQuiz(); renderBar(); }
    });
    $('qMark').addEventListener('click', function(){
      if(S.marks[it.id]) delete S.marks[it.id]; else S.marks[it.id] = true;
      save(); renderQuiz(); renderBar(); haptic(6);
      toast(S.marks[it.id]? 'あとで見直す印をつけました' : 'マークを外しました', 'flag');
    });
    $('qExp').addEventListener('click', function(){ if(pr.ans[it.id]) openExp(); });
    $('qNext').addEventListener('click', function(){
      if(!answered){ nav('read', cur.pid); return; }
      if(last){ nav('result', cur.pid); return; }
      cur.i++; renderQuiz(); renderBar();
      $('stage').scrollTop = 0;
    });
  }

  /* ---------------------------------------------------------------
     10. 解説シート（解説／文法／語彙の3タブ）
     --------------------------------------------------------------- */
  function openExp(){
    var list = activeList(), r = list[cur.i], it = r.it, pr = prog(cur.pid);
    var a = pr.ans[it.id];
    var ok = a && a.ok;
    var letters = ['A','B','C','D','E'];

    var head =
      '<div class="chiprow">'+
        '<span class="chip '+(ok?'solid':'')+'">'+(ok?'正解':'不正解')+'</span>'+
        '<span class="chip">'+esc(r.label)+'</span>'+
        '<span class="chip">'+esc((K.fields[r.field]||{}).n||'')+'</span>'+
        '<span class="chip">'+it.pt+'点</span>'+
      '</div>'+
      '<h2 class="h2" style="margin-top:8px">'+esc(it.q)+'</h2>'+
      '<p class="tiny">あなたの解答：'+(a? letters[a.p]+'　／　正解：'+letters[it.a] : '未解答')+'</p>';

    var tabs =
      '<div class="tabs" role="tablist">'+
        '<button role="tab" id="tabA" aria-selected="true">解説</button>'+
        '<button role="tab" id="tabB" aria-selected="false">文法</button>'+
        '<button role="tab" id="tabC" aria-selected="false">語彙</button>'+
      '</div>';

    var paneA =
      '<div class="pane" id="paneA">'+
        '<div class="box"><div class="lbl">PRO の読み方</div><p class="exp" style="margin:0">'+esc(it.exp)+'</p></div>'+
        '<div class="box"><div class="lbl">選択肢の正解</div><p class="exp" style="margin:0">'+
          letters[it.a]+'　'+esc(it.c[it.a])+'</p></div>'+
      '</div>';
    var paneB =
      '<div class="pane" id="paneB" hidden>'+
        '<div class="box"><div class="lbl">文法ポイント</div><p class="exp" style="margin:0">'+esc(it.gram)+'</p></div>'+
      '</div>';
    var paneC =
      '<div class="pane" id="paneC" hidden>'+
        '<div class="vlist">'+ it.vocab.map(function(v){
          return '<div class="vrow">'+
            '<span class="w">'+esc(v[0])+'</span>'+
            (v[1]? '<span class="ipa">'+esc(v[1])+'</span>':'<span></span>')+
            '<button class="spk" data-say="'+esc(v[0])+'" aria-label="'+esc(v[0])+' を読み上げる">'+icon('speak')+'</button>'+
            '<span class="m">'+esc(v[2])+'</span>'+
          '</div>';
        }).join('') +'</div>'+
      '</div>';

    var foot =
      '<div class="btn-row">'+
        '<button class="btn sm" id="expMark">'+icon('flag')+(S.marks[it.id]?'マーク解除':'見直し')+'</button>'+
        '<button class="btn sm" id="expRead">本文へ</button>'+
      '</div>'+
      '<button class="btn primary" id="expNext">'+(cur.i>=list.length-1? '採点結果を見る':'次の小問へ')+'</button>';

    showSheet(head + tabs + paneA + paneB + paneC + foot);

    function pick(n){
      ['A','B','C'].forEach(function(x){
        $('tab'+x).setAttribute('aria-selected', String(x===n));
        $('pane'+x).hidden = (x!==n);
      });
    }
    $('tabA').addEventListener('click', function(){ pick('A'); });
    $('tabB').addEventListener('click', function(){ pick('B'); });
    $('tabC').addEventListener('click', function(){ pick('C'); });
    [].forEach.call($('sheetBody').querySelectorAll('[data-say]'), function(b){
      b.addEventListener('click', function(){ speak(b.dataset.say); haptic(6); });
    });
    $('expMark').addEventListener('click', function(){
      if(S.marks[it.id]) delete S.marks[it.id]; else S.marks[it.id] = true;
      save(); $('expMark').innerHTML = icon('flag')+(S.marks[it.id]?'マーク解除':'見直し');
      renderBar(); renderQuizDock(); haptic(6);
    });
    $('expRead').addEventListener('click', function(){ closeSheet(); nav('read', cur.pid); });
    $('expNext').addEventListener('click', function(){
      closeSheet();
      if(cur.i>=list.length-1){ nav('result', cur.pid); return; }
      cur.i++; renderQuiz(); renderBar(); $('stage').scrollTop=0;
    });
  }

  /* ---------------------------------------------------------------
     11. 採点結果（長文単位 / キット全体）
     --------------------------------------------------------------- */
  function renderResult(scope){
    var isKit = (scope==='kit');
    var pids = isKit ? K.passages.map(function(p){ return p.id; }) : [scope||cur.pid];
    if(!isKit) cur.pid = pids[0];

    var got = 0, max = 0, items = [];
    pids.forEach(function(pid){
      got += scoreOf(pid); max += maxOf(pid);
      FLAT[pid].forEach(function(r){ items.push(r); });
    });
    var pr0 = prog(pids[0]);
    var pct = max ? Math.round(got/max*100) : 0;

    /* 分野別 */
    var fkeys = Object.keys(K.fields);
    var fstat = {};
    fkeys.forEach(function(k){ fstat[k] = {got:0, max:0, n:0, ok:0}; });
    items.forEach(function(r){
      var a = prog(r.p.id).ans[r.it.id];
      var f = fstat[r.field];
      f.max += r.it.pt; f.n++;
      if(a && a.ok){ f.got += r.it.pt; f.ok++; }
    });

    var bars = '<div class="bars">' + fkeys.filter(function(k){ return fstat[k].n>0; }).map(function(k){
      var f = fstat[k], p = f.max? Math.round(f.got/f.max*100):0;
      return '<div class="bar-row"><span class="t">'+esc(K.fields[k].n)+'</span>'+
        '<span class="track"><i style="width:'+p+'%"></i></span>'+
        '<span class="v">'+f.got+'/'+f.max+'</span></div>';
    }).join('') + '</div>';

    /* レーダー（SVG） */
    var used = fkeys.filter(function(k){ return fstat[k].n>0; });
    var radar = radarSVG(used.map(function(k){
      return { label:K.fields[k].n, v: fstat[k].max? fstat[k].got/fstat[k].max : 0 };
    }));

    /* 誤答 / 未解答 */
    var wrong = items.filter(function(r){
      var a = prog(r.p.id).ans[r.it.id];
      return !a || !a.ok;
    });
    var wlist = wrong.length
      ? '<div class="plist">' + wrong.map(function(r){
          var a = prog(r.p.id).ans[r.it.id];
          return '<button class="wrongrow" data-w="'+r.it.id+'">'+
            '<span class="tag">'+(a? '誤答':'未解答')+'</span>'+
            '<span class="t"><b>'+esc(r.label)+'</b>　'+esc(r.it.q.slice(0,44))+(r.it.q.length>44?'…':'')+'</span>'+
            icon('fwd')+'</button>';
        }).join('') + '</div>'
      : '<section class="card accent"><p class="sub" style="margin:0">全問正解です。語彙シートで語の定着を確認しておきましょう。</p></section>';

    var evalTxt = pct>=80 ? '本番でも安定して取れる水準です。速度を上げる練習に移りましょう。'
      : pct>=60 ? '根拠の場所は概ね掴めています。誤答を「なぜ切れるか」で言語化すると伸びます。'
      : '設問の型ごとに解き方を固定するのが先です。解説の「PROの読み方」を音読してみてください。';

    $('v-result').innerHTML =
      '<div class="gradebox">'+
        '<section class="card score">'+
          '<div class="ring" id="resRing"><b>'+got+'</b><i>/ '+max+' 点</i></div>'+
          '<div style="flex:1;min-width:0">'+
            '<div class="h-lead">'+(isKit? 'KIT TOTAL':'PASSAGE SCORE')+'</div>'+
            '<h2 class="h2" style="margin:2px 0 6px">'+pct+'% 得点</h2>'+
            '<p class="tiny">'+esc(evalTxt)+'</p>'+
          '</div>'+
        '</section>'+
        '<section class="card"><div class="h-lead">分野別</div>'+bars+
          '<div style="margin-top:12px">'+radar+'</div></section>'+
        '<h2 class="h2">復習リスト（'+wrong.length+'）</h2>'+ wlist +
        (isKit? '' : '<section class="card flat"><div class="kv"><span>この長文の挑戦回数</span><b>'+(pr0.tries||0)+' 回</b></div>'+
          '<div class="kv"><span>最後に解いた日時</span><b>'+(pr0.at? new Date(pr0.at).toLocaleString('ja-JP') : '—')+'</b></div></section>')+
      '</div>';

    requestAnimationFrame(function(){
      var r = $('resRing'); if(r) r.style.setProperty('--p', String(pct));
    });

    [].forEach.call($('v-result').querySelectorAll('[data-w]'), function(b){
      b.addEventListener('click', function(){
        var rec = ITEMS[b.dataset.w];
        cur.pid = rec.p.id; cur.only = null;
        var list = FLAT[cur.pid], idx = 0;
        list.forEach(function(x,i){ if(x.it.id===rec.it.id) idx=i; });
        cur.i = idx; nav('quiz');
      });
    });

    $('dock').innerHTML =
      '<div class="btn-row">'+
        '<button class="btn sm" id="rsWrong" '+(wrong.length?'':'disabled style="opacity:.45"')+'>間違いだけ復習</button>'+
        '<button class="btn sm" id="rsRetry">この'+(isKit?'キット':'長文')+'をやり直す</button>'+
      '</div>'+
      '<button class="btn primary" id="rsTop">'+icon('home')+'キットのトップへ</button>';

    $('rsTop').addEventListener('click', function(){ nav('top'); });
    $('rsWrong').addEventListener('click', function(){
      if(!wrong.length) return;
      var pid = wrong[0].p.id;
      cur.pid = pid;
      cur.only = wrong.filter(function(r){ return r.p.id===pid; }).map(function(r){ return r.it.id; });
      /* 復習は解答を消してから */
      var pr = prog(pid);
      cur.only.forEach(function(id){ delete pr.ans[id]; });
      pr.done = false; save();
      cur.i = 0; nav('quiz');
      toast('誤答'+cur.only.length+'問だけを出題します','flag');
    });
    $('rsRetry').addEventListener('click', function(){
      openConfirm('解答を消してやり直しますか？', 'この'+(isKit?'キット全体':'長文')+'の解答記録が消えます。語彙シートの「覚えた」と見直しマークは残ります。', function(){
        pids.forEach(function(pid){ S.progress[pid] = { ans:{}, done:false, score:0, at:0, tries:prog(pid).tries||0 }; });
        save(); cur.only = null;
        if(isKit){ nav('top'); } else { openPassage(pids[0]); }
        toast('解答をリセットしました','reset');
      });
    });
  }

  function radarSVG(data){
    var n = data.length; if(n<3) return '';
    var cx = 150, cy = 118, R = 88;
    function pt(i, v){
      var a = -Math.PI/2 + (Math.PI*2/n)*i;
      return [cx + Math.cos(a)*R*v, cy + Math.sin(a)*R*v];
    }
    var grid = '';
    [0.25,0.5,0.75,1].forEach(function(g){
      var pts = data.map(function(d,i){ var p = pt(i,g); return p[0].toFixed(1)+','+p[1].toFixed(1); }).join(' ');
      grid += '<polygon class="grid" points="'+pts+'"/>';
    });
    data.forEach(function(d,i){
      var p = pt(i,1);
      grid += '<line class="grid" x1="'+cx+'" y1="'+cy+'" x2="'+p[0].toFixed(1)+'" y2="'+p[1].toFixed(1)+'"/>';
    });
    var area = data.map(function(d,i){
      var p = pt(i, Math.max(0.04, d.v)); return p[0].toFixed(1)+','+p[1].toFixed(1);
    }).join(' ');
    var labels = data.map(function(d,i){
      var p = pt(i, 1.2);
      var anchor = p[0] < cx-6 ? 'end' : (p[0] > cx+6 ? 'start' : 'middle');
      return '<text x="'+p[0].toFixed(1)+'" y="'+(p[1]+3).toFixed(1)+'" text-anchor="'+anchor+'">'+esc(d.label)+'</text>';
    }).join('');
    return '<svg class="radar" viewBox="0 0 300 236" role="img" aria-label="分野別の得点率レーダーチャート">'+
      grid + '<polygon class="area" points="'+area+'"/>' + labels + '</svg>';
  }

  /* ---------------------------------------------------------------
     12. 語彙シート（キット専用・独立保存）
     --------------------------------------------------------------- */
  var vq = '';
  function allVocab(){
    var out = [], seen = {};
    K.passages.forEach(function(p){
      FLAT[p.id].forEach(function(r){
        r.it.vocab.forEach(function(v){
          var key = v[0].toLowerCase();
          if(seen[key]) return;
          seen[key] = true;
          out.push({ w:v[0], ipa:v[1], m:v[2], from:r.label, pid:p.id });
        });
      });
    });
    return out;
  }
  function renderVocab(){
    var all = allVocab();
    var list = all.filter(function(v){
      if(!vq) return true;
      var q = vq.toLowerCase();
      return v.w.toLowerCase().indexOf(q)>=0 || v.m.indexOf(vq)>=0;
    });
    var knownN = all.filter(function(v){ return S.known[v.w.toLowerCase()]; }).length;

    $('v-vocab').innerHTML =
      '<div class="h-lead">VOCABULARY SHEET</div>'+
      '<h1 class="h">語彙シート（'+all.length+'語）</h1>'+
      '<p class="sub">解説に登場した語をすべて集めました。覚えた語はタップで印をつけられます（'+knownN+'/'+all.length+'）。</p>'+
      '<div class="search">'+icon('search')+
        '<input id="vq" type="search" inputmode="search" autocapitalize="none" autocomplete="off" '+
        'placeholder="英語または日本語で検索" value="'+esc(vq)+'" aria-label="語彙を検索">'+
      '</div>'+
      '<div class="vlist" id="vlist">'+
        (list.length? list.map(function(v){
          var kn = !!S.known[v.w.toLowerCase()];
          return '<div class="vrow'+(kn?' known':'')+'" data-w="'+esc(v.w)+'">'+
            '<span class="w">'+esc(v.w)+'</span>'+
            (v.ipa? '<span class="ipa">'+esc(v.ipa)+'</span>':'<span></span>')+
            '<button class="spk" data-say="'+esc(v.w)+'" aria-label="読み上げ">'+icon('speak')+'</button>'+
            '<span class="m">'+esc(v.m)+'　<span style="color:var(--ink-3);font-size:.7rem">'+esc(v.from)+'</span></span>'+
          '</div>';
        }).join('') : '<p class="sub">該当する語がありません。</p>')+
      '</div>';

    var input = $('vq');
    input.addEventListener('input', function(){
      vq = input.value;
      var pos = input.selectionStart;
      renderVocab();
      var ni = $('vq'); ni.focus();
      try{ ni.setSelectionRange(pos,pos); }catch(e){}
    });
    [].forEach.call($('vlist').querySelectorAll('.vrow'), function(row){
      row.addEventListener('click', function(e){
        if(e.target.closest('[data-say]')) return;
        var w = row.dataset.w.toLowerCase();
        if(S.known[w]) delete S.known[w]; else S.known[w] = true;
        save(); row.classList.toggle('known', !!S.known[w]); haptic(6);
      });
    });
    [].forEach.call($('vlist').querySelectorAll('[data-say]'), function(b){
      b.addEventListener('click', function(ev){ ev.stopPropagation(); speak(b.dataset.say); haptic(6); });
    });

    $('dock').innerHTML =
      '<div class="btn-row">'+
        '<button class="btn sm" id="vClear">検索をクリア</button>'+
        '<button class="btn sm" id="vGram">'+icon('pen')+'文法へ</button>'+
      '</div>'+
      '<button class="btn primary" id="vTop">'+icon('home')+'キットのトップへ</button>';
    $('vClear').addEventListener('click', function(){ vq=''; renderVocab(); });
    $('vGram').addEventListener('click', function(){ nav('gram'); });
    $('vTop').addEventListener('click', function(){ nav('top'); });
  }

  /* ---------------------------------------------------------------
     13. 文法ポイント一覧
     --------------------------------------------------------------- */
  function renderGram(){
    var html = '<div class="h-lead">GRAMMAR NOTES</div>'+
      '<h1 class="h">文法ポイント（'+K.meta.items+'項目）</h1>'+
      '<p class="sub">小問ごとに、正解の決め手になる文法をまとめています。タップで展開します。</p>';
    K.passages.forEach(function(p){
      html += '<h2 class="h2" style="margin-top:6px">'+esc(p.tag)+'　'+esc(p.titleJa)+'</h2>';
      FLAT[p.id].forEach(function(r){
        html += '<div class="gitem" data-g="'+r.it.id+'">'+
          '<button><span class="q">'+esc(r.label)+'</span>'+
            '<span class="t">'+esc(r.it.gram.slice(0,30))+'…</span>'+icon('up')+'</button>'+
          '<div class="body">'+esc(r.it.gram)+
            '<div style="margin-top:8px" class="tiny">関連語：'+
              r.it.vocab.map(function(v){ return esc(v[0]); }).join(' / ')+'</div>'+
          '</div></div>';
      });
    });
    $('v-gram').innerHTML = html;
    [].forEach.call($('v-gram').querySelectorAll('.gitem'), function(el){
      el.querySelector('button').addEventListener('click', function(){
        el.classList.toggle('open'); haptic(6);
      });
    });
    $('dock').innerHTML =
      '<div class="btn-row">'+
        '<button class="btn sm" id="gVocab">'+icon('book')+'語彙シートへ</button>'+
        '<button class="btn sm" id="gOpenAll">すべて展開</button>'+
      '</div>'+
      '<button class="btn primary" id="gTop">'+icon('home')+'キットのトップへ</button>';
    $('gVocab').addEventListener('click', function(){ nav('vocab'); });
    $('gOpenAll').addEventListener('click', function(){
      var items = $('v-gram').querySelectorAll('.gitem');
      var open = $('v-gram').querySelectorAll('.gitem.open').length < items.length;
      [].forEach.call(items, function(el){ el.classList.toggle('open', open); });
    });
    $('gTop').addEventListener('click', function(){ nav('top'); });
  }

  /* ---------------------------------------------------------------
     14. シート（native dialog）
     --------------------------------------------------------------- */
  function showSheet(html){
    var dlg = $('sheet');
    $('sheetBody').innerHTML = html;
    $('sheetBody').scrollTop = 0;
    if(!dlg.open){
      if(dlg.showModal) dlg.showModal(); else dlg.setAttribute('open','');
    }
  }
  function closeSheet(){
    var dlg = $('sheet');
    if(dlg.open && dlg.close) dlg.close(); else dlg.removeAttribute('open');
  }
  function openConfirm(title, body, onYes){
    showSheet('<h2 class="h2">'+esc(title)+'</h2><p class="sub">'+esc(body)+'</p>'+
      '<div class="btn-row"><button class="btn sm" id="cfNo">やめる</button>'+
      '<button class="btn sm danger" id="cfYes">実行する</button></div>');
    $('cfNo').addEventListener('click', closeSheet);
    $('cfYes').addEventListener('click', function(){ closeSheet(); onYes(); });
  }

  /* ---------------------------------------------------------------
     15. 設定
     --------------------------------------------------------------- */
  function openSettings(){
    var s = S.settings;
    showSheet(
      '<h2 class="h2">設定（このキット専用）</h2>'+
      '<p class="tiny">ここでの設定は対策キットにだけ適用され、通常版／Pro版には影響しません。</p>'+
      '<section class="card flat">'+
        '<div class="swrow"><span class="t"><b>目安タイマー</b><span>長文ごとの目安時間を表示します。時間切れでも中断されません。</span></span>'+
          '<button class="sw" role="switch" data-set="timer" aria-checked="'+!!s.timer+'" aria-label="目安タイマー"></button></div>'+
        '<div class="swrow"><span class="t"><b>訳を最初から表示</b><span>本文を開いたとき日本語訳を開いた状態にします。</span></span>'+
          '<button class="sw" role="switch" data-set="autoTrans" aria-checked="'+!!s.autoTrans+'" aria-label="訳を最初から表示"></button></div>'+
        '<div class="swrow"><span class="t"><b>触覚フィードバック</b><span>採点時に短く振動します（対応端末のみ）。</span></span>'+
          '<button class="sw" role="switch" data-set="haptics" aria-checked="'+!!s.haptics+'" aria-label="触覚フィードバック"></button></div>'+
        '<div class="swrow"><span class="t"><b>動きを減らす</b><span>スクロール連動の演出や画面遷移を止めます。</span></span>'+
          '<button class="sw" role="switch" data-set="reduceMotion" aria-checked="'+!!s.reduceMotion+'" aria-label="動きを減らす"></button></div>'+
        '<div class="swrow"><span class="t"><b>文字サイズ</b><span>長文を読みやすい大きさに調整できます。</span></span>'+
          '<span class="fsrow"><button id="fsDown" aria-label="文字を小さく">A−</button>'+
          '<button id="fsUp" aria-label="文字を大きく">A＋</button></span></div>'+
      '</section>'+
      '<div class="box"><div class="lbl">保存について</div>'+
        '<p class="tiny">保存キーは <b>gvexam.v1</b>。通常版／Pro版（glassvocab.v1）とは別領域です。'+
        (S.order? '<br>注文ID：'+esc(S.order)+'（デモ／請求は発生していません）':'')+'</p></div>'+
      '<div class="btn-row">'+
        '<a class="btn sm" href="pro.html" style="text-decoration:none">Pro版へ戻る</a>'+
        '<button class="btn sm danger" id="setReset">解答をすべて消す</button>'+
      '</div>'+
      '<button class="btn primary" id="setClose">とじる</button>'
    );
    [].forEach.call($('sheetBody').querySelectorAll('.sw'), function(b){
      b.addEventListener('click', function(){
        var k = b.dataset.set, v = b.getAttribute('aria-checked')!=='true';
        S.settings[k] = v; b.setAttribute('aria-checked', String(v)); save();
        applyMotion(); haptic(6);
        if(k==='timer'){ if(v && cur.pid) startTimer(P_BY_ID[cur.pid].mins); else stopTimer(); renderBar(); }
        if(k==='autoTrans' && view==='read') renderRead(cur.pid);
      });
    });
    $('fsUp').addEventListener('click', function(){
      S.settings.fs = Math.min(1.25, Math.round((S.settings.fs+0.05)*100)/100); save(); applyMotion();
      toast('文字サイズ '+Math.round(S.settings.fs*100)+'%','info');
    });
    $('fsDown').addEventListener('click', function(){
      S.settings.fs = Math.max(0.9, Math.round((S.settings.fs-0.05)*100)/100); save(); applyMotion();
      toast('文字サイズ '+Math.round(S.settings.fs*100)+'%','info');
    });
    $('setClose').addEventListener('click', closeSheet);
    $('setReset').addEventListener('click', function(){
      openConfirm('解答をすべて消しますか？','3本すべての解答・採点結果が消えます。購入内容と語彙シートの「覚えた」は残ります。', function(){
        S.progress = {}; S.marks = {}; S.stats.attempts = 0; save();
        cur.only = null; nav('top'); toast('解答をすべて消しました','reset');
      });
    });
  }

  /* ---------------------------------------------------------------
     16. ロック画面（未購入時）
     --------------------------------------------------------------- */
  function renderLock(){
    $('lockView').hidden = false;
    $('shell').hidden = true;
    $('lockView').innerHTML =
      '<div class="lockseal">'+icon('lock')+'</div>'+
      '<div class="h-lead">EXAM KIT / LOCKED</div>'+
      '<h1 class="h">'+esc(K.meta.name)+'</h1>'+
      '<p class="sub">'+esc(K.meta.sub)+'：共通テスト型の長文'+K.meta.passages+'本、全'+K.meta.qs+'問（小問'+K.meta.items+'）、'+
        'プロによる文法・語彙レベルの解説つき。'+K.meta.total+'点満点で自己採点できます。</p>'+
      '<section class="card">'+
        '<div class="kv"><span>収録長文</span><b>'+K.meta.passages+'本（案内文／ブログ＋メール／説明文＋図表）</b></div>'+
        '<div class="kv"><span>設問</span><b>全'+K.meta.qs+'問・小問'+K.meta.items+'</b></div>'+
        '<div class="kv"><span>解説</span><b>解説／文法／語彙の3段構成</b></div>'+
        '<div class="kv"><span>保存領域</span><b>本編と完全独立（gvexam.v1）</b></div>'+
        '<div class="kv"><span>価格</span><b class="price">¥'+K.meta.price+'</b></div>'+
      '</section>'+
      '<div class="chiprow"><span class="chip demo">DEMO</span>'+
        '<span class="tiny" style="flex:1">購入導線はデモです。実際の請求は発生しません。</span></div>'+
      '<a class="btn primary" href="pro.html#home" style="text-decoration:none">'+icon('bag')+'Pro版のストアで入手する</a>'+
      '<button class="btn sm" id="lockRecheck">'+icon('reset')+'購入状況を再確認</button>'+
      '<a class="btn sm ghost" href="index.html" style="text-decoration:none">標準版へ戻る</a>'+
      '<p class="tiny">Pro版ホームの「追加コンテンツ」にある共通テスト対策キットから入手すると、このページが解放されます。</p>';
    $('lockRecheck').addEventListener('click', function(){
      load();
      if(S.owned){ boot(); toast('購入内容を確認しました','check'); }
      else toast('この端末に購入記録が見つかりません','info');
    });
  }

  /* ---------------------------------------------------------------
     17. 起動
     --------------------------------------------------------------- */
  function boot(){
    $('lockView').hidden = true;
    $('shell').hidden = false;
    applyMotion();
    nav('top');
  }

  /* 入力系の抑制（ダブルタップ拡大・ピンチ） */
  document.addEventListener('gesturestart', function(e){ e.preventDefault(); });
  document.addEventListener('gesturechange', function(e){ e.preventDefault(); });

  /* dialog の背景タップで閉じる */
  (function(){
    var dlg = $('sheet');
    dlg.addEventListener('click', function(e){
      if(e.target === dlg) closeSheet();
    });
    dlg.addEventListener('cancel', function(){ /* Esc は既定どおり閉じる */ });
    $('sheetGrab').addEventListener('click', closeSheet);
  })();

  load();
  applyMotion();
  if(S.owned) boot(); else renderLock();

  /* デバッグ用フック（コンソールから利用可能） */
  window.__ek = {
    state: function(){ return S; },
    grant: function(){ S.owned=true; S.order='DEMO-LOCAL'; S.at=Date.now(); save(); boot(); },
    nav: nav,
    open: openPassage,
    quiz: function(pid,i){ cur.pid=pid; cur.only=null; cur.i=i||0; nav('quiz'); },
    answerAll: function(pid, allCorrect){
      var pr = prog(pid);
      FLAT[pid].forEach(function(r){
        var pick = allCorrect ? r.it.a : (r.it.a===0?1:0);
        pr.ans[r.it.id] = { p:pick, ok:pick===r.it.a, at:Date.now() };
      });
      pr.done = true; pr.at = Date.now(); pr.tries=(pr.tries||0)+1; pr.score = scoreOf(pid);
      S.stats.attempts=(S.stats.attempts||0)+1;
      if(kitScore()>(S.stats.best||0)) S.stats.best=kitScore();
      save();
    },
    result: function(scope){ cur.pid = scope==='kit'? K.passages[0].id : scope; nav('result', scope); },
    reset: function(){ S = clone(DEF); save(); location.reload(); }
  };
})();
