import { generateChart, parseBirthDate } from './tuvi-engine.js';

const TRAITS = {
  'Tử Vi':'khả năng quy tụ, tổ chức và giữ vai trò trung tâm','Thiên Cơ':'tư duy biến hóa, quan sát nhanh và thiên về giải pháp',
  'Thái Dương':'tính công khai, chủ động, trách nhiệm và khuynh hướng dẫn dắt','Vũ Khúc':'tính thực tế, quyết đoán, kỷ luật và năng lực quản trị nguồn lực',
  'Thiên Đồng':'sự mềm dẻo, thích nghi, nhân hòa và nhu cầu làm việc có ý nghĩa','Liêm Trinh':'ranh giới, nguyên tắc, sức hút và khả năng tự kiểm soát',
  'Thiên Phủ':'khả năng gìn giữ, bao quát, ổn định và quản lý','Thái Âm':'chiều sâu nội tâm, sự tinh tế, tích lũy và trực giác',
  'Tham Lang':'ham học hỏi, giao tiếp, trải nghiệm và sức sống mạnh','Cự Môn':'khả năng phản biện, ngôn ngữ và nhu cầu làm rõ điều chưa minh bạch',
  'Thiên Tướng':'tinh thần bảo trợ, công bằng, hợp tác và giữ chuẩn mực','Thiên Lương':'khả năng che chở, suy xét dài hạn và trọng đạo lý',
  'Thất Sát':'sự độc lập, chịu áp lực và quyết định trong tình thế khó','Phá Quân':'động lực cải tổ, phá khuôn và tái thiết sau biến động'
};

const PALACE_ORDER = ['Mệnh','Phụ Mẫu','Phúc Đức','Điền Trạch','Quan Lộc','Nô Bộc','Thiên Di','Tật Ách','Tài Bạch','Tử Tức','Phu Thê','Huynh Đệ'];
const PALACE_META = {
  'Mệnh':{icon:'✦',label:'Bản thân',focus:'cách bạn suy nghĩ, lựa chọn và hiện diện',intro:'Đây là điểm bắt đầu để hiểu khí chất, thế mạnh tự nhiên và cách bạn phản ứng trước cuộc sống.',questions:['Điều gì khiến bạn thấy mình đang sống đúng với bản chất nhất?','Thế mạnh nào bạn thường xem là bình thường nhưng người khác lại đánh giá cao?','Khi áp lực, bạn thường dựa vào lý trí, cảm xúc hay hành động?'],keywords:['bản thân','tính cách','điểm mạnh','tôi là ai']},
  'Phụ Mẫu':{icon:'⌂',label:'Gốc gia đình',focus:'ảnh hưởng của người đi trước và cách bạn nhận sự nâng đỡ',intro:'Cung này soi vào quan hệ với cha mẹ, người nuôi dưỡng, cấp trên và dấu ấn gia đình trong cách bạn trưởng thành.',questions:['Bạn đang giữ điều gì từ gia đình mà vẫn còn hữu ích?','Ranh giới nào cần được nói rõ để gần nhau hơn?','Bạn tiếp nhận lời khuyên tốt nhất theo cách nào?'],keywords:['cha mẹ','gia đình','người lớn','cấp trên']},
  'Phúc Đức':{icon:'∞',label:'Nội tâm',focus:'độ bền tinh thần, giá trị sâu và cảm giác đủ đầy',intro:'Cung Phúc Đức không đo may mắn; nó gợi cách bạn hồi phục, tìm ý nghĩa và xây nền tinh thần lâu dài.',questions:['Điều gì thực sự giúp bạn hồi phục sau một tuần khó?','Giá trị nào bạn muốn giữ dù hoàn cảnh thay đổi?','Bạn có đang dành đủ khoảng lặng cho mình không?'],keywords:['tinh thần','nội tâm','phúc','bình an']},
  'Điền Trạch':{icon:'⌑',label:'Không gian sống',focus:'nhà cửa, nơi chốn và nền tảng vật chất',intro:'Cung này gợi cách bạn tạo cảm giác an cư, quản lý không gian sống và xây nền tảng bền vững.',questions:['Không gian hiện tại có nâng đỡ nhịp sống của bạn không?','Điều gì cần đơn giản hóa trong nhà hoặc tài sản?','Nền tảng nào cần xây trước khi mở rộng?'],keywords:['nhà cửa','bất động sản','nơi ở','điền']},
  'Quan Lộc':{icon:'↗',label:'Sự nghiệp',focus:'cách làm việc, trách nhiệm và hướng tạo giá trị',intro:'Đây là cung chính để đọc nghề nghiệp và vai trò xã hội — không phải tên một nghề cố định, mà là cách bạn làm tốt nhất.',questions:['Công việc nào cho phép bạn dùng đúng thế mạnh tự nhiên?','Bạn muốn được nhớ đến vì giá trị nào trong công việc?','Bước nghề nghiệp tiếp theo cần thêm năng lực hay thêm can đảm?'],keywords:['công việc','sự nghiệp','nghề','thăng tiến','kinh doanh']},
  'Nô Bộc':{icon:'⌁',label:'Cộng sự',focus:'bạn bè, đồng đội và chất lượng hợp tác',intro:'Cung Nô Bộc gợi kiểu người bạn dễ cộng tác, cách xây niềm tin và ranh giới trong các mối quan hệ ngang hàng.',questions:['Bạn đang ở trong nhóm giúp mình tiến lên hay tiêu hao?','Bạn cần nói rõ kỳ vọng nào với cộng sự?','Mối quan hệ nào đáng được đầu tư lâu dài?'],keywords:['bạn bè','đồng nghiệp','cộng sự','quan hệ']},
  'Thiên Di':{icon:'⇢',label:'Thế giới bên ngoài',focus:'môi trường mới, di chuyển và hình ảnh khi bước ra ngoài',intro:'Cung này cho thấy bạn vận hành thế nào khi rời vùng quen thuộc, gặp người lạ hoặc thay đổi môi trường.',questions:['Môi trường nào làm bạn trở nên chủ động hơn?','Bạn cần chuẩn bị gì trước một thay đổi lớn?','Hình ảnh bên ngoài có phản ánh đúng con người bên trong?'],keywords:['đi xa','xuất ngoại','môi trường','thay đổi','thiên di']},
  'Tật Ách':{icon:'○',label:'Nhịp sống',focus:'thói quen, áp lực và cách giữ cân bằng',intro:'Đây là phần soi chiếu nhịp sống và cách cơ thể–tinh thần phản ứng với áp lực; không phải chẩn đoán sức khỏe.',questions:['Dấu hiệu nào thường báo bạn đang quá tải?','Thói quen nhỏ nào có thể giúp nhịp sống ổn định hơn?','Bạn đang cố chịu đựng điều gì thay vì xin hỗ trợ?'],keywords:['sức khỏe','áp lực','mệt','cân bằng','tật ách']},
  'Tài Bạch':{icon:'◎',label:'Tài chính',focus:'cách tạo, giữ và sử dụng nguồn lực',intro:'Cung Tài Bạch gợi thói quen tiền bạc và năng lực quản trị nguồn lực, không cam kết lợi nhuận hay dự đoán khoản tiền cụ thể.',questions:['Bạn kiếm tiền tốt nhất khi giải quyết loại vấn đề nào?','Khoản chi nào đang phản ánh đúng giá trị của bạn?','Quy tắc tài chính nào giúp bạn bớt quyết định theo cảm xúc?'],keywords:['tiền','tài chính','tài vận','thu nhập','đầu tư']},
  'Tử Tức':{icon:'◇',label:'Sáng tạo & con trẻ',focus:'sự tiếp nối, nuôi dưỡng và điều bạn tạo ra',intro:'Ngoài chủ đề con cái, cung này còn gợi cách bạn chăm sóc ý tưởng, dự án và những điều sẽ tiếp tục sau mình.',questions:['Điều gì bạn muốn nuôi lớn trong vài năm tới?','Bạn chăm sóc người khác mà có quên chăm sóc mình không?','Dự án nào cần kiên nhẫn thay vì thúc ép?'],keywords:['con cái','sáng tạo','dự án','nuôi dưỡng']},
  'Phu Thê':{icon:'♥',label:'Tình cảm',focus:'cách kết nối, cam kết và học qua quan hệ gần gũi',intro:'Cung Phu Thê gợi nhu cầu trong quan hệ và cách xây sự đồng hành; không quyết định ai là “định mệnh” của bạn.',questions:['Bạn cần cảm thấy điều gì để thật sự an toàn trong quan hệ?','Nhu cầu nào nên được nói thẳng thay vì chờ đối phương đoán?','Bạn đang lặp lại mẫu quan hệ nào?'],keywords:['tình cảm','tình yêu','hôn nhân','vợ chồng','đối tác']},
  'Huynh Đệ':{icon:'≋',label:'Anh chị em',focus:'quan hệ cùng thế hệ và cách chia sẻ nguồn lực',intro:'Cung này soi vào anh chị em, người thân ngang vai và bài học về so sánh, hỗ trợ, cạnh tranh lành mạnh.',questions:['Bạn cần chủ động kết nối lại với ai?','Sự so sánh nào không còn phục vụ mình?','Bạn có thể hỗ trợ mà không gánh thay bằng cách nào?'],keywords:['anh em','chị em','người thân']}
};

