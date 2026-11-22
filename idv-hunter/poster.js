(function(root){'use strict';
 async function create(data,result,vector,narrative,tiedNames=[]){
  if(document.fonts?.ready)await document.fonts.ready;
  const img=new Image();img.src=result.character.image;await new Promise((resolve,reject)=>{if(img.complete&&img.naturalWidth)return resolve();img.onload=resolve;img.onerror=()=>reject(Error('角色图片暂未加载成功，请稍后重试。'));});
  const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=2450;const c=canvas.getContext('2d');if(!c)throw Error('当前浏览器暂不支持结果图片。');
  const colors={paper:'#f4efe4',ink:'#282623',accent:'#783d44',brass:'#a18556',muted:'#796e63'};
  c.fillStyle=colors.paper;c.fillRect(0,0,1080,2450);c.strokeStyle=colors.brass;c.lineWidth=2;c.strokeRect(26,26,1028,2398);
  function text(s,x,y,size=28,color=colors.ink,font='sans-serif'){c.font=size+'px '+font;c.fillStyle=color;c.fillText(s,x,y);}
  function lines(s,x,y,width,size=27,lineHeight=46,max=99){c.font=size+'px sans-serif';let row='',count=0;for(const char of String(s)){if(c.measureText(row+char).width>width&&row){text(row,x,y,size);y+=lineHeight;count++;row='';if(count>=max)return y;}row+=char;}if(row){text(row,x,y,size);y+=lineHeight;}return y;}
  function rule(y){c.strokeStyle=colors.brass;c.lineWidth=1;c.beginPath();c.moveTo(65,y);c.lineTo(1015,y);c.stroke();}
  function title(n,s,y){text(n,65,y,39,colors.accent,'Georgia');text(s,138,y,31,colors.ink,'serif');}
  c.textAlign='center';text('庄园回声 · '+data.site.edition,540,100,30,colors.accent,'serif');if(tiedNames.length>1)text('并列角色组：'+tiedNames.join(' / '),540,136,21,colors.muted);c.textAlign='left';
  const scale=Math.min(365/img.naturalWidth,480/img.naturalHeight);const w=img.naturalWidth*scale,h=img.naturalHeight*scale;c.drawImage(img,70+(365-w)/2,150+(480-h),w,h);
  text(result.character.role,478,245,51,colors.accent,'serif');lines(result.character.name,480,295,510,25,39,2);text(result.score+'%',478,432,88,colors.accent,'Georgia');text('角色相似指数 · 非概率',480,483,24,colors.muted);lines(narrative.quotes[0],480,536,490,26,43,3);rule(680);
  title('01','你的选择画像',743);let y=796;data.axes.forEach((a,i)=>{text(a.label,75,y,25);text(a.low,173,y,21,colors.muted);text(a.high,840,y,21,colors.muted);c.fillStyle='#dacdbb';c.fillRect(290,y-18,510,12);c.fillStyle=colors.accent;c.fillRect(290,y-18,510*vector[i]/100,12);text(String(Math.round(vector[i])),945,y,24);y+=59;});text('高低表示选择方向，不代表能力或好坏。',75,y+1,21,colors.muted);rule(1335);
  title('02','你与TA的共同底色',1395);y=1450;if(!narrative.common.length){y=lines('当前选择没有鲜明且足够接近的共同轴，不勉强给你贴上底色。角色来自整体距离排序，完整差异说明与前三候选见结果页。',76,y,925,25,45,5);}for(const row of narrative.common.slice(0,2)){text(row.title,76,y,29,colors.accent,'serif');y+=46;y=lines(row.text,76,y,925,25,43,3)+12;}
  rule(1802);title('03','写给此刻的你',1862);y=1928;for(const q of narrative.quotes.slice(1)){y=lines('「'+q+'」',76,y,925,28,48,2)+13;}
  text('保留你的特点，也给不同的选择留一点空间。',76,2222,25,colors.accent);text('原创结果句，非游戏台词。完整依据与差异说明见测试结果页。',76,2280,21,colors.muted);
  text('娱乐性角色相似探索 · 非官方测试 · 不测能力、善恶或心理健康',76,2333,19,colors.muted);
  return await new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('结果图片生成未成功，请重试。')),'image/png'));
 }
 root.ManorPoster={create};
})(globalThis);
