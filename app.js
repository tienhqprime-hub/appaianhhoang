import { generateChart, parseBirthDate } from './tuvi-engine.js';

const TRAITS = {
  'Tử Vi':'khả năng quy tụ, tổ chức và giữ vai trò trung tâm',
  'Thiên Cơ':'tư duy biến hóa, quan sát nhanh và thiên về giải pháp',
  'Thái Dương':'tính công khai, chủ động, trách nhiệm và khuynh hướng dẫn dắt',
  'Vũ Khúc':'tính thực tế, quyết đoán, kỷ luật và năng lực quản trị nguồn lực',
  'Thiên Đồng':'sự mềm dẻo, thích nghi, nhân hòa và nhu cầu làm việc có ý nghĩa',
  'Liêm Trinh':'ranh giới, nguyên tắc, sức hút và khả năng tự kiểm soát',
  'Thiên Phủ':'khả năng gìn giữ, bao quát, ổn định và quản lý',
  'Thái Âm':'chiều sâu nội tâm, sự tinh tế, tích lũy và trực giác',
  'Tham Lang':'ham học hỏi, giao tiếp, trải nghiệm và sức sống mạnh',
  'Cự Môn':'khả năng phản biện, ngôn ngữ và nhu cầu làm rõ điều chưa minh bạch',
  'Thiên Tướng':'tinh thần bảo trợ, công bằng, hợp tác và giữ chuẩn mực',
  'Thiên Lương':'khả năng che chở, suy xét dài hạn và trọng đạo lý',
  'Thất Sát':'sự độc lập, chịu áp lực và quyết định trong tình thế khó',
  'Phá Quân':'động lực cải tổ, phá khuôn và tái thiết sau biến động'
};

const $ = (s, root=document) => root.querySelector(s);
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const pad = n => String(n).padStart(2,'0');

function majorNames(palace){ return palace.stars.filter(s=>s.type==='main').map(s=>s.name); }
function explainPalace(palace){
  const majors=majorNames(palace);
  if(!majors.length)return 'Cung này vô chính diệu: cần đọc cùng đối cung và tam phương, vì vậy hệ thống không kết luận chỉ từ riêng cung này.';
  const traits=majors.map(s=>TRAITS[s]).filter(Boolean);
  const support=palace.stars.filter(s=>s.type==='support').slice(0,4).map(s=>s.name);
  const challenge=palace.stars.filter(s=>s.type==='challenge').slice(0,3).map(s=>s.name);
  let text=`${majors.join(' và ')} nhấn mạnh ${traits.join('; ')}.`;
  if(support.length)text+=` Các sao hỗ trợ nổi bật: ${support.join(', ')}.`;
  if(challenge.length)text+=` Điểm cần quan sát tỉnh táo: ${challenge.join(', ')}; đây là tín hiệu để điều chỉnh, không phải phán quyết.`;
  return text;
}

function starMarkup(star){
  const strength=star.strength?` <small>${star.strength}</small>`:'';
  return `<span class="star star-${star.type}">${escapeHtml(star.name)}${strength}</span>`;
}

function palaceMarkup(p){
  const majors=p.stars.filter(s=>s.type==='main');
  const support=p.stars.filter(s=>s.type==='support');
  const challenge=p.stars.filter(s=>s.type==='challenge');
  const stage=p.stars.find(s=>s.type==='stage');
  return `<article class="palace palace-${p.position}" data-pos="${p.position}">
    <header><div><strong>${escapeHtml(p.name)}</strong>${p.body?'<b class="body-mark">Thân</b>':''}</div><span>${escapeHtml(p.branch)} · ${escapeHtml(p.element)}</span></header>
    <div class="major-stars">${majors.length?majors.map(starMarkup).join(''):'<span class="empty-major">Vô chính diệu</span>'}</div>
    <div class="minor-stars">${support.map(starMarkup).join('')}${challenge.map(starMarkup).join('')}</div>
    <footer><span>${stage?escapeHtml(stage.name):''}</span><span>Đại hạn ${p.majorAge}–${p.majorAge+9}</span></footer>
    ${(p.tuan||p.triet)?`<div class="void-mark">${p.tuan?'TUẦN ':''}${p.triet?'TRIỆT':''}</div>`:''}
  </article>`;
}