const RELATED_PALACES = {
  'Mệnh':['Phúc Đức','Quan Lộc','Thiên Di'],'Phụ Mẫu':['Phúc Đức','Huynh Đệ','Quan Lộc'],'Phúc Đức':['Mệnh','Tật Ách','Điền Trạch'],
  'Điền Trạch':['Tài Bạch','Phúc Đức','Phụ Mẫu'],'Quan Lộc':['Mệnh','Tài Bạch','Thiên Di'],'Nô Bộc':['Quan Lộc','Thiên Di','Huynh Đệ'],
  'Thiên Di':['Mệnh','Quan Lộc','Nô Bộc'],'Tật Ách':['Phúc Đức','Mệnh','Điền Trạch'],'Tài Bạch':['Quan Lộc','Điền Trạch','Phúc Đức'],
  'Tử Tức':['Phu Thê','Phúc Đức','Điền Trạch'],'Phu Thê':['Mệnh','Phúc Đức','Tử Tức'],'Huynh Đệ':['Phụ Mẫu','Nô Bộc','Phúc Đức']
};

const VOID_GUIDANCE = {
  'Mệnh':'Không có chính tinh tọa thủ, khí chất có thể đổi sắc theo môi trường. Hãy nhìn thêm Thiên Di để hiểu cách bạn hiện diện bên ngoài và Phúc Đức để thấy nền nội tâm.',
  'Phụ Mẫu':'Không có chính tinh tọa thủ, ảnh hưởng gia đình cần được nhận diện qua trải nghiệm thật. Phúc Đức giúp soi dấu ấn được truyền lại, còn Huynh Đệ cho thấy cách các thành viên nâng đỡ nhau.',
  'Phúc Đức':'Không có chính tinh tọa thủ, sức bền tinh thần thường hiện rõ qua cách bạn sống hơn là một nét cố định. Hãy nối với Mệnh và Tật Ách để hiểu nhịp hồi phục phù hợp.',
  'Điền Trạch':'Không có chính tinh tọa thủ, chuyện nhà cửa nên được nhìn từ nhu cầu an cư và khả năng nguồn lực. Tài Bạch và Phúc Đức là hai góc đối chiếu quan trọng.',
  'Quan Lộc':'Không có chính tinh tọa thủ, đường nghề nghiệp có thể linh hoạt theo từng giai đoạn. Mệnh cho biết cách tạo giá trị, còn Tài Bạch giúp kiểm tra tính bền vững của lựa chọn.',
  'Nô Bộc':'Không có chính tinh tọa thủ, chất lượng cộng sự phụ thuộc nhiều vào môi trường và ranh giới hợp tác. Hãy đọc cùng Quan Lộc và Thiên Di để thấy kiểu kết nối phù hợp.',
  'Thiên Di':'Không có chính tinh tọa thủ, khả năng thích nghi cần được kiểm chứng trong từng môi trường cụ thể. Mệnh và Quan Lộc cho biết bạn nên mang thế mạnh nào ra bên ngoài.',
  'Tật Ách':'Không có chính tinh tọa thủ, phần này nên tập trung vào thói quen và phản ứng thực tế của cơ thể–tinh thần. Phúc Đức và Mệnh giúp nhận diện nguồn gây quá tải; đây không phải chẩn đoán y khoa.',
  'Tài Bạch':'Không có chính tinh tọa thủ, cách tạo và giữ tiền cần đọc qua hành vi thực tế. Quan Lộc cho thấy nguồn tạo giá trị, còn Điền Trạch gợi cách xây nền tài sản bền hơn.',
  'Tử Tức':'Không có chính tinh tọa thủ, năng lực nuôi dưỡng sẽ rõ qua điều bạn kiên trì tạo ra. Phúc Đức và Phu Thê giúp soi cách chia sẻ trách nhiệm và kỳ vọng.',
  'Phu Thê':'Không có chính tinh tọa thủ, chất lượng quan hệ không nằm ở một dấu hiệu đơn lẻ. Mệnh và Phúc Đức giúp làm rõ nhu cầu, ranh giới và cách bạn xây sự an toàn.',
  'Huynh Đệ':'Không có chính tinh tọa thủ, quan hệ cùng thế hệ nên được hiểu qua cách chia sẻ và giữ giới hạn. Phụ Mẫu và Nô Bộc cho thêm bối cảnh về gia đình và hợp tác.'
};

const FIELD_GUIDE = {
  calendar:'Bạn đang dùng ngày trên giấy tờ theo Dương lịch hay ngày Âm lịch gia đình ghi lại? Chọn đúng loại để phép đổi lịch không bị lặp.',
  birth:'Ngày sinh là tọa độ đầu tiên để tính âm lịch, Can Chi ngày và vị trí nhiều vòng sao.',
  time:'Giờ sinh chia theo 12 thời thần. Nếu ở sát mốc hai giờ, hãy kiểm tra lại vì cung Mệnh và cung Thân có thể thay đổi.',
  gender:'Thông tin này chỉ dùng để xác định chiều đi thuận hoặc nghịch của các chu kỳ truyền thống.',
  place:'Phiên bản hiện tại tính theo múi giờ Việt Nam UTC+7. Nơi sinh được giữ như ghi chú để bạn nhận diện hồ sơ.',
  name:'Tên chỉ dùng để xưng hô trong phần kết quả. Bạn có thể để trống và hệ thống sẽ gọi là “Bạn”.'
};

