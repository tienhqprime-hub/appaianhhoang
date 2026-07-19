/*
 * Mệnh Đồ AI — bộ máy an sao Tử Vi Đẩu Số chạy trên trình duyệt.
 * Phép an sao được chuyển thể từ doanguyen/lasotuvi (MIT, 2016).
 * Thuật toán đổi lịch dựa trên lịch âm Việt Nam của Hồ Ngọc Đức (UTC+7).
 * Xem THIRD_PARTY_NOTICES.md để biết nguồn và giấy phép.
 */

export const CAN = [null, 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
export const CHI = [null, 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const HANH_CUNG = [null, 'Thủy', 'Thổ', 'Mộc', 'Mộc', 'Thổ', 'Hỏa', 'Hỏa', 'Thổ', 'Kim', 'Kim', 'Thổ', 'Thủy'];
const CUNG_TEN = ['Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc', 'Thiên Di', 'Tật Ách', 'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ'];

const MENH_CHU = [null, 'Tham Lang', 'Cự Môn', 'Lộc Tồn', 'Văn Khúc', 'Liêm Trinh', 'Vũ Khúc', 'Phá Quân', 'Vũ Khúc', 'Liêm Trinh', 'Văn Khúc', 'Lộc Tồn', 'Cự Môn'];
const THAN_CHU = [null, 'Linh Tinh', 'Thiên Tướng', 'Thiên Lương', 'Thiên Đồng', 'Văn Xương', 'Thiên Cơ', 'Hỏa Tinh', 'Thiên Tướng', 'Thiên Lương', 'Thiên Đồng', 'Văn Xương', 'Thiên Cơ'];
const LOC_TON_POS = [null, 3, 4, 6, 7, 6, 7, 9, 10, 12, 1];
const ELEMENT_INFO = {
  K: { name: 'Kim', number: 4, bureau: 'Kim tứ Cục' },
  M: { name: 'Mộc', number: 3, bureau: 'Mộc tam Cục' },
  T: { name: 'Thủy', number: 2, bureau: 'Thủy nhị Cục' },
  H: { name: 'Hỏa', number: 6, bureau: 'Hỏa lục Cục' },
  O: { name: 'Thổ', number: 5, bureau: 'Thổ ngũ Cục' },
};

const NAP_AM_30 = [
  'Hải Trung Kim', 'Lư Trung Hỏa', 'Đại Lâm Mộc', 'Lộ Bàng Thổ', 'Kiếm Phong Kim',
  'Sơn Đầu Hỏa', 'Giản Hạ Thủy', 'Thành Đầu Thổ', 'Bạch Lạp Kim', 'Dương Liễu Mộc',
  'Tuyền Trung Thủy', 'Ốc Thượng Thổ', 'Tích Lịch Hỏa', 'Tùng Bách Mộc', 'Trường Lưu Thủy',
  'Sa Trung Kim', 'Sơn Hạ Hỏa', 'Bình Địa Mộc', 'Bích Thượng Thổ', 'Kim Bạch Kim',
  'Phú Đăng Hỏa', 'Thiên Hà Thủy', 'Đại Trạch Thổ', 'Thoa Xuyến Kim', 'Tang Đố Mộc',
  'Đại Khê Thủy', 'Sa Trung Thổ', 'Thiên Thượng Hỏa', 'Thạch Lựu Mộc', 'Đại Hải Thủy',
];

const NAP_AM_ELEMENT = [
  'K','H','M','O','K','H','T','O','K','M','T','O','H','M','T',
  'K','H','M','O','K','H','T','O','K','M','T','O','H','M','T',
];

const NAP_MATRIX = [
  null,
  [null,'K',null,'T',null,'H',null,'O',null,'M',null],
  [null,null,'K',null,'T',null,'H',null,'O',null,'M'],
  [null,'T',null,'H',null,'O',null,'M',null,'K',null],
  [null,null,'T',null,'H',null,'O',null,'M',null,'K'],
  [null,'H',null,'O',null,'M',null,'K',null,'T',null],
  [null,null,'H',null,'O',null,'M',null,'K',null,'T'],
  [null,'K',null,'T',null,'H',null,'O',null,'M',null],
  [null,null,'K',null,'T',null,'H',null,'O',null,'M'],
  [null,'T',null,'H',null,'O',null,'M',null,'K',null],
  [null,null,'T',null,'H',null,'O',null,'M',null,'K'],
  [null,'H',null,'O',null,'M',null,'K',null,'T',null],
  [null,null,'H',null,'O',null,'M',null,'K',null,'T'],
];

const MAIN_STRENGTH = {
  'Tử Vi':       ['B','Đ','M','B','V','M','M','Đ','M','B','V','B'],
  'Liêm Trinh':  ['V','Đ','V','H','M','H','V','Đ','V','H','M','H'],
  'Thiên Đồng':  ['V','H','M','Đ','H','Đ','H','H','M','H','H','Đ'],
  'Vũ Khúc':     ['V','M','V','Đ','M','H','V','M','V','Đ','M','H'],
  'Thái Dương':  ['H','Đ','V','V','V','M','M','Đ','H','H','H','H'],
  'Thiên Cơ':    ['Đ','Đ','H','M','M','V','Đ','Đ','V','M','M','H'],
  // Bản tham chiếu MIT không gán bảng Miếu/Vượng cho Thiên Phủ; để trống
  // thay vì suy diễn một bảng khác trường phái.
  'Thiên Phủ':   ['','','','','','','','','','','',''],
  'Thái Âm':     ['V','Đ','H','H','H','H','H','Đ','V','M','M','M'],
  'Tham Lang':   ['H','M','Đ','H','V','H','H','M','Đ','H','V','H'],
  'Cự Môn':      ['V','H','V','M','H','H','V','H','Đ','M','H','Đ'],
  'Thiên Tướng': ['V','Đ','M','H','V','Đ','V','Đ','M','H','V','Đ'],
  'Thiên Lương': ['V','Đ','V','V','M','H','M','Đ','V','H','M','H'],
  'Thất Sát':    ['M','Đ','M','H','H','V','M','Đ','M','H','H','V'],
  'Phá Quân':    ['M','V','H','H','Đ','H','M','V','H','H','Đ','H'],
};

const CHALLENGE_STARS = new Set([
  'Tang Môn','Quan Phù','Tử Phù','Tuế Phá','Bạch Hổ','Điếu Khách','Tiểu Hao','Phi Liêm',
  'Bệnh Phù','Đại Hao','Phục Binh','Quan Phủ','Đà La','Kình Dương','Địa Không','Địa Kiếp',
  'Linh Tinh','Hỏa Tinh','Thiên Khốc','Thiên Hư','Thiên Hình','Thiên Riêu','Hóa Kỵ',
  'Cô Thần','Quả Tú','Thiên Thương','Thiên Sứ','Thiên La','Địa Võng','Phá Toái','Kiếp Sát',
  'Thiên Không','Lưu Hà'
]);
const MAIN_STARS = new Set(Object.keys(MAIN_STRENGTH));
const STAGE_STARS = new Set(['Tràng Sinh','Mộc Dục','Quan Đới','Lâm Quan','Đế Vượng','Suy','Bệnh','Tử','Mộ','Tuyệt','Thai','Dưỡng']);

function wrap(n) { return ((n - 1) % 12 + 12) % 12 + 1; }
function jdFromDate(dd, mm, yy) {
  const a = Math.floor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  if (jd < 2299161) jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  return jd;
}
function jdToDate(jd) {
  let a, b, c;
  if (jd > 2299160) {
    a = jd + 32044; b = Math.floor((4 * a + 3) / 146097); c = a - Math.floor(b * 146097 / 4);
  } else { b = 0; c = jd + 32082; }
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor(1461 * d / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return { day: e - Math.floor((153 * m + 2) / 5) + 1, month: m + 3 - 12 * Math.floor(m / 10), year: b * 100 + d - 4800 + Math.floor(m / 10) };
}
function newMoon(k) {
  const T = k / 1236.85, T2 = T*T, T3 = T2*T, dr = Math.PI/180;
  let jd = 2415020.75933 + 29.53058868*k + .0001178*T2 - .000000155*T3 + .00033*Math.sin((166.56 + 132.87*T - .009173*T2)*dr);
  const M = 359.2242 + 29.10535608*k - .0000333*T2 - .00000347*T3;
  const Mp = 306.0253 + 385.81691806*k + .0107306*T2 + .00001236*T3;
  const F = 21.2964 + 390.67050646*k - .0016528*T2 - .00000239*T3;
  let C = (.1734 - .000393*T)*Math.sin(M*dr) + .0021*Math.sin(2*M*dr) - .4068*Math.sin(Mp*dr) + .0161*Math.sin(2*Mp*dr) - .0004*Math.sin(3*Mp*dr);
  C += .0104*Math.sin(2*F*dr) - .0051*Math.sin((M+Mp)*dr) - .0074*Math.sin((M-Mp)*dr) + .0004*Math.sin((2*F+M)*dr) - .0004*Math.sin((2*F-M)*dr) - .0006*Math.sin((2*F+Mp)*dr) + .001*Math.sin((2*F-Mp)*dr) + .0005*Math.sin((2*Mp+M)*dr);
  const delta = T < -11 ? .001 + .000839*T + .0002261*T2 - .00000845*T3 - .000000081*T*T3 : -.000278 + .000265*T + .000262*T2;
  return jd + C - delta;
}
function sunLongitude(jdn, timeZone) {
  const T = (jdn - 2451545.5 - timeZone/24) / 36525, T2=T*T, dr=Math.PI/180;
  const M=357.52910+35999.05030*T-.0001559*T2-.00000048*T*T2;
  const L0=280.46645+36000.76983*T+.0003032*T2;
  let DL=(1.914600-.004817*T-.000014*T2)*Math.sin(M*dr)+(.019993-.000101*T)*Math.sin(2*M*dr)+.000290*Math.sin(3*M*dr);
  let L=L0+DL-.00569-.00478*Math.sin((125.04-1934.136*T)*dr);
  L=L*dr; L=L-Math.PI*2*Math.floor(L/(Math.PI*2));
  return Math.floor(L/Math.PI*6);
}
const newMoonDay=(k,tz)=>Math.floor(newMoon(k)+.5+tz/24);
function lunarMonth11(year,tz){const off=jdFromDate(31,12,year)-2415021;const k=Math.floor(off/29.530588853);let nm=newMoonDay(k,tz);if(sunLongitude(nm,tz)>=9)nm=newMoonDay(k-1,tz);return nm;}
function leapMonthOffset(a11,tz){const k=Math.floor(.5+(a11-2415021.076998695)/29.530588853);let last=0,i=1,arc=sunLongitude(newMoonDay(k+i,tz),tz);do{last=arc;i++;arc=sunLongitude(newMoonDay(k+i,tz),tz)}while(arc!==last&&i<14);return i-1;}

export function solarToLunar(day,month,year,timeZone=7){
  const dayNumber=jdFromDate(day,month,year),k=Math.floor((dayNumber-2415021.076998695)/29.530588853);let monthStart=newMoonDay(k+1,timeZone);if(monthStart>dayNumber)monthStart=newMoonDay(k,timeZone);
  let a11=lunarMonth11(year,timeZone),b11=a11,lunarYear;if(a11>=monthStart){lunarYear=year;a11=lunarMonth11(year-1,timeZone)}else{lunarYear=year+1;b11=lunarMonth11(year+1,timeZone)}
  const lunarDay=dayNumber-monthStart+1,diff=Math.floor((monthStart-a11)/29);let lunarMonth=diff+11,leap=false;
  if(b11-a11>365){const leapDiff=leapMonthOffset(a11,timeZone);if(diff>=leapDiff){lunarMonth=diff+10;if(diff===leapDiff)leap=true}}
  if(lunarMonth>12)lunarMonth-=12;if(lunarMonth>=11&&diff<4)lunarYear--;
  return {day:lunarDay,month:lunarMonth,year:lunarYear,leap};
}

export function lunarToSolar(day,month,year,leap=false,timeZone=7){
  let a11,b11;if(month<11){a11=lunarMonth11(year-1,timeZone);b11=lunarMonth11(year,timeZone)}else{a11=lunarMonth11(year,timeZone);b11=lunarMonth11(year+1,timeZone)}
  const k=Math.floor(.5+(a11-2415021.076998695)/29.530588853);let off=month-11;if(off<0)off+=12;
  if(b11-a11>365){const leapOff=leapMonthOffset(a11,timeZone);let leapMonth=leapOff-2;if(leapMonth<0)leapMonth+=12;if(leap&&month!==leapMonth)throw new Error('Tháng nhuận không hợp lệ trong năm đã chọn.');if(leap||off>=leapOff)off++}
  return jdToDate(newMoonDay(k+off,timeZone)+day-1);
}

export function parseBirthDate(value){
  const raw=String(value||'').trim();let day,month,year;
  const digits=raw.replace(/\D/g,'');
  if(/^\d{8}$/.test(digits)){day=+digits.slice(0,2);month=+digits.slice(2,4);year=+digits.slice(4)}
  else{const p=raw.split(/[^0-9]+/).filter(Boolean);if(p.length===3){day=+p[0];month=+p[1];year=+p[2]}}
  if(!day||!month||!year||year<1900||year>2100)throw new Error('Nhập ngày theo dạng DD/MM/YYYY (hỗ trợ 1900–2100).');
  const d=new Date(Date.UTC(year,month-1,day));if(d.getUTCFullYear()!==year||d.getUTCMonth()!==month-1||d.getUTCDate()!==day)throw new Error('Ngày sinh không hợp lệ.');
  return {day,month,year};
}

function napAmForYear(year){const idx=((year-4)%60+60)%60,g=Math.floor(idx/2);return{name:NAP_AM_30[g],element:NAP_AM_ELEMENT[g]};}
function findBureau(menhPos,canYear){let canMonth=((menhPos-3)%12+(canYear*2+1)%10)%10;if(canMonth===0)canMonth=10;const element=NAP_MATRIX[menhPos][canMonth];if(!element)throw new Error('Không xác định được Cục.');return ELEMENT_INFO[element];}
function findTuVi(cuc,day){let n=cuc,pos=3;while(n<day){n+=cuc;pos++}let delta=n-day;if(delta%2===1)delta=-delta;return wrap(pos+delta);}
function startTrangSinh(cuc){return cuc===6?3:cuc===4?6:(cuc===2||cuc===5)?9:12;}
function findHoaLinh(chiYear,hourBranch,gender,yinYang){let hoa,linh;if([3,7,11].includes(chiYear)){hoa=2;linh=4}else if([1,5,9].includes(chiYear)){hoa=3;linh=11}else if([6,10,2].includes(chiYear)){hoa=11;linh=4}else{hoa=10;linh=11}
  return gender*yinYang===-1?[wrap(hoa+1-hourBranch),wrap(linh-1+hourBranch)]:[wrap(hoa-1+hourBranch),wrap(linh+1-hourBranch)];}
function findThienKhoi(can){return [null,2,1,12,10,8,1,8,7,6,4][can];}
function findQuanPhuc(can){return [[null,8,5,6,3,4,10,12,10,11,7][can],[null,10,9,1,12,4,3,7,6,7,6][can]];}
function findCoThan(chi){return [12,1,2].includes(chi)?3:[3,4,5].includes(chi)?6:[6,7,8].includes(chi)?9:12;}
function findThienMa(chi){return chi%4===1?3:chi%4===2?12:chi%4===3?9:6;}
function findPhaToai(chi){return chi%3===0?6:chi%3===1?10:2;}
function findTriet(can){if([1,6].includes(can))return[9,10];if([2,7].includes(can))return[7,8];if([3,8].includes(can))return[5,6];if([4,9].includes(can))return[3,4];return[1,2];}

function starType(name){if(MAIN_STARS.has(name))return'main';if(STAGE_STARS.has(name))return'stage';return CHALLENGE_STARS.has(name)?'challenge':'support';}
function hourBranch(hour){return wrap(Math.floor((hour+1)/2)+1);}
function palaceDistance(a,b,direction){return direction===1?(a-b+12)%12:(b-a+12)%12;}

export function generateChart(input){
  const timeZone=7;const gender=input.gender==='Nữ'?-1:1;const hour=Number(input.hour);const minute=Number(input.minute||0);const hb=hourBranch(hour);
  const solar=input.isLunar?lunarToSolar(input.day,input.month,input.year,input.leap,timeZone):{day:input.day,month:input.month,year:input.year};
  const lunar=input.isLunar?{day:input.day,month:input.month,year:input.year,leap:!!input.leap}:solarToLunar(input.day,input.month,input.year,timeZone);
  if(input.isLunar){const check=solarToLunar(solar.day,solar.month,solar.year,timeZone);if(check.day!==lunar.day||check.month!==lunar.month||check.year!==lunar.year||check.leap!==lunar.leap)throw new Error('Ngày âm lịch hoặc tháng nhuận không hợp lệ.');}
  const canYear=(lunar.year+6)%10+1,chiYear=(lunar.year+8)%12+1,canMonth=(lunar.year*12+lunar.month+3)%10+1;
  const jd=jdFromDate(solar.day,solar.month,solar.year),canDay=(jd+9)%10+1,chiDay=(jd+1)%12+1;let canHour=((jd-1)*2%10+hb)%10;if(canHour===0)canHour=10;
  const menhPos=wrap(3+lunar.month-hb),thanPos=wrap(3+lunar.month+hb-2);const bureau=findBureau(menhPos,canYear);const nap=napAmForYear(lunar.year);
  const palaces=Array.from({length:12},(_,i)=>({position:i+1,branch:CHI[i+1],element:HANH_CUNG[i+1],name:'',body:i+1===thanPos,majorAge:0,minorYear:'',stars:[],tuan:false,triet:false}));
  CUNG_TEN.forEach((name,i)=>palaces[wrap(menhPos+i)-1].name=name);
  const direction=gender*(chiYear%2===1?1:-1);palaces.forEach(p=>{p.majorAge=bureau.number+10*palaceDistance(p.position,menhPos,direction)});
  const minorStart=wrap(11-3*(chiYear-1)),tyStart=wrap(minorStart-gender*(chiYear-1));palaces.forEach(p=>p.minorYear=CHI[palaceDistance(p.position,tyStart,gender)+1]);
  const place=(pos,...names)=>names.forEach(name=>palaces[wrap(pos)-1].stars.push({name,type:starType(name),strength:MAIN_STRENGTH[name]?.[wrap(pos)-1]||''}));
  const tv=findTuVi(bureau.number,lunar.day),lt=wrap(tv+4),td=wrap(tv+7),vk=wrap(tv+8),sun=wrap(tv+9),tc=wrap(tv+11);
  place(tv,'Tử Vi');place(lt,'Liêm Trinh');place(td,'Thiên Đồng');place(vk,'Vũ Khúc');place(sun,'Thái Dương');place(tc,'Thiên Cơ');
  const tp=wrap(6-tv);const moon=wrap(tp+1),tham=wrap(tp+2),cu=wrap(tp+3),tuong=wrap(tp+4),luong=wrap(tp+5),sat=wrap(tp+6),pha=wrap(tp+10);
  place(tp,'Thiên Phủ');place(moon,'Thái Âm');place(tham,'Tham Lang');place(cu,'Cự Môn');place(tuong,'Thiên Tướng');place(luong,'Thiên Lương');place(sat,'Thất Sát');place(pha,'Phá Quân');
  const yinYang=canYear%2===1?1:-1,cycleDir=gender*yinYang,loc=LOC_TON_POS[canYear];
  ['Lộc Tồn','Lực Sĩ','Thanh Long','Tiểu Hao','Tướng Quân','Tấu Thư','Phi Liêm','Hỷ Thần','Bệnh Phù','Đại Hao','Phục Binh','Quan Phủ'].forEach((s,i)=>place(wrap(loc+i*cycleDir),s));place(loc,'Bác Sĩ');
  ['Thái Tuế','Thiếu Dương','Tang Môn','Thiếu Âm','Quan Phù','Tử Phù','Tuế Phá','Long Đức','Bạch Hổ','Phúc Đức','Điếu Khách','Trực Phù'].forEach((s,i)=>place(wrap(chiYear+i),s));place(wrap(chiYear+1),'Thiên Không');place(wrap(chiYear+5),'Nguyệt Đức');place(wrap(chiYear+9),'Thiên Đức');
  const ts=startTrangSinh(bureau.number);['Tràng Sinh','Mộc Dục','Quan Đới','Lâm Quan','Đế Vượng','Suy','Bệnh','Tử','Mộ','Tuyệt','Thai','Dưỡng'].forEach((s,i)=>place(wrap(ts+i*cycleDir),s));
  place(wrap(loc-1),'Đà La');place(wrap(loc+1),'Kình Dương');const kiep=wrap(11+hb),khong=wrap(24-kiep);place(kiep,'Địa Kiếp');place(khong,'Địa Không');const[hoa,linh]=findHoaLinh(chiYear,hb,gender,yinYang);place(hoa,'Hỏa Tinh');place(linh,'Linh Tinh');
  const long=wrap(5+chiYear-1),phuong=wrap(4-long);place(long,'Long Trì');place(phuong,'Phượng Các','Giải Thần');
  const ta=wrap(5+lunar.month-1),huu=wrap(4-ta);place(ta,'Tả Phù');place(huu,'Hữu Bật');
  const khuc=wrap(5+hb-1),xuong=wrap(4-khuc);place(khuc,'Văn Khúc');place(xuong,'Văn Xương');
  const tam=wrap(5+lunar.month+lunar.day-2),bat=wrap(4-tam);place(tam,'Tam Thai');place(bat,'Bát Tọa');
  const quang=wrap(xuong+lunar.day-2),quy=wrap(4-quang);place(quang,'Ân Quang');place(quy,'Thiên Quý');
  const khoi=findThienKhoi(canYear),viet=wrap(10-khoi);place(khoi,'Thiên Khôi');place(viet,'Thiên Việt');
  const hu=wrap(7+chiYear-1),khoc=wrap(7-chiYear+1);place(hu,'Thiên Hư');place(khoc,'Thiên Khốc');place(wrap(menhPos+chiYear-1),'Thiên Tài');place(wrap(thanPos+chiYear-1),'Thiên Thọ');
  const hong=wrap(4-chiYear+1);place(hong,'Hồng Loan');place(wrap(hong+6),'Thiên Hỷ');const[q,pf]=findQuanPhuc(canYear);place(q,'Thiên Quan');place(pf,'Thiên Phúc');
  const hinh=wrap(10+lunar.month-1),rieu=wrap(hinh+4);place(hinh,'Thiên Hình');place(rieu,'Thiên Riêu','Thiên Y');const co=findCoThan(chiYear);place(co,'Cô Thần');place(wrap(co-4),'Quả Tú');
  const van=wrap(loc+3),duong=wrap(van+2),quoc=wrap(duong+3);place(van,'Văn Tinh');place(duong,'Đường Phù');place(quoc,'Quốc Ấn');place(wrap(khuc+2),'Thai Phụ');place(wrap(khuc-2),'Phong Cáo');
  place(wrap(9+2*lunar.month-2),'Thiên Giải');place(wrap(ta+3),'Địa Giải');place(5,'Thiên La');place(11,'Địa Võng');place(wrap(menhPos+5),'Thiên Thương');place(wrap(menhPos+7),'Thiên Sứ');
  const ma=findThienMa(chiYear),hoaCai=wrap(ma+2),kiepSat=wrap(ma+3),dao=wrap(kiepSat+4);place(ma,'Thiên Mã');place(hoaCai,'Hoa Cái');place(kiepSat,'Kiếp Sát');place(dao,'Đào Hoa');place(findPhaToai(chiYear),'Phá Toái');place(wrap(chiYear-lunar.month+hb),'Đẩu Quân');
  const hoaMap={1:[lt,pha,vk,sun],2:[tc,luong,tv,moon],3:[td,tc,xuong,lt],4:[moon,td,tc,cu],5:[tham,moon,huu,tc],6:[vk,tham,luong,khuc],7:[sun,vk,td,moon],8:[cu,sun,khuc,xuong],9:[luong,tv,tp,vk],10:[pha,cu,moon,tham]};
  ['Hóa Lộc','Hóa Quyền','Hóa Khoa','Hóa Kỵ'].forEach((s,i)=>place(hoaMap[canYear][i],s));const luu=[null,10,11,8,5,6,7,9,4,12,3][canYear],tru=[null,6,7,1,6,7,9,3,7,10,11][canYear];place(luu,'Lưu Hà');place(tru,'Thiên Trù');
  const endTuan=wrap(chiYear+10-canYear);[wrap(endTuan+1),wrap(endTuan+2)].forEach(x=>palaces[x-1].tuan=true);findTriet(canYear).forEach(x=>palaces[x-1].triet=true);
  const relation={K:{K:'Mệnh Cục bình hòa',M:'Cục khắc Mệnh',T:'Mệnh sinh Cục',H:'Mệnh khắc Cục',O:'Cục sinh Mệnh'},M:{K:'Mệnh khắc Cục',M:'Mệnh Cục bình hòa',T:'Cục sinh Mệnh',H:'Mệnh sinh Cục',O:'Cục khắc Mệnh'},T:{K:'Cục sinh Mệnh',M:'Mệnh sinh Cục',T:'Mệnh Cục bình hòa',H:'Cục khắc Mệnh',O:'Mệnh khắc Cục'},H:{K:'Cục khắc Mệnh',M:'Cục sinh Mệnh',T:'Mệnh khắc Cục',H:'Mệnh Cục bình hòa',O:'Mệnh sinh Cục'},O:{K:'Mệnh sinh Cục',M:'Mệnh khắc Cục',T:'Cục khắc Mệnh',H:'Cục sinh Mệnh',O:'Mệnh Cục bình hòa'}}[nap.element][Object.keys(ELEMENT_INFO).find(k=>ELEMENT_INFO[k].number===bureau.number)];
  return {input:{...input,solar,lunar,hour,minute},meta:{canYear,chiYear,canMonth,canDay,chiDay,canHour,hourBranch:hb,yearName:`${CAN[canYear]} ${CHI[chiYear]}`,monthName:`${CAN[canMonth]} ${CHI[wrap(lunar.month+2)]}`,dayName:`${CAN[canDay]} ${CHI[chiDay]}`,hourName:`${CAN[canHour]} ${CHI[hb]}`,menhPos,thanPos,bureau,napAm:nap.name,menhElement:ELEMENT_INFO[nap.element].name,relation,menhChu:MENH_CHU[chiYear],thanChu:THAN_CHU[chiYear],direction:direction===1?'Thuận':'Nghịch'},palaces};
}
