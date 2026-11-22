(function(root){'use strict';
 const styles=[
  [{label:'观察蓄势',description:'面对还没成形的事情，你更常先看清来龙去脉，再选择介入的位置。你把介入前的了解放在较前的位置。',strength:'你倾向为观察与核对留出时间，再决定怎样介入。',blind:'若一直等到信息齐全，起步可能被反复推迟。',advice:'给准备设一个截止点，再选一件成本很小的事先做起来。',quote:'我会先看清局面，再决定在哪里出手。'},
   {label:'主动介入',description:'面对迟迟没有进展的事情，你更常先提出方案或开始推动。你愿意通过行动获得反馈，再考虑接下来怎样做。',strength:'你更常主动提出起步办法，让一件事先开始。',blind:'若未经共同确认就先推进，参与者可能各自理解着不同的目标。',advice:'开始前多问一句“我们最想解决的是什么”，把行动与共同目标对齐。',quote:'让事情向前一步，比站在原地猜测更有用。'}],
  [{label:'独处蓄能',description:'你更常在自己的空间里整理想法，或独自享受一段活动。重视一段关系，也可以同时保留不被打扰的时间。',strength:'你倾向在日常安排里为独处和自己的节奏留出空间。',blind:'若独处安排没有告知相关的人，对方可能不清楚何时再联系合适。',advice:'把需要独处说成一个具体安排，也告诉对方什么时候愿意再聊。',quote:'留一段安静给自己，才有余力认真靠近。'},
   {label:'亲近协作',description:'你更常选择共同活动、交流和协作。有人并肩的安排，在你这次的选择里出现得更多。',strength:'你更常把共同参与和交流放进自己的活动安排。',blind:'若共同安排占满空闲，留给各自独处的时间可能变少。',advice:'为彼此保留不同的活动方式，亲近也可以包含不必随时回应的空间。',quote:'并肩不是负担，而是我愿意选择的力量。'}],
  [{label:'审慎核实',description:'在信息有限或关系还不熟悉时，你更常先验证，再逐步托付。你更常让信任随实际接触逐步增加。',strength:'你倾向在托付前核对约定和实际情况。',blind:'若每次托付都从头验证，确认过程会占用更多时间。',advice:'明确一个可完成的小约定，让信任随实际经验逐步增加。',quote:'信任需要时间，但认真会被我记住。'},
   {label:'先予信任',description:'面对新的合作或善意，你更常先给一个机会，再依据实际表现调整。你愿意让关系从较开放的起点开始。',strength:'你更常先给对方一个兑现承诺的机会。',blind:'若先答应托付再补约定，责任与退出条件可能没有讲清。',advice:'保留开放，也把时间、责任和退出条件说清楚。',quote:'我愿意先为善意留一扇门。'}],
  [{label:'临场应变',description:'做事时，你更常保留调整余地，依据眼前反馈重新安排。比起提前锁定全部细节，你倾向让流程随情况变化。',strength:'你倾向为后续调整留下余地。',blind:'若调整频繁又没有记录，下一步安排可能需要反复确认。',advice:'给灵活安排留下两三个固定检查点，既能调整，也能知道是否在前进。',quote:'路线可以改，脚步不必因此停下。'},
   {label:'预先规划',description:'做事时，你更常先明确顺序、步骤或约定。你把安排看作做事的一部分，倾向在推进前建立可对照的流程。',strength:'你倾向在开始前说明步骤、顺序或时间安排。',blind:'若前期安排过细，情况变化后需要花时间更新计划。',advice:'在计划里预留一次重新判断的机会，把修改也当成计划的一部分。',quote:'把下一步安排好，心里便多一寸从容。'}],
  [{label:'熟悉稳妥',description:'在低风险的日常选择中，你更常优先选择验证过的体验。熟悉的经验在你的决定里占有较大分量。',strength:'你更常把已有体验作为下一次选择的参考。',blind:'若所有陌生选项都先排除，实际接触新体验的机会会减少。',advice:'给新尝试划一个很小的预算或时间范围，不需要一次改变所有习惯。',quote:'我珍惜熟悉，也可以为新可能留一点位置。'},
   {label:'尝试未知',description:'在成本可控的情况下，你更常愿意接触陌生的方案或体验。新的可能性会吸引你主动多走一步。',strength:'你更常把未曾接触的方案放进考虑范围。',blind:'若尝试前未核对成本，新体验可能占用超出预期的时间或预算。',advice:'开始前定一个小的完成标准，了解实际投入后再决定是否继续。',quote:'门后的答案，值得我亲自看一眼。'}],
  [{label:'坚守立场',description:'出现可以协商的分歧时，你更常先保留自己的判断和选择。你倾向在共同决定里留下自己的需要与边界。',strength:'你更常把自己想保留的选择带进讨论。',blind:'若只给出结论却不说明原因，对方可能不清楚你想保留的边界。',advice:'先说出在意的原因，再提出你愿意协商的部分。',quote:'我可以认真听你，也不必丢掉自己的位置。'},
   {label:'维护关系',description:'出现可以协商的分歧时，你更常先寻找能继续相处的方案。你愿意为了共同的体验调整一部分个人选择。',strength:'你更常把共同相处和达成协调纳入考虑。',blind:'若先让步再确认需要，自己的重要条件可能没有进入共同决定。',advice:'先分清“可以让步”和“需要被尊重”，再讨论折中的办法。',quote:'我愿意靠近，也会把自己的需要一起带上。'}],
  [{label:'私下消化',description:'对熟悉的人，你也更常先独自整理感受，再决定怎样表达。你在这次选择里较常把整理放在表达之前。',strength:'你倾向先留一段整理感受的时间，再决定怎样说。',blind:'若整理结束后仍没有后续表达，相关的人可能不知道你期待怎样回应。',advice:'即使还没整理完，也可以先说“我需要一点时间，之后想和你谈谈”。',quote:'有些话，我会先放在心里照亮，再交给你。'},
   {label:'外显表达',description:'对熟悉的人，你更常及时说出感受、想法和需要。你把感受说出来，让对方有机会知道你现在的想法。',strength:'你更常主动把自己的感受和需要说出来。',blind:'若一次表达的信息较多，对方可能需要时间整理和回应。',advice:'说清此刻更需要倾听、建议还是行动，再留一个让对方回应的停顿。',quote:'把需要说出来，是我认真对待关系的方式。'}],
  [{label:'重设方向',description:'原目标持续受阻时，你更常重新评估是否值得继续。改变方向对你而言，也是一种重新安排时间与投入的选择。',strength:'你更常在受阻时重新考虑目标是否仍值得投入。',blind:'若只改变目标、没有回看卡点，就可能难以分清目标不合适还是方法需要调整。',advice:'区分“目标已经不重要”和“过程暂时很难”，为后者再做一次小规模尝试。',quote:'换一条路，也可以是认真走向自己的决定。'},
   {label:'持续攻坚',description:'目标遇到阻力时，你更常保留原来的方向，继续调整办法。你在意的是把一件仍然重要的事往前推进。',strength:'你更常在进展缓慢时保留原目标，继续尝试。',blind:'若保留原目标却不设复盘点，投入可能继续累积而缺少重新选择的时机。',advice:'定期核对目标是否仍值得，也把休息、求助和退出条件写进投入方式。',quote:'我会把值得的事继续做，也记得照看赶路的人。'}]
 ];
 const centerQuotes=[
  '先看清当下的条件，再决定要不要迈出第一步。',
  '留给自己空间，也为愿意的联结留一扇门。',
  '信任可以慢慢生长，核对也可以温和进行。',
  '计划与调整之间，我可以找到此刻合适的节奏。',
  '熟悉与新鲜，都可以是我认真选择的答案。',
  '把自己的需要和共同的相处，一起放进考虑。',
  '何时说出口，由我看清感受后再决定。',
  '继续或转向之前，我愿意再问一次为什么。'
 ];
 const balancedTraits=[
  {label:'倾向居中',description:'这次八条选择轴都接近中间，没有哪一端持续形成鲜明偏好。',strength:'当前回答没有持续偏向某一端的选择模式。',blind:'若只靠一个角色标签总结，题目之外的差异可能被忽略。',advice:'把结果当作回看选择的线索，先保留暂时说不准的部分。',quote:'我可以暂时不定型，让具体的选择慢慢说明自己。'},
  {label:'情境待细看',description:'均值接近中间，可能来自温和偏好，也可能来自不同场景下的不同选择。单看平均值不能分清两者。',strength:'本轮回答保留了需要结合具体场景继续看的部分。',blind:'若把平均值当作每一次的做法，不同情境中的选择会被压成一个标签。',advice:'回看一题最像自己的答案，再回想当时最在意的条件。',quote:'比起急着贴标签，我更想知道自己为何这样选择。'},
  {label:'标签留余地',description:'角色比较提供的是一组叙事参照，接近的候选也不必替代你对自己的理解。',strength:'这份结果提供的是整理线索的起点，仍有问卷没有问到的内容。',blind:'若把一个角色当成完整结论，可能会把生活中尚未被提问的侧面漏掉。',advice:'保留自己认同的描述，也直接划掉不符合的部分。',quote:'相似可以成为一面镜子，不必成为框住我的名字。'}
 ];
 function at(axis,value,axes){
  if(value>=40&&value<=60)return{
   label:'倾向居中',
   description:'在“'+axes[axis].low+'”与“'+axes[axis].high+'”之间，你这次的均值较接近中间，尚未呈现明确的单侧偏好。仅凭均值不能判断是否随场景切换。',
   strength:'这次回答在“'+axes[axis].label+'”上没有形成鲜明单侧方向。',
   blind:'若只用一个方向概括，具体场景中不同的选择可能被忽略。',
   advice:'回看这一轴的一两道具体题，想想当时最在意的条件。',
   quote:centerQuotes[axis]
  };
  return styles[axis][value>60?1:0];
 }
 function uniqueQuotes(preferred){
  return [...new Set([...preferred,...balancedTraits.map(t=>t.quote),...centerQuotes])].slice(0,3);
 }
 function build(vector,ranked,axes){
  const match=ranked[0],details=root.ManorEngine.explain(vector,match),balanced=vector.every(v=>Math.abs(v-50)<=10);
  const priority=vector.map((v,i)=>({i,e:Math.abs(v-50)})).sort((a,b)=>b.e-a.e||a.i-b.i);
  const traits=balanced?balancedTraits:priority.slice(0,3).map(x=>at(x.i,vector[x.i],axes));
  const self=balanced?'这次八条选择轴都接近中间，问卷暂时没有给出鲜明的单侧轮廓。居中可能来自温和偏好，也可能来自不同情境下的不同选择；仅凭平均值还不能分清。你可以结合具体题目和接近的角色候选继续看，不必为了得到一个标签而强行选边。':traits.map(t=>t.description).join(' ');
  const trust=at(2,vector[2],axes),connection=at(1,vector[1],axes),order=at(3,vector[3],axes),persist=at(7,vector[7],axes);
  return {
   details,traits,self,balanced,
   quotes:uniqueQuotes(traits.map(t=>t.quote)),
   relationship:connection.description+' '+trust.description,
   work:order.description+' '+persist.description,
   blindspots:traits.slice(0,2).map(t=>({label:t.label,text:t.blind,advice:t.advice})),
   common:details.common.map((item,i)=>{
    const style=at(item.axis,vector[item.axis],axes);
    return {axis:item.axis,title:['第一底色','另一个侧面','相近的选择'][i]+' · '+style.label,text:style.description+' 角色的编辑画像也偏向这一侧；这只是选择方向相近，不表示你与TA有相同经历。',delta:item.delta};
   })
  };
 }
 root.ManorNarrative={styles,at,build};
})(globalThis);