const ACTION_PLAYBOOK = {
  'Mệnh':{proceed:'Chọn một thế mạnh đang có và dùng nó cho một việc cụ thể trong 7 ngày.',pause:'Chưa nên tự gắn nhãn bản thân. Hãy ghi lại ba tình huống thật trước khi kết luận.',adjust:'Giảm một phản ứng vội, xin phản hồi từ người tin cậy và thử lại bằng một bước nhỏ.'},
  'Phụ Mẫu':{proceed:'Nên chủ động một cuộc trao đổi tôn trọng và nói rõ điều bạn cần.',pause:'Chưa nên quy kết đúng sai từ một phía; hãy nghe lại bối cảnh của cả hai bên.',adjust:'Cần sửa ranh giới hoặc cách giao tiếp trước khi bàn chuyện lớn với gia đình hay cấp trên.'},
  'Phúc Đức':{proceed:'Nên duy trì một thói quen hồi phục đều đặn và có thể đo được.',pause:'Chưa nên ép mình phải có câu trả lời ngay khi tinh thần còn quá tải.',adjust:'Cần giảm một nguồn tiêu hao và tìm người hỗ trợ phù hợp trước khi cố gắng thêm.'},
  'Điền Trạch':{proceed:'Nên cải thiện một phần nhỏ của không gian sống hoặc nền tảng vật chất trước.',pause:'Chưa nên mua, bán hay chuyển chỗ ở chỉ dựa trên lá số.',adjust:'Cần rà lại ngân sách, giấy tờ và nhu cầu thật trước một quyết định nhà cửa khó đảo ngược.'},
  'Quan Lộc':{proceed:'Nên thử một bước nghề nghiệp nhỏ, có mục tiêu và thước đo rõ trong 7–30 ngày.',pause:'Chưa nên nghỉ việc, đổi nghề hay mở rộng chỉ từ một luận giải.',adjust:'Cần làm rõ vai trò, ưu tiên và một năng lực còn thiếu trước khi nhận trách nhiệm lớn hơn.'},
  'Nô Bộc':{proceed:'Nên đầu tư vào một cộng sự đáng tin bằng kỳ vọng và cam kết rõ ràng.',pause:'Chưa nên giao việc hoặc đặt niềm tin lớn khi vai trò và trách nhiệm còn mơ hồ.',adjust:'Cần sửa ranh giới hợp tác, quyền truy cập hoặc cách kiểm tra kết quả trước.'},
  'Thiên Di':{proceed:'Nên thử môi trường mới ở quy mô nhỏ và chuẩn bị một phương án quay về.',pause:'Chưa nên di chuyển hoặc thay đổi môi trường lớn khi dữ liệu thực tế còn thiếu.',adjust:'Cần bổ sung kế hoạch, nguồn lực và người hỗ trợ trước khi bước ra khỏi vùng quen thuộc.'},
  'Tật Ách':{proceed:'Nên điều chỉnh một thói quen ngủ, vận động hoặc nghỉ ngơi và theo dõi phản ứng thực tế.',pause:'Chưa nên tự chẩn đoán hay thay đổi điều trị từ nội dung Tử Vi.',adjust:'Nếu dấu hiệu kéo dài, nghiêm trọng hoặc bất thường, cần ưu tiên chuyên gia y tế phù hợp.'},
  'Tài Bạch':{proceed:'Nên củng cố một nguyên tắc thu–chi hoặc quỹ dự phòng trước khi tìm lợi nhuận.',pause:'Chưa nên đầu tư, vay hoặc mở rộng tài chính chỉ dựa trên luận giải.',adjust:'Cần rà soát dòng tiền, nghĩa vụ, quỹ dự phòng và giới hạn rủi ro trước.'},
  'Tử Tức':{proceed:'Nên nuôi một ý tưởng hoặc mối quan hệ bằng lịch chăm sóc đều đặn.',pause:'Chưa nên thúc ép kết quả khi quá trình còn cần thời gian và quan sát.',adjust:'Cần giảm kỳ vọng, bổ sung nguồn lực và lắng nghe nhu cầu thật trước.'},
  'Phu Thê':{proceed:'Nên có một cuộc trò chuyện chân thành, nói rõ nhu cầu và điều có thể cam kết.',pause:'Chưa nên kết luận một mối quan hệ hoặc quyết định chia tay, cưới hỏi chỉ từ lá số.',adjust:'Cần sửa cách giao tiếp, ranh giới hoặc một hành vi lặp lại trước khi yêu cầu người kia thay đổi.'},
  'Huynh Đệ':{proceed:'Nên chủ động một hành động hỗ trợ nhỏ nhưng có giới hạn rõ.',pause:'Chưa nên so sánh, phân xử hoặc gánh thay khi chưa nghe đủ các bên.',adjust:'Cần làm rõ trách nhiệm và cách chia sẻ nguồn lực trước khi tiếp tục hỗ trợ.'}
};

const DIALOGS = {
  terms:{kicker:'Điều khoản sử dụng',title:'Một công cụ để soi chiếu, không quyết định thay bạn.',body:'<p>Mệnh Đồ AI cung cấp nội dung diễn giải truyền thống nhằm mục đích tham khảo và tự khám phá. Bạn chịu trách nhiệm với mọi quyết định của mình.</p><h3>Giới hạn rõ ràng</h3><p>Không dùng nội dung trên trang để thay thế chuyên gia y tế, pháp lý, tài chính hoặc tư vấn tâm lý. Hệ thống không cam kết dự đoán sự kiện tương lai.</p>'},
  privacy:{kicker:'Bảo mật',title:'Ngày sinh được xử lý ngay trên thiết bị.',body:'<p>Bản hiện tại không gửi dữ liệu biểu mẫu lên máy chủ. Phép tính lá số và phần giải nghĩa chạy trong trình duyệt.</p><h3>Bạn kiểm soát dữ liệu</h3><p>Chỉ khi bấm “Lưu trên thiết bị”, thông tin đầu vào mới được lưu trong trình duyệt đang dùng. Nút “Xóa dữ liệu đã lưu” sẽ xóa lá số và phản hồi cục bộ. Tính năng chia sẻ chỉ chia sẻ đường dẫn trang, không gắn ngày sinh vào liên kết.</p>'},
  about:{kicker:'Về Mệnh Đồ',title:'Soi sáng, không gieo sợ hãi.',body:'<p>Mệnh Đồ kết hợp phép an sao Tử Vi Đẩu Số với một lớp giải nghĩa tương tác. Mỗi nhận định phải nêu được cung và sao làm căn cứ.</p><h3>Nguyên tắc</h3><p>Không dọa nạt, không khẳng định định mệnh, không thao túng và không gây hại cho mình, người khác hay muôn loài.</p>'}
};

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const pad = value => String(value).padStart(2,'0');
let currentChart = null;
let currentPalaceIndex = 0;
let currentGuideContext = 'Tổng quan';
let guideHistory = [];
let toastTimer;

const normalizeText = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/đ/g,'d');

function majorNames(palace){ return palace.stars.filter(star => star.type === 'main').map(star => star.name); }
function starNames(palace, type){ return palace.stars.filter(star => star.type === type).map(star => star.name); }
function palaceByName(name){ return currentChart?.palaces.find(palace => palace.name === name); }
function strengthLabel(value){ return ({M:'Miếu',V:'Vượng',Đ:'Đắc',B:'Bình',H:'Hãm'})[value] || '' ; }

function supportMeaning(name){
  if (['Văn Xương','Văn Khúc','Hóa Khoa','Thiên Khôi','Thiên Việt','Văn Tinh'].includes(name)) return 'khả năng học, diễn đạt hoặc được nhìn nhận bằng năng lực';
  if (['Lộc Tồn','Hóa Lộc','Quốc Ấn','Đường Phù'].includes(name)) return 'ý thức xây nguồn lực, uy tín và nền tảng';
  if (['Tả Phù','Hữu Bật','Thiên Quan','Thiên Phúc','Ân Quang','Thiên Quý'].includes(name)) return 'sự hỗ trợ, kết nối và cơ hội nhận đúng người đồng hành';
  if (['Hồng Loan','Thiên Hỷ','Đào Hoa'].includes(name)) return 'độ mở cảm xúc, duyên kết nối và khả năng tạo thiện cảm';
  if (['Thiên Mã','Thanh Long'].includes(name)) return 'động lực dịch chuyển, học qua trải nghiệm và thay đổi môi trường';
  if (['Hóa Quyền','Lực Sĩ','Tướng Quân'].includes(name)) return 'khả năng chủ động, đảm nhiệm và tạo ảnh hưởng';
  return 'một nguồn lực phụ trợ cần được dùng đúng hoàn cảnh';
}

function challengeMeaning(name){
  if (name === 'Hóa Kỵ') return 'dễ suy nghĩ nhiều hoặc vướng ở điều chưa nói rõ; nên kiểm chứng trước khi kết luận';
  if (['Kình Dương','Đà La','Thiên Hình'].includes(name)) return 'ma sát, sự cứng hoặc áp lực phải quyết nhanh; nên thêm khoảng dừng';
  if (['Địa Không','Địa Kiếp','Thiên Không'].includes(name)) return 'biến động và kỳ vọng thay đổi; nên chuẩn bị phương án linh hoạt';
  if (['Hỏa Tinh','Linh Tinh','Phi Liêm'].includes(name)) return 'nhịp phản ứng nhanh; nên phân biệt trực giác với bốc đồng';
  if (['Cô Thần','Quả Tú'].includes(name)) return 'xu hướng tự gánh hoặc thu mình; nên chủ động tạo kênh trao đổi an toàn';
  if (['Tiểu Hao','Đại Hao'].includes(name)) return 'nguồn lực dễ phân tán; nên đặt giới hạn và theo dõi đều đặn';
  return 'một điểm ma sát để quan sát và điều chỉnh, không phải phán quyết xấu';
}

