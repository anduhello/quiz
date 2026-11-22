const MagicEngine = (() => {
  function valid(answers, complete=false) {
    return Array.isArray(answers) && answers.length===MagicData.questions.length && Array.from(answers).every((a,i)=>a===null||Number.isInteger(a)&&a>=0&&a<MagicData.questions[i].options.length) && (!complete||answers.every(a=>a!==null));
  }
  function result(answers) {
    if(!valid(answers,true)) throw new Error('请先完成全部题目');
    const selected=answers.map((a,i)=>MagicData.questions[i].options[a]);
    const profile=MagicData.dimensions.map((_,d)=>selected.reduce((s,o)=>s+o.scores[d],0)/selected.length);
    const distance=role=>Math.sqrt(profile.reduce((s,v,i)=>s+(v-role.profile[i])**2,0)/profile.length);
    const ranked=MagicData.roles.filter(r=>!r.hidden).map(role=>({role,distance:distance(role)})).sort((a,b)=>a.distance-b.distance);
    const control=selected.filter(o=>o.control).length;
    const hidden=control>=4 && profile[4]>=65 && profile[1]>=50 && profile[2]<=46;
    const role=hidden?MagicData.roles.find(r=>r.hidden):ranked[0].role;
    const similarity=Math.max(0,Math.round(100-distance(role)));
    const strongest=profile.map((v,i)=>({v,i})).sort((a,b)=>b.v-a.v).slice(0,2);
    // 每个理由引用真实选项，并选择与获选角色轮廓最接近的两个情境。
    const evidence=selected.map((o,i)=>({text:o.text,title:MagicData.questions[i].title,i,dist:o.scores.reduce((s,v,d)=>s+(v-role.profile[d])**2,0)})).sort((a,b)=>a.dist-b.dist).slice(0,2);
    return {role,profile,similarity,secondary:ranked.find(r=>r.role.id!==role.id).role,strongest,evidence,hidden,control};
  }
  const encode=answers=>answers.map(a=>a===null?'x':String(a)).join('');
  function decode(value){if(typeof value!=='string'||value.length!==MagicData.questions.length||!/^[0-3]+$/.test(value))return null;const a=[...value].map(Number);return valid(a,true)?a:null;}
  return {valid,result,encode,decode};
})();
