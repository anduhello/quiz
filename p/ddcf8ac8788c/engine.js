'use strict';
// Narrative preferences, NOT latent trait estimates. All keys are editorial.
const MOTIVES=['自主边界','情感连接','照护担当','成就精进','秩序规划','主导布局','表达锋芒','守护延续'];
const MOTIVE_NOTES=['希望关键选择由自己作出','把真实连接放在优先位置','愿意为他人承担具体责任','追求能力与作品的突破','通过明确规则与计划推进','倾向掌握资源与谈判主动','在意独特表达与存在感','珍惜旧有关系与重要承诺'];
const PROFILE_VALUES={shadowheart:[95,55,45,20,48,35,12,85],astarion:[100,38,10,45,20,88,80,25],karlach:[72,100,85,30,12,8,90,65],gale:[58,70,62,100,80,45,75,30],laezel:[48,15,42,90,100,78,60,30],wyll:[32,78,100,65,85,15,42,90],minthara:[85,20,12,80,65,100,35,50],halsin:[80,90,100,15,35,8,20,75],jaheira:[60,35,90,55,100,70,15,85],minsc:[20,85,100,35,50,5,95,75],raphael:[50,12,5,88,72,95,100,30],gortash:[45,15,10,85,95,100,40,65],ketheric:[25,55,40,15,90,75,5,100],orin:[85,10,5,75,8,65,100,25]};
function item(id,title,texts,motives,adaptive=false){if(typeof FLAVOR!=='undefined'&&FLAVOR[id]){[title,texts]=FLAVOR[id];}return {id,title,options:texts.map((text,i)=>({text,motive:motives[i]})),adaptive};}
const CORE_ITEMS=[
 item('c01','营地需要一个新的相处约定。你最想优先保留什么？',['每个人有权保留不想解释的私人空间。','让人可以直接说出需要，不必猜来猜去。','有人遇到困难时，队友能切实地接住他。','重要安排有人牵头，不会一再失去方向。'],[0,1,2,5]),
 item('c02','一段旅途快结束了，什么最让你觉得这趟值得？',['遇见了能分享真实感受的伙伴。','把一直做不好的事情练到了满意。','遇见变化也没乱，计划真正发挥了作用。','留下了只有我能讲出的独特故事。'],[1,3,4,6]),
 item('c03','你有一笔意外所得，准备先用在哪件事上？',['补上伙伴们一直缺少的东西。','建立可持续的补给与应急安排。','完成一个风格鲜明、能留下名字的作品。','修复与一位重要旧友之间的联系。'],[2,4,6,7]),
 item('c04','你第一次负责一项共同任务，更希望别人记得什么？',['我把任务做到超出原先的水平。','我能调动资源，让关键选择握在手里。','我没有丢下原本答应照顾的人与事。','即使意见不同，我也守住了自己的判断。'],[3,5,7,0]),
 item('c05','熟悉的生活突然改变，你会先做哪种安排？',['建立一套新的流程，让日子重新可预期。','找一种自己的表达方式，让变化有个出口。','先确保自己仍然有退出或改选的余地。','找信任的人谈谈，不独自消化这一切。'],[4,6,0,1]),
 item('c06','一位伙伴邀你一起做大一件事，哪个条件最能打动你？',['我可以参与重要决策，投入有实际保障。','这件事能让过去珍惜的东西继续存在。','我们可以在过程中互相理解，而不只是搭伙。','事情确实能为需要帮助的人带来支持。'],[5,7,1,2]),
 item('c07','一场争论结束后，你最不希望自己失去什么？',['清楚表达过立场，而非悄悄消失在人群里。','保留最后是否参与的决定权。','没有忽视处境最困难的那个人。','关于问题的理解与能力，能因此进一步。'],[6,0,2,3]),
 item('c08','如果能给未来的营地留下一样东西，你想留下……',['一项大家还能记得并延续的传统。','让重要决定与资源始终有保障的方案。','一份不断改进、可以继续深挖的知识。','即使换了负责人也能正常运转的规则。'],[7,5,3,4]),
 item('c09','一份长期合作邀请摆在面前，哪个细节最影响你是否答应？',['是否允许我保留自己的边界与选择。','是否能与合作者建立坦诚的信任。','是否能对某些人的生活产生真实帮助。','是否能参与条件制定，而非只能接受安排。'],[0,1,2,5]),
 item('c10','你终于拥有一个只属于自己的休息日，你最想……',['约一个不用表演坚强的人，好好相处。','钻研一件让我看见进步的难题。','把生活与下一阶段安排清楚，放下悬念。','做一件带着自己鲜明风格、想做很久的事。'],[1,3,4,6]),
 item('c11','有人想请你重新设计一处公共空间，你最先注意……',['谁一直不方便使用，它能怎样照顾到他们。','动线、规则与维护怎样才能长久运转。','能否让它有令人记得的气质与个性。','旧空间里哪些共同记忆值得被保留。'],[2,4,6,7]),
 item('c12','一次重要尝试失败了，什么最能支持你再出发？',['我还想证明这个问题能被做得更好。','只要重新掌握资源与条件，就还有转机。','我不想让一直珍惜的目标就这样结束。','失败不能替我决定以后还想走哪条路。'],[3,5,7,0]),
 item('c13','有人说你的坚持没有必要，你更可能解释……',['没有清楚的安排，大家会付出更大的代价。','我需要让自己的观察与感受有一个位置。','我可以听建议，但最后需要自己同意。','这件事关乎我们怎样互相理解。'],[4,6,0,1]),
 item('c14','眼下有四件都合理的事，你更愿意先投入哪件？',['争取一个能改变后续谈判的位置。','把一项快被放弃的重要承诺维持下去。','修复一次误会，让两个人真正听见彼此。','陪一个暂时无力独自应付的伙伴走过难关。'],[5,7,1,2]),
 item('c15','你想拒绝一项安排时，最希望自己的拒绝保护了什么？',['自己的声音，不再被当成无关紧要。','自由选择，而非被别人的期待推着走。','现有精力，留给真正需要我支持的人。','学习与精进的时间，不被低价值事务占满。'],[6,0,2,3]),
 item('c16','你会因哪一种失去感到最遗憾？',['与过去重要的人和承诺再无连接。','原本可以争取主动，却始终只能接受安排。','本来能深入探索，却没有去试更高的可能。','局面明明可安排，却因为混乱消耗了所有人。'],[7,5,3,4])
];
const FOLLOWUPS=[
 item('f01','一位你信任的负责人判断失误。你更想先确保……',['规则能重新公开接受检验，而不是只换个人。','自己不再被一个人的决定绑住。','这段关系能说清误会，而非从此疏远。','关键资源先稳住，避免再次陷入被动。'],[4,0,1,5],true),
 item('f02','你并不缺基本安全，下一步更想争取……',['不需要向谁证明，也能自己选择的生活。','能把重要的事情做到更高水平的机会。','在关键谈判中有实际影响力的位置。','能让人记住我的独特声音与作品。'],[0,3,5,6],true),
 item('f03','同样是照顾伙伴，你更认同哪一种出发点？',['让对方知道我在乎，并能靠近彼此。','有人需要我，我就承担眼前能做的事。','我们之间的重要约定不该轻易中断。','把支持变成稳定流程，而非只靠临时热心。'],[1,2,7,4],true),
 item('f04','你有一项不愿放手的旧计划，最可能留下你的理由是……',['它连接着对我很重要的人与过去。','再向前一步，就能真正突破能力的上限。','它仍是让我掌握关键局面的最好办法。','它承载着我不愿被别人替代的表达。'],[7,3,5,6],true),
 item('f05','队伍需要领导者，你更愿意承担哪一种工作？',['建立可解释、可交接的规则。','掌握信息与资源，决定什么时候推进。','在大家缺乏支持时挺身而出。','把鲜明的想法说出来，带动大家的注意。'],[4,5,2,6],true),
 item('f06','如果必须对自己的生活作出一个承诺，你会选……',['不为了赢得认可而放弃自主边界。','不因为受过伤，就放弃真实的连接。','不让能被帮助的人只剩下独自承担。','不把仍然珍惜的人与事轻易留在过去。'],[0,1,2,7],true),
 item('f07','你在谈判中最有满足感的时刻是……',['自己终于可以自由地决定接受或离开。','把条件安排成对长期局面有利的结构。','别人真正理解并记住了我的想法。','用知识和准备，提出了更高质量的方案。'],[0,5,6,3],true),
 item('f08','你更想把“可靠”体现在哪里？',['困难来时，我会具体行动、照顾需要的人。','既定承诺不会因为时间长了就被遗忘。','规则与细节经得起检验，不靠运气。','能诚实地回应关系，不让人一直猜。'],[2,7,4,1],true),
 item('f09','两种选择都可能成功，你更想要哪种成功？',['大家依然完整地在一起，我也享受了过程。','我确实做到了过去做不到的事情。','留下的作品一眼就能让人认出是我。','重要决定不再由别人替我作出。'],[1,3,6,0],true),
 item('f10','一段关系陷入低谷，最容易让你继续投入的是……',['我们曾经许下的承诺仍然有分量。','对方仍愿意袒露真实感受、一起理解。','这段关系里仍有需要我照顾的处境。','彼此愿意重新约定清楚的边界与规则。'],[7,1,2,4],true),
 item('f11','一件事终于得到众人认可，你会最先看向……',['还有多少可以探索和精进的空间。','接下来能争取怎样的资源与主动权。','自己的表达有没有被准确地看见。','怎样让成果成为可以持续运转的安排。'],[3,5,6,4],true),
 item('f12','眼前的便利要付出代价，你会优先保留什么？',['独立作出选择的权利。','对重要旧约与关系的忠诚。','对具体人的关心与支持。','让心里的真实想法得到表达的机会。'],[0,7,2,6],true),
 item('f13','当情绪与计划冲突，你会把更多注意力放在……',['让人与人之间的感受被听到。','让安排有一致性，不随当下情绪摇摆。','让关键条件仍然在自己的掌握之中。','让内心强烈的东西有一个表达的出口。'],[1,4,5,6],true),
 item('f14','你愿意忍受一段辛苦，通常是因为……',['有真实的人会因此得到支持。','值得珍惜的东西可以继续存在。','自己的能力与理解能够明显地成长。','做完之后，自己能拥有更大的选择空间。'],[2,7,3,0],true),
 item('f15','别人对你有很高期待，你最希望他们先明白……',['我需要决定自己愿意承担哪一种期待。','我在意的是成长，不只是把事情做完。','我的付出需要对应清楚的条件与位置。','我不想失去原本支撑自己的重要连接。'],[0,3,5,7],true),
 item('f16','经历混乱之后，你最想重建的是什么？',['可预期、可执行的生活秩序。','能够安心交流与陪伴的关系。','能让重要目标持续下去的资源与主动。','可以持续地照顾自己和他人的环境。'],[4,1,5,2],true)
];
const ALL_ITEMS=[...CORE_ITEMS,...FOLLOWUPS];
const ITEM_MAP=Object.fromEntries(ALL_ITEMS.map(q=>[q.id,q]));
function preference(character,q){const values=q.options.map(o=>PROFILE_VALUES[character.id][o.motive]);const ordered=values.map((v,i)=>({v,i})).sort((a,b)=>a.v-b.v||a.i-b.i);const rank=Array(4);ordered.forEach((x,j)=>rank[x.i]=j/3);return rank;}
function validRecord(a){return a&&ITEM_MAP[a.id]&&(a.skip===true||(Number.isInteger(a.best)&&Number.isInteger(a.worst)&&a.best>=0&&a.best<4&&a.worst>=0&&a.worst<4&&a.best!==a.worst));}
function scoreV2(records){if(!Array.isArray(records)||records.some(a=>!validRecord(a))||new Set(records.map(a=>a.id)).size!==records.length)throw Error('Invalid answers');const known=records.filter(a=>!a.skip);const ranked=CHARACTERS.map((character,i)=>{let sum=0;known.forEach(a=>{const p=preference(character,ITEM_MAP[a.id]);sum+=(p[a.best]+1-p[a.worst])/2;});return {character,index:i,score:known.length?sum/known.length*100:0};}).sort((a,b)=>b.score-a.score||a.index-b.index);const exposure=Array(8).fill(0),signed=Array(8).fill(0);known.forEach(a=>{const q=ITEM_MAP[a.id];q.options.forEach(o=>exposure[o.motive]++);signed[q.options[a.best].motive]++;signed[q.options[a.worst].motive]--;});const salience=signed.map((v,i)=>exposure[i]?Math.max(0,Math.min(100,50+100*v/exposure[i])):50);return {ranked,known:known.length,skipped:records.length-known.length,gap:ranked[0].score-ranked[1].score,salience,exposure};}
function nextItem(records){if(records.length<CORE_ITEMS.length)return CORE_ITEMS[records.length];const r=scoreV2(records);if(records.length>=26||(records.length>=22&&(r.gap>=6||r.known<12)))return null;const unused=FOLLOWUPS.filter(q=>!records.some(a=>a.id===q.id));let best=null,bestValue=-1;for(const q of unused){const predictions=r.ranked.slice(0,4).map(x=>preference(x.character,q));let value=0;for(let a=0;a<predictions.length;a++)for(let b=a+1;b<predictions.length;b++)for(let i=0;i<4;i++)value+=(predictions[a][i]-predictions[b][i])**2/(a+b+1);if(value>bestValue){bestValue=value;best=q;}}return best;}
function isValidPath(records){if(!Array.isArray(records))return false;const prefix=[];for(const a of records){if(!validRecord(a)||nextItem(prefix)?.id!==a.id)return false;prefix.push(a);}return true;}
function evidenceFor(records,character){return records.filter(a=>!a.skip).map(a=>{const q=ITEM_MAP[a.id],p=preference(character,q);return {q,a,agreement:(p[a.best]+1-p[a.worst])/2};}).sort((a,b)=>b.agreement-a.agreement).slice(0,3);}
if(typeof module!=='undefined')module.exports={MOTIVES,CORE_ITEMS,FOLLOWUPS,PROFILE_VALUES,ITEM_MAP,scoreV2,nextItem,preference,isValidPath};
