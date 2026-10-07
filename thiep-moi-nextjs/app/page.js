import Petals from './components/Petals';
import Rsvp from './components/Rsvp';
import Music from './components/Music';

const MAP_URL =
  'https://www.google.com/maps/search/?api=1&query=Dragon+Hot+Pot+04+Cao+Th%E1%BA%AFng+Qu%E1%BA%ADn+3+TP+HCM';

export default function Page() {
  return (
    <>
      <Petals />
      <Music />

      {/* Biểu tượng dùng lại */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <symbol id="plum" viewBox="0 0 40 40">
            <g fill="currentColor">
              <circle cx="20" cy="9" r="7" />
              <circle cx="31" cy="17" r="7" />
              <circle cx="27" cy="30" r="7" />
              <circle cx="13" cy="30" r="7" />
              <circle cx="9" cy="17" r="7" />
            </g>
            <circle cx="20" cy="20" r="4.2" fill="#ffe9a8" />
          </symbol>
          <symbol id="corner" viewBox="0 0 60 60">
            <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 56 V10 Q4 4 10 4 H56" />
              <path d="M12 56 V22 Q12 12 22 12 H56" opacity=".6" />
              <path d="M22 22 q8 -2 8 6 q-6 2 -8 -6 z" fill="currentColor" stroke="none" />
              <path d="M30 30 q10 -4 12 4 q-8 4 -12 -4 z" fill="currentColor" stroke="none" opacity=".7" />
            </g>
            <circle cx="9" cy="9" r="3.5" fill="currentColor" />
          </symbol>
        </defs>
      </svg>

      <div className="wrap">
        <div className="rod" />

        <main className="scroll">
          <svg className="corner tl" aria-hidden="true"><use href="#corner" /></svg>
          <svg className="corner tr" aria-hidden="true"><use href="#corner" /></svg>
          <svg className="corner bl" aria-hidden="true"><use href="#corner" /></svg>
          <svg className="corner br" aria-hidden="true"><use href="#corner" /></svg>

          <div className="vert l" aria-hidden="true">六宮粉黛 · 共赴盛宴</div>
          <div className="vert r" aria-hidden="true">鍋氣升騰 · 恭候大駕</div>

          <div className="inner">
            <div className="header-han" aria-hidden="true">請柬</div>
            <div className="sub-han" aria-hidden="true">設宴相邀</div>

            <div className="divider"><svg aria-hidden="true"><use href="#plum" /></svg></div>

            <h1>Thiếp Mời Dự Yến</h1>
            <p className="chieu">Phụng thiên thừa vận, chiếu viết</p>

            <p className="lead">Gửi toàn thể phi tần hậu cung,</p>

            <p className="body-text">
              Hậu cung <span className="team">team Designẻ</span> ngày đêm cần mẫn, nét bút tung hoành,
              sắc màu rực rỡ, từ phi tử đến tần chủ ai nấy đều vất vả. Công lao ấy trẫm đều ghi nhận trong lòng.
            </p>
            <p className="body-text">
              Nay trẫm đặc biệt hạ lệnh thiết yến, <strong>mời cả hậu cung, mời team Designẻ</strong>{' '}
              đến dùng bữa tại <strong>Dragon Hotpot Cao Thắng</strong>.{' '}
              Các ái phi chớ vắng mặt, kẻo nồi lẩu nguội mà lòng trẫm cũng nguội theo.
            </p>

            <div className="details">
              <div className="row">
                <div className="ico" aria-hidden="true">時</div>
                <div>
                  <div className="lab">Thời khắc</div>
                  <div className="val">
                    18:30 · Thứ Sáu, 09/10/2026
                    <small>Vào giờ Dậu, khi đèn lồng vừa thắp sáng</small>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="ico" aria-hidden="true">宴</div>
                <div>
                  <div className="lab">Yến tiệc</div>
                  <div className="val">
                    Dragon Hotpot Cao Thắng
                    <small>04 Cao Thắng, Phường 5, Quận 3, TP. Hồ Chí Minh</small>
                    <a className="map-btn" href={MAP_URL} target="_blank" rel="noopener noreferrer">
                      Xem đường đến yến điện ›
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <Rsvp />

            <p className="quote">
              Hậu cung ba nghìn giai lệ tề tựu đông đủ, chỉ chờ một nồi lẩu cay nóng hổi để trẫm thưởng yến cùng các ái phi.
            </p>

            <div className="khamthu" aria-hidden="true">欽此</div>
            <div className="khamthu-vn">Khâm thử</div>
          </div>

          <div className="seal" aria-hidden="true">玉<br />璽</div>
        </main>

        <div className="rod" />
      </div>
    </>
  );
}