function starExplanation(star, palace){
  const meta = PALACE_META[palace.name];
  const level = strengthLabel(star.strength);
  if (star.type === 'main') {
    const trait = TRAITS[star.name] || 'một sắc thái chủ đạo';
    return `${star.name}${level ? ` ở trạng thái ${level}` : ''} là chính tinh trong cung ${palace.name}. Sao này đưa ${trait} vào ${meta.focus}. Đây là một khuynh hướng để quan sát, không phải nhãn cố định về con người.`;
  }
  if (star.type === 'support') return `${star.name} là sao hỗ trợ tại cung ${palace.name}, gợi ${supportMeaning(star.name)} trong chủ đề ${meta.label.toLowerCase()}. Hiệu quả rõ nhất khi được chuyển thành thói quen hoặc hành động cụ thể.`;
  if (star.type === 'challenge') return `${star.name} tại cung ${palace.name} gợi rằng bạn nên chú ý: ${challengeMeaning(star.name)}. Hệ thống xem đây là tín hiệu quản trị rủi ro, không dùng để gieo sợ hãi.`;
  return `${star.name} mô tả một nhịp phát triển trong cung ${palace.name}. Nên đọc cùng chính tinh và toàn bộ cấu trúc cung.`;
}

function actionConclusion(palace, star=null){
  const supports = palace.stars.filter(item => item.type === 'support').length;
  const challenges = palace.stars.filter(item => item.type === 'challenge').length;
  const difficultMains = palace.stars.filter(item => item.type === 'main' && item.strength === 'H').length;
  const obscured = Number(Boolean(palace.tuan)) + Number(Boolean(palace.triet));
  let baseMode = 'pause';
  if (challenges + difficultMains + obscured >= supports + 2) baseMode = 'adjust';
  else if (supports > challenges && palace.stars.some(item => item.type === 'main')) baseMode = 'proceed';
  let mode = baseMode;
  if (star?.type === 'challenge') mode = 'adjust';
  else if (star?.type === 'support') mode = baseMode === 'adjust' ? 'pause' : 'proceed';
  const labels = {proceed:'Nên tiến từng bước',pause:'Chưa nên quyết vội',adjust:'Cần điều chỉnh trước'};
  const playbook = ACTION_PLAYBOOK[palace.name];
  const signal = `${supports} tín hiệu nâng đỡ và ${challenges} điểm cần quan sát${difficultMains ? `; ${difficultMains} chính tinh ở trạng thái cần thận trọng` : ''}${obscured ? '; có Tuần/Triệt nên cần thêm thời gian kiểm chứng' : ''}`;
  const summaries = {
    proceed:`Cung ${palace.name} đang có thế nâng đỡ nhỉnh hơn điểm ma sát. Có thể tiến, nhưng nên đi bằng bước nhỏ có thước đo.`,
    pause:`Cung ${palace.name} chưa cho một hướng đủ rõ để quyết việc khó đảo ngược. Nên bổ sung dữ liệu đời thực trước.`,
    adjust:`Cung ${palace.name} đang có nhiều điểm ma sát cần quản trị hơn. Hãy sửa nền tảng trước rồi mới đánh giá lại.`
  };
  if (star?.type === 'support') summaries[mode] = mode === 'proceed'
    ? `${star.name} là một nguồn lực hỗ trợ trong cung ${palace.name}. Có thể dùng nguồn lực này cho một bước thử nhỏ.`
    : `${star.name} là điểm nâng đỡ, nhưng chưa đủ để lấn át các điểm ma sát của toàn cung ${palace.name}.`;
  else if (star?.type === 'challenge') summaries.adjust = `${star.name} là điểm cần quản trị trong cung ${palace.name}. Hãy điều chỉnh trước khi dựa vào chủ đề này để quyết việc lớn.`;
  else if (star?.type === 'main') summaries[mode] = `${star.name} là khuynh hướng chính của cung ${palace.name}; kết luận vẫn dựa trên toàn bộ sao nâng đỡ và điểm cần quan sát.`;
  const steps = mode === 'proceed'
    ? ['Chọn một việc nhỏ có thể làm ngay','Đặt mốc kiểm tra sau 7–30 ngày','Giữ lại điều hiệu quả, bỏ điều không phù hợp']
    : mode === 'adjust'
      ? ['Tạm dừng quyết định khó đảo ngược','Sửa một nguyên nhân trong tầm kiểm soát','Kiểm chứng lại bằng kết quả và ý kiến phù hợp']
      : ['Ghi rõ điều còn thiếu dữ liệu','Đối chiếu với một tình huống thật','Chỉ quyết định khi đã có tiêu chí rõ'];
  return {mode,label:labels[mode],summary:summaries[mode],action:playbook[mode],steps,evidence:`Cân bằng tín hiệu: ${signal}.`};
}

function analyzePalace(palace){
  const meta = PALACE_META[palace.name];
  const majors = palace.stars.filter(star => star.type === 'main');
  const supports = palace.stars.filter(star => star.type === 'support');
  const challenges = palace.stars.filter(star => star.type === 'challenge');
  const names = majors.map(star => star.name);
  const traits = majors.map(star => TRAITS[star.name]).filter(Boolean);
  const related = RELATED_PALACES[palace.name];
  const headline = names.length ? `${names.join(' · ')} đặt trọng tâm vào ${meta.label.toLowerCase()}` : `${meta.label}: soi thêm ${related[0]} và ${related[1]}`;
  let copy = meta.intro;
  if (traits.length) copy += ` Với ${names.join(' và ')}, cách biểu hiện nổi bật là ${traits.join('; ')}.`;
  else copy += ` ${VOID_GUIDANCE[palace.name]}`;
  if (palace.body) copy += ' Cung này đồng thời có Thân cư, nên chủ đề thường trở nên rõ hơn qua lựa chọn và trải nghiệm trưởng thành.';
  const support = supports.length ? supports.slice(0,3).map(star => `${star.name}: ${supportMeaning(star.name)}`) : ['Không có sao hỗ trợ nổi bật riêng; hãy nhìn vào chính tinh và liên kết cung.'];
  const watch = challenges.length ? challenges.slice(0,3).map(star => `${star.name}: ${challengeMeaning(star.name)}`) : ['Không có điểm ma sát nổi bật trong nhóm sao đang xét; vẫn cần đối chiếu hoàn cảnh thực tế.'];
  const evidence = `Căn cứ: cung ${palace.name} tại ${palace.branch}${palace.body ? ', có Thân cư' : ''}; ${names.length ? `chính tinh ${names.join(', ')}` : 'vô chính diệu'}; ${supports.length} sao hỗ trợ; ${challenges.length} điểm cần lưu ý; đại hạn ${palace.majorAge}–${palace.majorAge + 9}.`;
  return {meta, headline, copy, support, watch, evidence, conclusion:actionConclusion(palace)};
}

function starMarkup(star){
  const strength = star.strength ? ` <small>${star.strength}</small>` : '';
  return `<button type="button" class="star star-${star.type}" data-star="${escapeHtml(star.name)}" title="Chạm để hiểu sao ${escapeHtml(star.name)}">${escapeHtml(star.name)}${strength}</button>`;
}

function palaceMarkup(palace){
  const majors = palace.stars.filter(star => star.type === 'main');
  const support = palace.stars.filter(star => star.type === 'support');
  const challenge = palace.stars.filter(star => star.type === 'challenge');
  const stage = palace.stars.find(star => star.type === 'stage');
  return `<article class="palace palace-${palace.position}" data-pos="${palace.position}" data-name="${escapeHtml(palace.name)}" role="button" tabindex="0" aria-label="Cung ${escapeHtml(palace.name)} tại ${escapeHtml(palace.branch)}. Chạm để đọc chi tiết.">
    <header><div><strong>${escapeHtml(palace.name)}</strong>${palace.body ? '<b class="body-mark">Thân</b>' : ''}</div><span>${escapeHtml(palace.branch)} · ${escapeHtml(palace.element)}</span></header>
    <div class="major-stars">${majors.length ? majors.map(starMarkup).join('') : '<span class="empty-major">Vô chính diệu</span>'}</div>
    <div class="minor-stars">${support.map(starMarkup).join('')}${challenge.map(starMarkup).join('')}</div>
    <footer><span>${stage ? escapeHtml(stage.name) : ''}</span><span>Đại hạn ${palace.majorAge}–${palace.majorAge + 9}</span></footer>
    ${(palace.tuan || palace.triet) ? `<div class="void-mark">${palace.tuan ? 'TUẦN ' : ''}${palace.triet ? 'TRIỆT' : ''}</div>` : ''}
  </article>`;
}

