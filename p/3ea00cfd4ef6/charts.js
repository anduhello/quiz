const MagicCharts = (()=>{
  const point=(i,value,cx=240,cy=190,radius=123)=>{const angle=-Math.PI/2+i*Math.PI/3;return [cx+Math.cos(angle)*radius*value/100,cy+Math.sin(angle)*radius*value/100];};
  const points=(values)=>values.map((v,i)=>point(i,v).join(',')).join(' ');
  function radar(profile,reference,showReference=true){
    const grid=[20,40,60,80,100].map(v=>`<polygon points="${points(Array(6).fill(v))}" fill="none" stroke="#c7a66b" stroke-opacity="${v===100?.45:.17}"/>`).join('');
    const axes=profile.map((_,i)=>{const p=point(i,100);return `<path d="M240 190L${p[0]} ${p[1]}" stroke="#c7a66b" stroke-opacity=".22"/>`;}).join('');
    const labels=MagicData.dimensions.map((name,i)=>{const p=point(i,140);const anchor=i===0||i===3?'middle':i<3?'start':'end';return `<text x="${p[0]}" y="${p[1]-3}" text-anchor="${anchor}" fill="#d9d1b9" font-size="13">${name}</text><text x="${p[0]}" y="${p[1]+17}" text-anchor="${anchor}" fill="#c7a66b" font-family="Georgia,serif" font-size="15">${Math.round(profile[i])}</text>`;}).join('');
    return `<svg class="radar-chart" viewBox="0 0 480 390" role="img" aria-label="六维雷达图：${MagicData.dimensions.map((d,i)=>d+Math.round(profile[i])).join('，')}。金色为你的画像，青色虚线为角色参照。"><circle cx="240" cy="190" r="145" fill="none" stroke="#c7a66b" stroke-opacity=".13" stroke-dasharray="1 7"/>${grid}${axes}${showReference?`<polygon class="reference-polygon" points="${points(reference)}" fill="#69b6aa" fill-opacity=".03" stroke="#69b6aa" stroke-width="2" stroke-dasharray="5 5"/>`:''}<polygon points="${points(profile)}" fill="#c7a66b" fill-opacity=".24" stroke="#e6c789" stroke-width="2"/>${profile.map((v,i)=>{const p=point(i,v);return `<circle cx="${p[0]}" cy="${p[1]}" r="3.4" fill="#edd09a"/>`;}).join('')}${labels}</svg>`;
  }
  function ring(value){const circumference=2*Math.PI*45;return `<div class="match-ring" role="img" aria-label="倾向吻合度 ${value}%"><svg viewBox="0 0 110 110" aria-hidden="true"><circle cx="55" cy="55" r="51" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-width=".7"/><circle cx="55" cy="55" r="45" fill="none" stroke="currentColor" stroke-opacity=".15" stroke-width="2"/><circle cx="55" cy="55" r="45" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="${circumference*value/100} ${circumference}" transform="rotate(-90 55 55)"/></svg><div><strong>${value}<small>%</small></strong><span>倾向吻合度</span></div></div>`;}
  function canvas(ctx,profile,reference,cx,cy,radius){
    function polygon(values,stroke,fill,dash=[]){ctx.beginPath();values.forEach((v,i)=>{const p=point(i,v,cx,cy,radius);i?ctx.lineTo(...p):ctx.moveTo(...p);});ctx.closePath();ctx.setLineDash(dash);ctx.strokeStyle=stroke;ctx.lineWidth=2;if(fill){ctx.fillStyle=fill;ctx.fill();}ctx.stroke();ctx.setLineDash([]);}
    [20,40,60,80,100].forEach(v=>polygon(Array(6).fill(v),'#c7a66b40'));
    polygon(reference,'#69b6aa',null,[7,7]);polygon(profile,'#e6c789','#c7a66b40');
    ctx.font='22px "Microsoft YaHei",sans-serif';ctx.fillStyle='#eee3c9';
    MagicData.dimensions.forEach((name,i)=>{const p=point(i,135,cx,cy,radius);ctx.textAlign=i===0||i===3?'center':i<3?'left':'right';ctx.fillText(name,p[0],p[1]+8);});ctx.textAlign='center';
  }
  return {radar,ring,canvas};
})();