function render(chart){
  const {meta,input,palaces}=chart;
  const name=input.name?.trim()||'Bạn';
  const solar=input.solar,lunar=input.lunar;
  const center=`<div class="chart-center"><span class="seal">M</span><p>LÁ SỐ TỬ VI ĐẨU SỐ</p><h3>${escapeHtml(name)}</h3>
    <dl><div><dt>Dương lịch</dt><dd>${pad(solar.day)}/${pad(solar.month)}/${solar.year} · ${pad(input.hour)}:${pad(input.minute)}</dd></div>
    <div><dt>Âm lịch</dt><dd>${pad(lunar.day)}/${pad(lunar.month)}/${lunar.year}${lunar.leap?' nhuận':''}</dd></div>
    <div><dt>Tứ trụ</dt><dd>${meta.yearName} · ${meta.monthName} · ${meta.dayName} · ${meta.hourName}</dd></div>
    <div><dt>Mệnh / Cục</dt><dd>${meta.napAm} · ${meta.bureau.bureau}</dd></div>
    <div><dt>Chủ Mệnh / Chủ Thân</dt><dd>${meta.menhChu} · ${meta.thanChu}</dd></div></dl>
    <p class="chart-note">${meta.relation} · Đại hạn đi ${meta.direction.toLowerCase()}</p></div>`;
  $('#chart-grid').innerHTML=palaces.map(palaceMarkup).join('')+center;
  $('#result-title').textContent=`Lá số của ${name}`;
  $('#result-subtitle').textContent=`Dương lịch ${pad(solar.day)}/${pad(solar.month)}/${solar.year} · Âm lịch ${pad(lunar.day)}/${pad(lunar.month)}/${lunar.year}${lunar.leap?' nhuận':''} · giờ ${meta.hourName}`;
  const wanted=['Mệnh','Quan Lộc','Tài Bạch','Phu Thê'];
  $('#reading-grid').innerHTML=wanted.map(label=>{const p=palaces.find(x=>x.name===label);return `<article><span>${label}</span><strong>${majorNames(p).join(' · ')||'Vô chính diệu'}</strong><p>${escapeHtml(explainPalace(p))}</p><small>Căn cứ: cung ${p.branch}${p.body?' (Thân cư)':''}, ${p.stars.length} sao được an.</small></article>`}).join('');
  $('#technical-summary').innerHTML=`<strong>Dữ liệu kỹ thuật:</strong> Mệnh tại ${meta.menhPos&&palaces[meta.menhPos-1].branch}; Thân tại ${palaces[meta.thanPos-1].branch}; ${meta.bureau.bureau}; ${meta.napAm}; Chủ Mệnh ${meta.menhChu}; Chủ Thân ${meta.thanChu}.`;
  const result=$('#ket-qua');result.classList.add('visible');setTimeout(()=>result.scrollIntoView({behavior:'smooth',block:'start'}),60);
}

const form=$('#la-so');
$('#calendar-type').addEventListener('change',e=>{$('#leap-wrap').hidden=e.target.value!=='lunar'});
form.addEventListener('submit',e=>{
  e.preventDefault();
  const error=$('#form-error');error.textContent='';
  try{
    const date=parseBirthDate($('#birth').value);
    const [hour,minute]=$('#birth-time').value.split(':').map(Number);
    if(!Number.isInteger(hour)||!Number.isInteger(minute))throw new Error('Vui lòng chọn giờ sinh.');
    const gender=$('#gender').value;if(!gender)throw new Error('Vui lòng chọn giới tính dùng để an thuận/nghịch.');
    const chart=generateChart({...date,hour,minute,gender,name:$('#name').value,place:$('#birth-place').value.trim(),isLunar:$('#calendar-type').value==='lunar',leap:$('#lunar-leap').checked});
    render(chart);
  }catch(err){error.textContent=err.message||'Thông tin chưa hợp lệ.';error.scrollIntoView({behavior:'smooth',block:'center'});}
});

