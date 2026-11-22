(function (root) {
 'use strict';
 const EPS=1e-9;
 function validateAnswers(answers,questions){return Array.isArray(answers)&&answers.length===questions.length&&answers.every((a,i)=>Number.isInteger(a)&&a>=0&&a<questions[i].options.length);}
 function summarize(answers,questions,axes){
  if(!validateAnswers(answers,questions))throw new Error('请完成全部题目后查看结果。');
  const values=axes.map(()=>[]);
  questions.forEach((q,i)=>values[q.axis].push(q.options[answers[i]].value));
  const vector=values.map(v=>v.reduce((a,b)=>a+b,0)/v.length);
  const changing=values.map((v,i)=>({axis:i,range:Math.max(...v)-Math.min(...v),low:v.filter(x=>x<=33).length,high:v.filter(x=>x>=67).length})).filter(x=>x.range===100&&x.low>=2&&x.high>=2).map(x=>x.axis);
  return {vector,changing,balanced:vector.every(v=>Math.abs(v-50)<=10),samePosition:answers.every(a=>a===answers[0])};
 }
 function rank(vector,characters){
  if(vector.length!==8||vector.some(x=>!Number.isFinite(x)||x<0||x>100))throw new Error('画像数据不完整。');
  return characters.filter(c=>c.eligible&&Array.isArray(c.profile)&&c.profile.length===8&&c.profile.every(v=>Number.isFinite(v)&&v>=0&&v<=100)).map(c=>{
   const deltas=vector.map((x,i)=>Math.abs(x-c.profile[i]));
   const distance=Math.sqrt(deltas.reduce((s,d)=>s+(d/100)**2,0)/8);
   return {character:c,distance,rawScore:100*(1-distance),score:Math.round(100*(1-distance)),deltas};
  }).sort((a,b)=>Math.abs(a.distance-b.distance)<EPS?a.character.id.localeCompare(b.character.id,'en'):a.distance-b.distance);
 }
 function explain(vector,result){
  const p=result.character.profile;
  const closest=result.deltas.map((delta,axis)=>({axis,delta,extreme:Math.abs(vector[axis]-50),strength:Math.abs(p[axis]-50)})).sort((a,b)=>(b.extreme-b.delta)-(a.extreme-a.delta)||a.axis-b.axis);
  // 均值居中或方向相反的轴，不用来制造共同底色；不足三项时保留实际项数。
  const common=closest.filter(x=>x.delta<=20&&x.strength>=15&&x.extreme>10&&Math.sign(vector[x.axis]-50)===Math.sign(p[x.axis]-50)).slice(0,3);
  const difference=result.deltas.indexOf(Math.max(...result.deltas));
  return {common,difference};
 }
 root.ManorEngine={validateAnswers,summarize,rank,explain};
})(typeof globalThis!=='undefined'?globalThis:window);
