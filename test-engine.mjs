import assert from 'node:assert/strict';
import { generateChart, parseBirthDate, solarToLunar, lunarToSolar } from './tuvi-engine.js';

assert.deepEqual(parseBirthDate('12121970'), {day:12,month:12,year:1970});
assert.deepEqual(parseBirthDate('12/12/1970'), {day:12,month:12,year:1970});
assert.deepEqual(solarToLunar(12,12,1970,7), {day:14,month:11,year:1970,leap:false});
assert.deepEqual(lunarToSolar(14,11,1970,false,7), {day:12,month:12,year:1970});

const chart=generateChart({name:'HOÀNG QUỐC TIẾN',gender:'Nam',day:12,month:12,year:1970,hour:19,minute:30,isLunar:false,leap:false,place:'Vĩnh Phúc'});
assert.equal(chart.meta.yearName,'Canh Tuất');
assert.equal(chart.meta.hourName,'Mậu Tuất');
assert.equal(chart.meta.bureau.bureau,'Thổ ngũ Cục');
assert.equal(chart.meta.menhPos,3);
assert.equal(chart.meta.thanPos,11);
assert.equal(chart.palaces[2].name,'Mệnh');
assert.deepEqual(chart.palaces[2].stars.filter(s=>s.type==='main').map(s=>s.name).sort(),['Thái Âm','Thiên Cơ'].sort());
assert.deepEqual(chart.palaces[6].stars.filter(s=>s.type==='main').map(s=>s.name),['Thiên Lương']);
assert.deepEqual(chart.palaces[10].stars.filter(s=>s.type==='main').map(s=>s.name),['Thiên Đồng']);
assert.equal(chart.palaces.reduce((n,p)=>n+p.stars.length,0)>=100,true);

console.log('✓ Lịch âm và lá số mẫu Canh Tuất khớp bộ dữ liệu kiểm thử.');

