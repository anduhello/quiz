const MagicPoster = (() => {
  const serif='"Noto Serif SC","Songti SC","SimSun",serif',sans='"Microsoft YaHei","PingFang SC",sans-serif';
  async function create(result){
    await document.fonts.ready;
    const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1600;
    const c=canvas.getContext('2d'),gold='#c7a66b',ink='#eee3c9',muted='#a4b5aa';
    c.fillStyle='#061f1c';c.fillRect(0,0,1080,1600);
    const photo=new Image();photo.src=MagicMedia[result.role.id].file;await photo.decode();
    const w=960,h=540,ratio=Math.max(w/photo.width,h/photo.height),sw=w/ratio,sh=h/ratio;
    c.drawImage(photo,(photo.width-sw)/2,(photo.height-sh)*.34,sw,sh,60,60,w,h);
    c.strokeStyle=gold;c.lineWidth=1.5;c.strokeRect(34,34,1012,1532);c.strokeRect(44,44,992,1512);c.strokeRect(55,55,970,550);
    const fade=c.createLinearGradient(0,485,0,620);fade.addColorStop(0,'#061f1c00');fade.addColorStop(1,'#061f1c');c.fillStyle=fade;c.fillRect(60,485,960,135);
    c.textAlign='center';c.fillStyle=gold;c.font=`23px ${sans}`;c.fillText(result.hidden?'魔 法 映 照 · 隐藏款已解锁':'魔 法 映 照 · 我的专属镜像',540,651);
    let size=68;c.fillStyle=ink;do{c.font=`${size}px ${serif}`;size-=2;}while(c.measureText(result.role.name).width>880&&size>32);c.fillText(result.role.name,540,744);
    c.font='22px Georgia,serif';c.fillStyle=muted;c.fillText(result.role.en.toUpperCase(),540,789);
    c.fillStyle=ink;c.font=`31px ${serif}`;c.fillText(result.role.line,540,855);
    c.fillStyle=gold;c.font=`22px ${sans}`;c.fillText(result.role.tags.join('   /   ')+(result.similarity===null?'':`   ·   倾向吻合度 ${result.similarity}%`),540,906);
    c.beginPath();c.moveTo(120,947);c.lineTo(960,947);c.stroke();
    MagicCharts.canvas(c,result.profile,result.role.profile,540,1195,157);
    c.font=`18px ${sans}`;c.fillStyle=gold;c.fillText('金色：我的画像',400,1443);c.fillStyle='#69b6aa';c.fillText('青色：角色参照',680,1443);
    c.font=`20px ${serif}`;c.fillStyle=ink;c.fillText('24 道轻松选择，发现你的魔法镜像',540,1490);
    c.fillStyle=muted;c.font='15px Georgia,serif';c.fillText('魔法映照 · 非官方角色测试',540,1523);
    c.font=`12px ${sans}`;c.fillText('非官方同人娱乐测试 · 剧照 © Warner Bros. Entertainment Inc. / Wizarding World Digital',540,1548);
    return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('图片生成失败')),'image/png'));
  }
  return {create};
})();
