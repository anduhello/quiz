(() => {
  'use strict';
  const cardId = location.pathname.match(/\/entry\/([a-f0-9-]+)\//)?.[1];
  const app=document.querySelector('#app'),key='magic-mirror-v2'+(cardId ? ':' + cardId : ''),total=MagicData.questions.length;
  const star='<svg class="star" viewBox="0 0 64 64" aria-hidden="true"><path fill="currentColor" d="m32 1 5 23 18-15-15 18 23 5-23 5 15 18-18-15-5 23-5-23L9 55l15-18L1 32l23-5L9 9l18 15z"/></svg>';
  const arrow='<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3 12h17m-6-6 6 6-6 6"/></svg>';
  const check='<svg class="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m4 12 5 5L20 6"/></svg>';
  let answers=Array(total).fill(null),index=0,screen='home',cached=null,storageWorks=true,posterBlob=null,posterURL=null,toastTimer,showReference=true;
  try{cached=JSON.parse(localStorage.getItem(key)||'null');if(cached&&MagicEngine.valid(cached.answers)&&cached.version===2){answers=cached.answers;index=Math.min(total-1,Math.max(0,Number.isInteger(cached.index)?cached.index:0));}else cached=null;}catch{storageWorks=false;}
  function save(){try{localStorage.setItem(key,JSON.stringify({version:2,answers,index}));}catch{storageWorks=false;}}
  function notify(text){const el=document.querySelector('#toast');el.textContent=text;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3500);}
  const header=(home=false)=>`<header class="site-header"><button class="brand" data-action="home" aria-label="魔法映照，返回本测试首页">魔法映照</button><button class="header-link" data-action="${home?'about':'home'}">${home?'关于测试':'返回本测试首页'}</button></header>`;
  const footer='<footer class="footer">非官方同人娱乐测试 · 原创情境与人物解读<br>你的选择留在当前浏览器，不需要姓名或账号。</footer>';
  const rules='<details class="rules"><summary>这些结果是怎样匹配的？</summary><p>24 道情境题用于观察六种选择倾向。匹配时会考虑各题提供了哪些倾向，再比较你和角色更常偏向的选择。答案接近时，结果会同时给出另一位相近角色。倾向吻合度只用来描述本测试中的选择方向。</p><p>隐藏镜像需要在多道关键题中出现一致的策略选择，并同时满足画像阈值。不会因某一道题就触发，也不评价现实中的善恶。人物的不同侧面会被简化，结果仅供娱乐与自我观察。</p></details>';
  function renderHome(){screen='home';document.title='魔法映照｜测测你是《哈利·波特》里的谁';const count=answers.filter(a=>a!==null).length;app.innerHTML=`<div class="home">${header(true)}<main id="main" class="hero"><div class="hero-copy"><h1><span>测测你是</span><span>哈利·波特里的谁</span></h1><div class="ornament" aria-hidden="true">${star}</div><p class="hero-description">当你走进魔法世界，什么会引领你的选择？<br>跟随直觉，遇见与你内心相映的那个人。</p><button class="button primary" data-action="start">${count&&count<total?'继续我的魔法旅程':count===total?'查看我的魔法镜像':'开启我的魔法旅程'}${arrow}</button>${count&&count<total?`<p class="muted" style="margin-top:20px;font-size:12px">已完成 ${count} / ${total} 题 · 进度已保留</p>`:''}</div></main><div class="home-meta"><span>24 道情境选择 · 20 位人物 + 1 位隐藏款</span><small>每题 4 个短选项 · 约 3–5 分钟</small></div></div><section class="about-section" id="about" aria-labelledby="about-title"><h2 id="about-title">映照内心，而非分配学院</h2><div class="about-grid"><div><h3>选择你会做的，而非应该做的</h3><p>遇见危机、面对分歧、争取机会……24 个原创情境，关注你的选择动机。每道题只选最接近真实自己的一个选项。</p></div><div><h3>每一个人，都不止一种颜色</h3><p>从勇气、规划、共情、探索、进取与责任六个维度认识自己。完成后查看匹配理由、优势与盲点，并生成专属朋友圈图片。</p></div></div><details><summary>翻开人物名册 · 20 位常规角色与 1 位隐藏镜像</summary><p class="roster">${MagicData.roles.filter(r=>!r.hidden).map(r=>r.name).join(' · ')}<br><span class="gold">另有一位隐藏人物，等待特定的选择唤醒。</span></p></details>${rules}</section>${footer}`;}
  function renderQuiz(focus=true){screen='quiz';const q=MagicData.questions[index];document.title=`第 ${index+1} 题｜魔法映照`;app.innerHTML=`<div class="chapter-shell">${header()}<main id="main" class="quiz"><div class="progress-heading"><span>你的魔法旅程</span><strong>${String(index+1).padStart(2,'0')} <span>/ ${total}</span></strong></div><div class="progress-track" role="progressbar" aria-label="已完成题数" aria-valuenow="${answers.filter(a=>a!==null).length}" aria-valuemin="0" aria-valuemax="${total}"><div class="progress-fill" style="width:${answers.filter(a=>a!==null).length/total*100}%"></div></div><p class="question-index">${q.title}</p><h1 id="question-title" tabindex="-1">${q.text}</h1><p class="quiz-hint">按直觉选择，没有标准答案。</p><fieldset class="options"><legend class="sr-only">${q.text}</legend>${q.options.map((o,i)=>`<label class="option"><input type="radio" name="answer" value="${i}" ${answers[index]===i?'checked':''}><span class="option-letter" aria-hidden="true">${String.fromCharCode(65+i)}</span><span class="option-text">${o.text}</span>${check}</label>`).join('')}</fieldset><div class="quiz-actions"><button class="button" data-action="prev" ${index===0?'disabled':''}>上一题</button><button class="button primary" data-action="next" ${answers[index]===null?'disabled':''}>${index===total-1?'揭晓我的镜像':'下一题'}${arrow}</button></div><p class="autosave">${storageWorks?'进度仅保存在本机 · 可返回修改答案':'当前浏览器无法保存进度，请保持此页面开启'}</p></main>${footer}</div>`;if(focus){window.scrollTo(0,0);document.querySelector('#question-title').focus({preventScroll:true});}}
  function renderResult(){
    screen='result';showReference=true;const r=MagicEngine.result(answers),role=r.role,media=MagicMedia[role.id];
    const resonance=r.profile.map((v,i)=>({i,v:Math.min(v,role.profile[i])})).sort((a,b)=>b.v-a.v).slice(0,3);
    document.title=`${role.name}｜我的魔法镜像`;
    app.innerHTML=`<div class="chapter-shell result-shell ${r.hidden?'hidden-result':''}">${header()}<main id="main" class="result result-v2">
      <section class="identity" aria-label="你的匹配人物">
        <figure class="character-stage"><div class="photo-corners" aria-hidden="true"></div><img class="character-photo" src="${media.file}" alt="${role.name}的电影剧照${['fred','george'].includes(role.id)?'，双胞胎同框':''}" fetchpriority="high" width="1800" height="1248"><figcaption><span>${r.hidden?'THE HIDDEN MIRROR':'YOUR MAGIC MIRROR'}</span><a href="${media.page}" target="_blank" rel="noopener noreferrer" aria-label="查看${role.name}剧照的官方来源">官方剧照来源 ↗</a></figcaption></figure>
        <div class="identity-copy"><p class="result-label">你的魔法镜像${r.hidden?' · 隐藏款已解锁':''}</p><h1 tabindex="-1" id="result-title">${role.name}</h1><p class="english-name" lang="en">${role.en}</p><div class="ornament" aria-hidden="true">${star}</div><p class="role-line">${role.line}</p><div class="identity-detail"><div><div class="tags">${role.tags.map(t=>`<span>${t}</span>`).join('')}</div>${r.closeMatch?'<p class="identity-note">这次没有明显领先的单一角色，可以一起看看下方的相近结果。</p>':''}</div>${r.similarity===null?'':MagicCharts.ring(r.similarity)}</div><div class="result-actions"><button class="button primary" data-action="poster">生成朋友圈图片 ${arrow}</button><button class="button" data-action="restart">重新测试</button></div></div>
      </section>
      <div class="celestial-rule" aria-hidden="true">${star}<span>☾ · ✦ · ☽</span>${star}</div>
      <div class="result-analysis"><section class="star-map"><h2 class="section-title">你的魔法星图</h2><div id="radar">${MagicCharts.radar(r.profile,role.profile,showReference)}</div><div class="chart-legend"><span><i class="legend-gold"></i>你的画像</span><button data-action="toggle-reference" aria-pressed="true"><i class="legend-teal"></i>角色轮廓 <small>点击切换</small></button></div><p class="trait-caption">每一条轴，都是你的一种选择倾向。<br>点击图例可隐藏角色参照；高低不代表优劣。</p><details class="chart-values"><summary>查看六维详细分数</summary><table><caption class="sr-only">你的画像与角色轮廓对照</caption><thead><tr><th>维度</th><th>你</th><th>角色</th></tr></thead><tbody>${r.profile.map((v,i)=>`<tr><th>${MagicData.dimensions[i]}</th><td>${Math.round(v)}</td><td>${role.profile[i]}</td></tr>`).join('')}</tbody></table></details></section>
      <section class="why-you"><h2 class="section-title">为什么是你</h2><p class="portrait">${role.portrait}</p><ul class="evidence-list">${r.evidence.map(e=>`<li><span>你的选择 · ${e.title}</span>「${e.text}」</li>`).join('')}</ul><p class="dominant">相对更明显的选择倾向<br><strong>${MagicData.dimensions[r.strongest[0].i]} <em>与</em> ${MagicData.dimensions[r.strongest[1].i]}</strong></p></section></div>
      <section class="resonance-section"><div><h2>你与角色的共鸣</h2><p>这三种倾向，在你们身上都更鲜明。</p></div><div class="resonance-bars">${resonance.map(d=>`<div class="resonance-row"><span>${MagicData.dimensions[d.i]}</span><div class="resonance-track"><b style="width:${r.profile[d.i]}%"></b><i style="left:${role.profile[d.i]}%" title="角色轮廓 ${role.profile[d.i]}"></i></div><strong>${Math.round(r.profile[d.i])}</strong></div>`).join('')}<p class="trait-caption">金色条形：你的倾向 · 青色标线：角色轮廓</p></div></section>
      <div class="insights"><section><span class="insight-number">I</span><h2>天赋所在</h2><p>${role.strength}</p></section><section><span class="insight-number">II</span><h2>留意的盲点</h2><p>${role.blind}</p></section></div>
      <div class="growth"><span>给你的一点魔法</span><p>${role.tip}</p></div>
      <section class="secondary-person"><img src="${MagicMedia[r.secondary.id].file}" alt="${r.secondary.name}的电影剧照" loading="lazy" width="110" height="110"><div><p>${r.closeMatch?'与你的答案也很接近':'你也有一点 TA 的影子'}</p><h2>${r.secondary.name}</h2><span>${r.secondary.line}</span></div></section>
      <div class="result-actions bottom-actions"><button class="button primary" data-action="poster">保存我的魔法镜像 ${arrow}</button><button class="button" data-action="restart">重新测试</button></div><div class="result-links"><button class="text-button" data-action="review">回看并修改答案</button></div>${rules}
      <p class="image-credit">电影剧照 © Warner Bros. Entertainment Inc. / Wizarding World Digital</p>
    </main>${footer}</div>`;
    window.scrollTo(0,0);document.querySelector('#result-title').focus({preventScroll:true});
  }

  app.addEventListener('change',e=>{if(e.target.matches('input[name="answer"]')){answers[index]=Number(e.target.value);save();document.querySelector('[data-action="next"]').disabled=false;const done=answers.filter(a=>a!==null).length;document.querySelector('.progress-track').setAttribute('aria-valuenow',done);document.querySelector('.progress-fill').style.width=`${done/total*100}%`;}});
  async function action(name,button){
    if(name==='toggle-reference'){showReference=!showReference;const r=MagicEngine.result(answers);document.querySelector('#radar').innerHTML=MagicCharts.radar(r.profile,r.role.profile,showReference);button.setAttribute('aria-pressed',String(showReference));return;}

    if(name==='start'){if(MagicEngine.valid(answers,true)){renderResult();}else{if(answers[index]!==null)index=answers.findIndex(a=>a===null);renderQuiz();}return;}
    if(name==='home'){renderHome();window.scrollTo(0,0);return;}
    if(name==='about'){document.querySelector('#about').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});return;}
    if(name==='next'&&answers[index]!==null){if(index<total-1){index++;save();renderQuiz();}else{save();renderResult();}return;}
    if(name==='prev'&&index>0){index--;save();renderQuiz();return;}
    if(name==='restart'){answers=Array(total).fill(null);index=0;save();renderQuiz();return;}
    if(name==='review'){index=0;save();renderQuiz();return;}
    if(name==='poster'){
      const result=MagicEngine.result(answers),code=MagicEngine.encode(answers),original=button.innerHTML;
      const buttons=[...document.querySelectorAll('[data-action="poster"]')];buttons.forEach(b=>b.disabled=true);button.textContent='正在绘制你的魔法镜像…';
      try{
        const blob=await MagicPoster.create(result);
        if(screen!=='result'||MagicEngine.encode(answers)!==code)return;
        posterBlob=blob;if(posterURL)URL.revokeObjectURL(posterURL);posterURL=URL.createObjectURL(posterBlob);
        document.querySelector('#poster-preview').src=posterURL;
        const link=document.querySelector('#download-poster');link.href=posterURL;link.download=`魔法映照-${result.role.name}.png`;
        document.querySelector('#poster-message').textContent='1080 × 1600 PNG · 图片在本机生成';document.querySelector('#poster-dialog').showModal();
      }catch{notify('图片暂时无法导出，请通过网站地址访问后重试');}
      finally{buttons.forEach(b=>b.disabled=false);button.innerHTML=original;}return;
    }
    if(name==='close-poster'){document.querySelector('#poster-dialog').close();return;}
    if(name==='native-share'){const file=posterBlob&&new File([posterBlob],'我的魔法镜像.png',{type:'image/png'});if(file&&navigator.canShare?.({files:[file]})){try{await navigator.share({files:[file],title:'我的魔法镜像'});}catch(e){if(e.name!=='AbortError')document.querySelector('#poster-message').textContent='未能打开分享，请下载图片后分享。';}}else document.querySelector('#poster-message').textContent='此浏览器不支持直接分享图片，请下载后发朋友圈，或长按图片保存。';}
  }
  document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b&&!b.disabled)action(b.dataset.action,b);});
  document.addEventListener('keydown',e=>{if(screen==='quiz'&&!document.querySelector('dialog[open]')&&!e.ctrlKey&&!e.altKey&&!e.metaKey&&/^[1-4]$/.test(e.key)){const input=document.querySelector(`input[value="${Number(e.key)-1}"]`);input.checked=true;input.dispatchEvent(new Event('change',{bubbles:true}));input.focus();}});
  if(/^#v[12]=/.test(location.hash))history.replaceState(null,'',location.pathname+location.search);
  renderHome();
})();