function centerMarkup(chart){
  const {meta,input} = chart;
  const name = input.name?.trim() || 'Bạn';
  const solar = input.solar, lunar = input.lunar;
  return `<div class="chart-center"><span class="seal">M</span><p>LÁ SỐ TỬ VI ĐẨU SỐ</p><h3>${escapeHtml(name)}</h3><dl>
    <div><dt>Dương lịch</dt><dd>${pad(solar.day)}/${pad(solar.month)}/${solar.year} · ${pad(input.hour)}:${pad(input.minute)}</dd></div>
    <div><dt>Âm lịch</dt><dd>${pad(lunar.day)}/${pad(lunar.month)}/${lunar.year}${lunar.leap ? ' nhuận' : ''}</dd></div>
    <div><dt>Tứ trụ</dt><dd>${meta.yearName} · ${meta.monthName} · ${meta.dayName} · ${meta.hourName}</dd></div>
    <div><dt>Mệnh / Cục</dt><dd>${meta.napAm} · ${meta.bureau.bureau}</dd></div>
    <div><dt>Chủ Mệnh / Thân</dt><dd>${meta.menhChu} · ${meta.thanChu}</dd></div></dl>
    <p class="chart-note">${meta.relation} · Đại hạn đi ${meta.direction.toLowerCase()}</p></div>`;
}

function renderIdentity(chart){
  const {meta,palaces} = chart;
  const menh = palaces[meta.menhPos - 1];
  const than = palaces[meta.thanPos - 1];
  const items = [['Năm sinh',meta.yearName],['Mệnh',`${meta.napAm} · ${menh.branch}`],['Thân',`${than.name} · ${than.branch}`],['Cục',meta.bureau.bureau],['Chủ Mệnh / Thân',`${meta.menhChu} · ${meta.thanChu}`]];
  $('#identity-strip').innerHTML = items.map(([label,value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join('');
}

function renderTopics(){
  $('#topic-grid').innerHTML = PALACE_ORDER.map((name,index) => {
    const palace = palaceByName(name), meta = PALACE_META[name], majors = majorNames(palace).join(' · ') || 'Vô chính diệu';
    return `<button type="button" class="topic-card" data-topic="${escapeHtml(name)}"><div><span>${String(index + 1).padStart(2,'0')} · ${escapeHtml(meta.label)}</span><strong>${escapeHtml(name)}</strong><p>${escapeHtml(majors)}</p></div><b>Đọc cung này →</b></button>`;
  }).join('');
}

function overviewCard(name, label, tone='light'){
  const palace = palaceByName(name), analysis = analyzePalace(palace);
  const majors = majorNames(palace);
  const signal = majors.length ? majors.slice(0,2).join(' · ') : `Không có chính tinh · xem thêm ${RELATED_PALACES[name][0]}`;
  return `<button type="button" class="overview-card ${tone}" data-overview-palace="${escapeHtml(name)}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(analysis.meta.label)}</strong><b>${escapeHtml(signal)}</b><p>${escapeHtml(analysis.copy.split('.').slice(0,2).join('.') + '.')}</p><i>Chạm để xem căn cứ →</i></button>`;
}

function uniqueOverviewPalace(candidates, used){
  const name = candidates.find(candidate => PALACE_ORDER.includes(candidate) && !used.has(candidate))
    || PALACE_ORDER.find(candidate => !used.has(candidate));
  used.add(name);
  return name;
}

function renderOverview(chart){
  const thanPalace = chart.palaces[chart.meta.thanPos - 1];
  const menh = palaceByName('Mệnh');
  const menhAnalysis = analyzePalace(menh);
  const firstStrength = menhAnalysis.support[0] || 'Đọc cung Mệnh để nhận diện nguồn lực chính.';
  const firstWatch = menhAnalysis.watch[0] || 'Đối chiếu với hoàn cảnh thật trước khi kết luận.';
  const used = new Set(['Mệnh']);
  const second = uniqueOverviewPalace([thanPalace.name,'Phúc Đức','Thiên Di'],used);
  const third = uniqueOverviewPalace(['Quan Lộc','Thiên Di','Nô Bộc'],used);
  const fourth = uniqueOverviewPalace(['Tài Bạch','Phúc Đức','Phu Thê','Điền Trạch'],used);
  const angle = {
    'Phúc Đức':'Nền giữ cân bằng','Thiên Di':'Cách bước ra bên ngoài','Nô Bộc':'Cách hợp tác',
    'Tài Bạch':'Cách quản trị nguồn lực','Phu Thê':'Cách đồng hành','Điền Trạch':'Nền tảng an cư'
  };
  const secondLabel = second === thanPalace.name && second !== 'Mệnh' ? 'Càng trưởng thành càng rõ' : (angle[second] || PALACE_META[second].label);
  $('#overview-grid').innerHTML = [
    overviewCard('Mệnh','01 · Cốt lõi','featured'),
    overviewCard(second,`02 · ${secondLabel}`),
    overviewCard(third,`03 · ${third === 'Quan Lộc' ? 'Hướng tạo giá trị' : (angle[third] || PALACE_META[third].label)}`),
    overviewCard(fourth,`04 · ${angle[fourth] || PALACE_META[fourth].label}`)
  ].join('');
  $('#overview-paths').innerHTML = `<div><span>Điểm nâng đỡ nên dùng</span><strong>${escapeHtml(firstStrength)}</strong></div><div><span>Điều nên kiểm chứng</span><strong>${escapeHtml(firstWatch)}</strong></div><button type="button" data-overview-palace="Phu Thê">Xem tình cảm</button><button type="button" data-overview-palace="Phúc Đức">Xem nội tâm</button>`;
}

function renderGuideHistory(){
  const wrap = $('#guide-history');
  if (!guideHistory.length) { wrap.innerHTML = ''; wrap.hidden = true; return; }
  wrap.hidden = false;
  wrap.innerHTML = guideHistory.slice(-3).map(item => `<p class="${item.role}"><span>${item.role === 'user' ? 'Bạn hỏi' : 'Mệnh Đồ'}</span>${escapeHtml(item.text)}</p>`).join('');
}

function rememberGuide(role, text){
  guideHistory.push({role,text:String(text).trim().slice(0,180)});
  if (guideHistory.length > 6) guideHistory = guideHistory.slice(-6);
  renderGuideHistory();
}

function renderGuideVerdict(verdict){
  const safeVerdict = verdict || {mode:'pause',label:'Cần dữ liệu trước',summary:'Hãy lập lá số hoặc chọn đúng cung để nhận kết luận hành động.',action:'Chưa nên kết luận khi chưa có đủ dữ liệu cung và sao.'};
  const box = $('#guide-verdict');
  box.className = `guide-verdict ${safeVerdict.mode || 'pause'}`;
  $('#guide-verdict-label').textContent = safeVerdict.label;
  $('#guide-verdict-title').textContent = safeVerdict.summary;
  $('#guide-verdict-copy').textContent = safeVerdict.action;
}

function setGuide({eyebrow,title,copy,actions=[],basis,verdict}){
  currentGuideContext = eyebrow || title || 'Đọc lá số';
  $('#guide-eyebrow').textContent = eyebrow;
  $('#guide-title').textContent = title;
  $('#guide-copy').textContent = copy;
  $('#guide-basis').textContent = basis || 'Mỗi câu trả lời đều ghi rõ cung và sao làm căn cứ.';
  const activePalace = currentChart ? palaceByName(PALACE_ORDER[currentPalaceIndex]) : null;
  renderGuideVerdict(verdict || (activePalace ? actionConclusion(activePalace) : null));
  const wrap = $('#guide-actions'); wrap.innerHTML = '';
  actions.forEach(action => {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = action.label;
    if (action.palace) button.dataset.palace = action.palace;
    if (action.star) { button.dataset.star = action.star; button.dataset.pos = String(action.pos); }
    if (action.scroll) button.dataset.scroll = action.scroll;
    wrap.append(button);
  });
  $$('#guide-feedback button').forEach(button => { button.disabled = false; button.classList.remove('selected'); });
}

function selectPalace(name, options={}){
  if (!currentChart || !PALACE_ORDER.includes(name)) return;
  currentPalaceIndex = PALACE_ORDER.indexOf(name);
  const palace = palaceByName(name), analysis = analyzePalace(palace);
  $$('.palace').forEach(card => card.classList.toggle('selected', card.dataset.name === name));
  $$('.topic-card').forEach(card => card.classList.toggle('active', card.dataset.topic === name));
  $('#focus-kicker').textContent = `${String(currentPalaceIndex + 1).padStart(2,'0')} · ${analysis.meta.label}`;
  $('#focus-title').textContent = `Cung ${name} — ${analysis.meta.focus}`;
  $('#focus-headline').textContent = analysis.headline;
  $('#focus-copy').textContent = analysis.copy;
  $('#focus-support').innerHTML = analysis.support.map(item => `<li>${escapeHtml(item)}</li>`).join('');
  $('#focus-watch').innerHTML = analysis.watch.map(item => `<li>${escapeHtml(item)}</li>`).join('');
  $('#focus-questions').innerHTML = analysis.meta.questions.map(question => `<li>${escapeHtml(question)}</li>`).join('');
  $('#focus-evidence').textContent = analysis.evidence;
  const verdict = analysis.conclusion;
  $('#focus-verdict').className = `action-card ${verdict.mode}`;
  $('#focus-verdict-badge').textContent = verdict.label;
  $('#focus-verdict-title').textContent = verdict.summary;
  $('#focus-verdict-copy').textContent = verdict.action;
  $('#focus-verdict-steps').innerHTML = verdict.steps.map(item => `<li>${escapeHtml(item)}</li>`).join('');
  $('#focus-verdict-evidence').textContent = verdict.evidence;
  $('#focus-position').textContent = `${String(currentPalaceIndex + 1).padStart(2,'0')} / 12`;
  const related = RELATED_PALACES[name].slice(0,2);
  setGuide({eyebrow:`Đang đọc cung ${name}`,title:analysis.headline,copy:analysis.copy,actions:[...related.map(palaceName => ({label:`Xem ${PALACE_META[palaceName].label}`,palace:palaceName})),{label:'Đến phần đọc sâu',scroll:'deep-dive'}],basis:analysis.evidence,verdict});
  if (options.scroll) $('#deep-dive').scrollIntoView({behavior:'smooth',block:'start'});
}

function showStar(starName, position){
  if (!currentChart) return;
  const palace = currentChart.palaces.find(item => item.position === Number(position));
  const star = palace?.stars.find(item => item.name === starName);
  if (!palace || !star) return;
  selectPalace(palace.name);
  const siblings = palace.stars.filter(item => item.type === 'main' && item.name !== starName).slice(0,2);
  setGuide({eyebrow:`Giải nghĩa ${star.type === 'main' ? 'chính tinh' : 'sao'} · cung ${palace.name}`,title:`${star.name}${star.strength ? ` (${strengthLabel(star.strength)})` : ''}`,copy:starExplanation(star,palace),actions:[{label:`Đọc toàn bộ cung ${palace.name}`,palace:palace.name},...siblings.map(item => ({label:`Hiểu ${item.name}`,star:item.name,pos:palace.position}))],basis:`Vị trí thật trên lá số: ${star.name} tại cung ${palace.name} (${palace.branch})${star.strength ? `, trạng thái ${strengthLabel(star.strength)}` : ''}.`,verdict:actionConclusion(palace,star)});
  $('#guide-panel').scrollIntoView({behavior:'smooth',block:'nearest'});
}

function topicsFromQuery(raw){
  const query = normalizeText(raw);
  if (!query) return [];
  const found = PALACE_ORDER.filter(name => PALACE_META[name].keywords.some(keyword => query.includes(normalizeText(keyword))));
  const aliases = [
    ['Quan Lộc',['viec lam','lam an','cong danh','su nghiep','kinh doanh']],['Tài Bạch',['tien bac','tai san','thu nhap','dau tu','tai chinh']],
    ['Phu Thê',['tinh duyen','nguoi yeu','vo chong','hon nhan']],['Tật Ách',['suc khoe','met moi','stress','can bang']],
    ['Phúc Đức',['binh an','noi tam','tinh than','hanh phuc']],['Thiên Di',['di xa','xuat ngoai','chuyen noi o','moi truong moi']],
    ['Nô Bộc',['cong su','dong nghiep','ban be']],['Mệnh',['diem manh','tinh cach','ban than','toi la ai']]
  ];
  aliases.forEach(([name,words]) => { if (words.some(word => query.includes(word)) && !found.includes(name)) found.push(name); });
  return found;
}

function askGuide(query){
  const topics = topicsFromQuery(query);
  const topic = topics[0];
  if (String(query || '').trim()) rememberGuide('user',query);
  if (!currentChart) {
    openCompanion({title:'Mình cần lá số trước',copy:topic ? `Để đọc ${PALACE_META[topic].label.toLowerCase()}, hãy điền 5 thông tin sinh. Sau đó mình sẽ dẫn bạn đến đúng cung.` : 'Hãy lập lá số trước. Sau đó bạn có thể hỏi bằng lời thường như “công việc”, “tình cảm” hoặc “tiền bạc”.',actions:[{label:'Điền thông tin ngay',scroll:'la-so'}]});
    return;
  }
  if (topics.length > 1) {
    const first = analyzePalace(palaceByName(topics[0])), second = analyzePalace(palaceByName(topics[1]));
    const answer = `Câu hỏi này chạm hai lớp: ${first.meta.label.toLowerCase()} và ${second.meta.label.toLowerCase()}. Nên đọc cung ${topics[0]} trước để thấy trục chính, rồi đối chiếu cung ${topics[1]} để tránh kết luận một chiều.`;
    setGuide({eyebrow:'Câu hỏi có nhiều lớp',title:`${topics[0]} ↔ ${topics[1]}`,copy:answer,actions:topics.slice(0,3).map(name => ({label:`Mở cung ${name}`,palace:name})),basis:`Căn cứ được tách thành ${topics.slice(0,3).map(name => `cung ${name}`).join(', ')} theo chính từ khóa trong câu hỏi của bạn.`,verdict:{mode:'pause',label:'Chưa nên quyết vội',summary:'Câu hỏi đang liên quan nhiều mặt nên chưa phù hợp để kết luận từ một cung.',action:`Đọc cung ${topics[0]} trước, đối chiếu cung ${topics[1]}, rồi kiểm tra lại bằng dữ liệu thực tế.`}});
    rememberGuide('assistant',answer);
    $('#guide-panel').scrollIntoView({behavior:'smooth',block:'start'});
    return;
  }
  if (topic) {
    selectPalace(topic,{scroll:true});
    const answer = `Mình đã đưa bạn đến cung ${topic}. Hãy đọc phần “Điểm nâng đỡ”, “Điều cần quan sát” và ba câu hỏi hành động trước.`;
    rememberGuide('assistant',answer);
    showToast(`Đã mở cung ${topic} cho câu hỏi của bạn.`);
    return;
  }
  const fallback = 'Mình chưa muốn đoán sai ý bạn. Hãy chọn một hướng gần nhất; sau đó bạn có thể hỏi tiếp ngay trong cung đó.';
  setGuide({eyebrow:'Mình chưa chắc bạn đang hỏi chủ đề nào',title:'Chọn một hướng gần nhất nhé.',copy:'Bạn có thể nói ngắn gọn: công việc, tiền bạc, tình yêu, gia đình, sức khỏe, đi xa hoặc bản thân.',actions:['Quan Lộc','Tài Bạch','Phu Thê','Mệnh'].map(name => ({label:PALACE_META[name].label,palace:name})),basis:'Mệnh Đồ chỉ chuyển câu hỏi đến đúng cung; không tự bịa thêm dữ liệu ngoài lá số.',verdict:{mode:'pause',label:'Chưa nên kết luận',summary:'Câu hỏi chưa chỉ ra đúng chủ đề cần xem.',action:'Chọn một hướng gần nhất để hệ thống đưa bạn đến đúng cung và nêu căn cứ.'}});
  rememberGuide('assistant',fallback);
}

function render(chart, options={}){
  currentChart = chart;
  const {meta,input,palaces} = chart;
  const name = input.name?.trim() || 'Bạn', solar = input.solar, lunar = input.lunar;
  $('#chart-grid').innerHTML = palaces.map(palaceMarkup).join('') + centerMarkup(chart);
  $('#result-title').textContent = `Chào ${name}, đây là bản đồ của bạn.`;
  $('#result-subtitle').textContent = `Dương lịch ${pad(solar.day)}/${pad(solar.month)}/${solar.year} · Âm lịch ${pad(lunar.day)}/${pad(lunar.month)}/${lunar.year}${lunar.leap ? ' nhuận' : ''} · giờ ${meta.hourName}`;
  renderIdentity(chart); renderTopics(); renderOverview(chart);
  $('#technical-summary').innerHTML = `<strong>Dữ liệu kỹ thuật:</strong> Mệnh tại ${escapeHtml(palaces[meta.menhPos - 1].branch)}; Thân tại ${escapeHtml(palaces[meta.thanPos - 1].branch)}; ${escapeHtml(meta.bureau.bureau)}; ${escapeHtml(meta.napAm)}; Chủ Mệnh ${escapeHtml(meta.menhChu)}; Chủ Thân ${escapeHtml(meta.thanChu)}.`;
  $('#ket-qua').classList.add('visible');
  document.body.classList.add('has-chart');
  selectPalace('Mệnh');
  const menhPalace = palaceByName('Mệnh');
  const menhStars = majorNames(menhPalace).join(' và ') || 'cấu trúc vô chính diệu';
  setGuide({eyebrow:'Lá số đã sẵn sàng',title:`Chào ${name}, mình khuyên bắt đầu từ cung Mệnh.`,copy:`Cung Mệnh của bạn có ${menhStars}. Sau đó hãy xem cung có Thân cư để hiểu chủ đề càng rõ khi trưởng thành.`,actions:[{label:'Đọc cung Mệnh',palace:'Mệnh'},{label:`Xem Thân cư ${palaces[meta.thanPos - 1].name}`,palace:palaces[meta.thanPos - 1].name},{label:'Hỏi về công việc',palace:'Quan Lộc'}],basis:`Căn cứ mở đầu: Mệnh tại ${menhPalace.branch}; Thân tại cung ${palaces[meta.thanPos - 1].name} (${palaces[meta.thanPos - 1].branch}).`});
  updateCompanionForChart(name);
  if (!options.silent) setTimeout(() => $('#ket-qua').scrollIntoView({behavior:'smooth',block:'start'}),80);
}

function chartInputFromForm(){
  const date = parseBirthDate($('#birth').value);
  const [hour,minute] = $('#birth-time').value.split(':').map(Number);
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) throw new Error('Vui lòng chọn giờ sinh.');
  const gender = $('#gender').value;
  if (!gender) throw new Error('Vui lòng chọn giới tính dùng để an thuận/nghịch.');
  const place = $('#birth-place').value.trim();
  if (!place) throw new Error('Vui lòng nhập nơi sinh để hoàn thiện hồ sơ.');
  return {...date,hour,minute,gender,name:$('#name').value.trim(),place,isLunar:$('#calendar-type').value === 'lunar',leap:$('#lunar-leap').checked};
}

function summaryText(){
  if (!currentChart) return '';
  const {input,meta,palaces} = currentChart, name = input.name?.trim() || 'Bạn';
  const lines = [`MỆNH ĐỒ AI — LÁ SỐ CỦA ${name.toUpperCase()}`,`Dương lịch: ${pad(input.solar.day)}/${pad(input.solar.month)}/${input.solar.year} ${pad(input.hour)}:${pad(input.minute)}`,`Âm lịch: ${pad(input.lunar.day)}/${pad(input.lunar.month)}/${input.lunar.year}${input.lunar.leap ? ' nhuận' : ''}`,`Tứ trụ: ${meta.yearName} · ${meta.monthName} · ${meta.dayName} · ${meta.hourName}`,`Mệnh/Cục: ${meta.napAm} · ${meta.bureau.bureau}`,'TỔNG QUAN 60 GIÂY'];
  ['Mệnh','Quan Lộc','Tài Bạch','Phu Thê'].forEach(name => { const palace = palaces.find(item => item.name === name); lines.push(`${name}: ${majorNames(palace).join(' · ') || 'Vô chính diệu'} — ${PALACE_META[name].intro}`); });
  lines.push('','Nội dung mang tính tham khảo và tự soi chiếu, không phải lời tiên đoán.');
  return lines.join('\n');
}

function saveChart(){
  if (!currentChart) return;
  const {input} = currentChart;
  const data = {day:input.day,month:input.month,year:input.year,hour:input.hour,minute:input.minute,gender:input.gender,name:input.name,place:input.place,isLunar:input.isLunar,leap:input.leap};
  localStorage.setItem('menhdo:chart:v2',JSON.stringify(data));
  showToast('Đã lưu lá số trong trình duyệt này.');
  openCompanion({title:'Đã cất lá số cho bạn',copy:'Lần sau mở trang, bạn có thể tiếp tục từ lá số đã lưu trên chính thiết bị này.',actions:[{label:'Tiếp tục đọc cung Mệnh',palace:'Mệnh'}]});
}

async function copySummary(){
  const text = summaryText();
  try { await navigator.clipboard.writeText(text); showToast('Đã sao chép phần tóm tắt.'); }
  catch { const area=document.createElement('textarea'); area.value=text; area.style.position='fixed'; area.style.opacity='0'; document.body.append(area); area.select(); document.execCommand('copy'); area.remove(); showToast('Đã sao chép phần tóm tắt.'); }
}

async function shareChart(){
  const shareData = {title:'Mệnh Đồ AI — Lá số biết trò chuyện',text:'Lập lá số Tử Vi Đẩu Số, chạm từng cung và hỏi bằng lời thường. Dữ liệu được tính trên thiết bị.',url:location.origin + location.pathname};
  try {
    if (navigator.share) { await navigator.share(shareData); showToast('Đã mở bảng chia sẻ.'); }
    else { await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`); showToast('Đã sao chép liên kết công khai.'); }
  } catch (error) { if (error?.name !== 'AbortError') showToast('Chưa thể chia sẻ. Bạn hãy sao chép địa chỉ trên trình duyệt.'); }
}

function deleteLocalData(){
  try {
    localStorage.removeItem('menhdo:chart:v2');
    localStorage.removeItem('menhdo:feedback:v1');
    showToast('Đã xóa lá số và phản hồi lưu trên thiết bị.');
  } catch { showToast('Trình duyệt không cho phép xóa dữ liệu cục bộ.'); }
}

function recordFeedback(kind, button){
  const key='menhdo:feedback:v1';
  let data={useful:0,unclear:0,contexts:{}};
  try { data={...data,...JSON.parse(localStorage.getItem(key) || '{}')}; } catch {}
  data.contexts = data.contexts || {};
  data[kind] = (Number(data[kind]) || 0) + 1;
  data.contexts[currentGuideContext] = (Number(data.contexts[currentGuideContext]) || 0) + 1;
  try { localStorage.setItem(key,JSON.stringify(data)); } catch {}
  $$('#guide-feedback button').forEach(item => { item.disabled=true; item.classList.toggle('selected',item===button); });
  showToast(kind === 'useful' ? 'Cảm ơn bạn. Mệnh Đồ đã ghi nhận câu trả lời hữu ích.' : 'Đã ghi nhận. Hãy chọn một chủ đề bên dưới để Mệnh Đồ nói cụ thể hơn.');
  if (kind === 'unclear') setGuide({eyebrow:'Mình sẽ nói cụ thể hơn',title:'Bạn muốn làm rõ phần nào?',copy:'Chọn một hướng. Mình sẽ mở đúng cung, chỉ ra sao làm căn cứ và đưa ba câu hỏi áp dụng.',actions:['Mệnh','Quan Lộc','Tài Bạch','Phu Thê'].map(name=>({label:PALACE_META[name].label,palace:name})),basis:'Phản hồi được lưu cục bộ để cải thiện cách bạn sử dụng trên thiết bị này.'});
}

function showToast(message){
  const toast = $('#toast'); toast.textContent = message; toast.classList.add('visible');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('visible'),2600);
}

function openCompanion(config){
  if (config === true) config = {};
  const card = $('#companion-card'); card.hidden = false; $('#companion-launcher').setAttribute('aria-expanded','true');
  if (config?.title) $('#companion-title').textContent = config.title;
  if (config?.copy) $('#companion-copy').textContent = config.copy;
  if (config?.actions) {
    const wrap = $('#companion-actions'); wrap.innerHTML='';
    config.actions.forEach(action => { const button=document.createElement('button'); button.type='button'; button.textContent=action.label; if(action.palace)button.dataset.palace=action.palace;if(action.scroll)button.dataset.scroll=action.scroll;if(action.restore)button.dataset.restore='true';wrap.append(button); });
  }
}

function closeCompanion(){ $('#companion-card').hidden = true; $('#companion-launcher').setAttribute('aria-expanded','false'); }

function updateCompanionForChart(name){
  openCompanion({title:`${name}, lá số đã mở ✦`,copy:'Bây giờ bạn có thể chạm bất kỳ cung hoặc sao nào. Hoặc chọn một câu hỏi bên dưới.',actions:[{label:'Tôi nên xem gì trước?',palace:'Mệnh'},{label:'Công việc',palace:'Quan Lộc'},{label:'Tình cảm',palace:'Phu Thê'},{label:'Tiền bạc',palace:'Tài Bạch'}]});
  closeCompanion();
}

function restoreSavedChart(){
  try { const raw=localStorage.getItem('menhdo:chart:v2'); if(!raw)return false; const input=JSON.parse(raw); const chart=generateChart(input); render(chart); return true; }
  catch { localStorage.removeItem('menhdo:chart:v2'); return false; }
}

function openInfoDialog(key){
  const data = DIALOGS[key]; if(!data)return;
  $('#dialog-kicker').textContent=data.kicker; $('#dialog-title').textContent=data.title; $('#dialog-body').innerHTML=data.body;
  const dialog=$('#info-dialog'); dialog.showModal(); document.body.classList.add('dialog-open');
}

$('#calendar-type').addEventListener('change',event => { $('#leap-wrap').hidden = event.target.value !== 'lunar'; });
$('#la-so').addEventListener('focusin',event => {
  const label = event.target.closest('[data-guide]'); if(!label)return;
  const message = FIELD_GUIDE[label.dataset.guide]; $('#field-help').innerHTML = `<b>✦ Mệnh Đồ:</b> ${escapeHtml(message)}`;
  $('#companion-title').textContent = 'Mình đang lắng nghe';
  $('#companion-copy').textContent = message;
});
$('#la-so').addEventListener('submit',event => {
  event.preventDefault(); const error=$('#form-error'); error.textContent='';
  try { render(generateChart(chartInputFromForm())); }
  catch (err) { error.textContent=err.message || 'Thông tin chưa hợp lệ.'; error.scrollIntoView({behavior:'smooth',block:'center'}); openCompanion({title:'Mình cần bạn kiểm tra một chút',copy:error.textContent,actions:[{label:'Quay lại biểu mẫu',scroll:'la-so'}]}); }
});

$('#chart-grid').addEventListener('click',event => {
  const star=event.target.closest('[data-star]'); if(star){event.stopPropagation();showStar(star.dataset.star,star.closest('.palace').dataset.pos);return;}
  const palace=event.target.closest('.palace'); if(palace)selectPalace(palace.dataset.name,{scroll:true});
});
$('#chart-grid').addEventListener('keydown',event => { const palace=event.target.closest('.palace'); if(palace && event.target===palace && ['Enter',' '].includes(event.key)){event.preventDefault();selectPalace(palace.dataset.name,{scroll:true});} });
$('#topic-grid').addEventListener('click',event => { const card=event.target.closest('[data-topic]'); if(card)selectPalace(card.dataset.topic,{scroll:true}); });
$('#quick-overview').addEventListener('click',event => { const card=event.target.closest('[data-overview-palace]'); if(card)selectPalace(card.dataset.overviewPalace,{scroll:true}); });
$('#guide-actions').addEventListener('click',event => handleAction(event));
$('#companion-actions').addEventListener('click',event => handleAction(event));
function handleAction(event){
  const button=event.target.closest('button'); if(!button)return;
  if(button.dataset.palace){selectPalace(button.dataset.palace,{scroll:true});closeCompanion();}
  if(button.dataset.star)showStar(button.dataset.star,button.dataset.pos);
  if(button.dataset.scroll){$(`#${button.dataset.scroll}`)?.scrollIntoView({behavior:'smooth',block:'start'});closeCompanion();}
  if(button.dataset.restore){restoreSavedChart();closeCompanion();}
}

$('#guide-search').addEventListener('submit',event => {event.preventDefault();const input=$('#guide-query');askGuide(input.value);input.value='';});
$('#guide-feedback').addEventListener('click',event => { const button=event.target.closest('[data-feedback]'); if(button)recordFeedback(button.dataset.feedback,button); });
$('#focus-prev').addEventListener('click',()=>selectPalace(PALACE_ORDER[(currentPalaceIndex+11)%12]));
$('#focus-next').addEventListener('click',()=>selectPalace(PALACE_ORDER[(currentPalaceIndex+1)%12]));
$$('.filter-button').forEach(button => button.addEventListener('click',()=>{
  $$('.filter-button').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});
  const chart=$('#chart-grid');chart.classList.remove('filter-main','filter-support','filter-challenge');if(button.dataset.filter!=='all')chart.classList.add(`filter-${button.dataset.filter}`);
  const labels={all:'Đang hiện toàn bộ sao.',main:'Chỉ hiện 14 chính tinh — trục chính của mỗi cung.',support:'Chỉ hiện các sao hỗ trợ.',challenge:'Chỉ hiện những điểm cần quan sát tỉnh táo.'}; showToast(labels[button.dataset.filter]);
}));

$$('[data-preview-topic]').forEach(button => button.addEventListener('click',()=>{
  const topic=button.dataset.previewTopic;if(currentChart)selectPalace(topic,{scroll:true});else openCompanion({title:`Bạn đang hỏi về ${PALACE_META[topic].label.toLowerCase()}`,copy:`Để trả lời theo đúng lá số, mình cần ngày, giờ sinh và giới tính. Sau khi tính xong, mình sẽ mở thẳng cung ${topic}.`,actions:[{label:'Điền thông tin ngay',scroll:'la-so'}]});
}));

$('#save-chart').addEventListener('click',saveChart);$('#copy-summary').addEventListener('click',copySummary);$('#share-chart').addEventListener('click',shareChart);$('#delete-data').addEventListener('click',deleteLocalData);$('#new-chart').addEventListener('click',()=>{$('#ket-qua').classList.remove('visible');document.body.classList.remove('has-chart');currentChart=null;guideHistory=[];renderGuideHistory();$('#la-so').reset();$('#leap-wrap').hidden=true;$('#la-so').scrollIntoView({behavior:'smooth',block:'start'});openCompanion({title:'Mình sẵn sàng cho lá số mới',copy:'Hãy chạm từng ô. Mình sẽ giải thích vì sao thông tin đó cần thiết.',actions:[]});});
$('#companion-launcher').addEventListener('click',()=>$('#companion-card').hidden?openCompanion(true):closeCompanion());$('#companion-close').addEventListener('click',closeCompanion);
$$('[data-dialog]').forEach(button=>button.addEventListener('click',()=>openInfoDialog(button.dataset.dialog)));$('.dialog-close').addEventListener('click',()=>$('#info-dialog').close());$('#info-dialog').addEventListener('close',()=>document.body.classList.remove('dialog-open'));$('#info-dialog').addEventListener('click',event=>{if(event.target===$('#info-dialog'))$('#info-dialog').close();});

renderGuideHistory();
setTimeout(()=>{
  let hasSaved=false;try{hasSaved=!!localStorage.getItem('menhdo:chart:v2');}catch{}
  openCompanion({title:'Chào bạn 👋',copy:hasSaved?'Mình thấy bạn có một lá số đã lưu trên thiết bị. Bạn muốn tiếp tục hay lập lá số mới?':'Mình là Mệnh Đồ. Chạm vào từng ô hoặc hỏi mình điều bạn muốn biết — mình sẽ chỉ đúng nơi cần xem.',actions:hasSaved?[{label:'Mở lá số đã lưu',restore:true},{label:'Lập lá số mới',scroll:'la-so'}]:[{label:'Bắt đầu lập lá số',scroll:'la-so'},{label:'Xem cách hoạt động',scroll:'cach-hoat-dong'}]});
},700);
