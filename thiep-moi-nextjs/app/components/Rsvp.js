'use client';

import { useEffect, useState } from 'react';

export default function Rsvp() {
  const [name, setName] = useState('');
  const [entries, setEntries] = useState([]);
  const [note, setNote] = useState('');
  const [ready, setReady] = useState(false);

  const fetchEntries = async () => {
    try {
      const res = await fetch('/api/rsvp');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setEntries(data.data);
      }
    } catch (err) {
      console.error('Lỗi khi tải RSVP:', err);
    } finally {
      setReady(true);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  async function submit(status) {
    const n = name.trim().replace(/\s+/g, ' ').slice(0, 40);
    if (!n) {
      setNote('Ái phi hãy ghi danh tính trước khi phúc đáp nhé.');
      return;
    }

    setNote('Đang gửi phúc đáp...');

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: n, status }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setEntries(data.data);
        setName('');
        setNote(
          status === 'yes'
            ? `${n} đã tiếp chỉ. Hẹn gặp tại yến điện!`
            : `${n} đã cáo lỗi. Lần sau nhớ bù cho trẫm một bữa.`
        );
      } else {
        setNote(`Lỗi: ${data.error || 'Không lưu được dữ liệu'}`);
      }
    } catch (err) {
      console.error('Lỗi gửi RSVP:', err);
      setNote('Không thể kết nối đến server. Kiểm tra kết nối Redis.');
    }
  }

  async function remove(n) {
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DELETE', name: n }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setEntries(data.data);
        setNote('');
      }
    } catch (err) {
      console.error('Lỗi xóa RSVP:', err);
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit('yes');
    }
  }

  const yes = entries.filter((e) => e.status === 'yes').sort((a, b) => a.at - b.at);
  const no = entries.filter((e) => e.status === 'no').sort((a, b) => a.at - b.at);

  return (
    <section className="rsvp" aria-labelledby="rsvp-title">
      <div className="rsvp-title" id="rsvp-title">Phúc Đáp</div>

      <input
        className="rsvp-name"
        type="text"
        value={name}
        maxLength={40}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Ghi danh tính của ái phi"
        aria-label="Tên của bạn"
        autoComplete="off"
      />

      <button type="button" className="rsvp-yes" onClick={() => submit('yes')}>
        Thần thiếp tuân chỉ, xin có mặt
      </button>
      <button type="button" className="rsvp-no" onClick={() => submit('no')}>
        Tiếc thay, thần thiếp bất tiện
      </button>

      <p className="rsvp-msg" role="status" aria-live="polite">{note}</p>

      {ready && yes.length > 0 && (
        <div className="rsvp-list">
          <div className="rsvp-count">{yes.length} vị đã tiếp chỉ</div>
          <div className="chips">
            {yes.map((e) => (
              <span className="chip" key={e.name} style={{ paddingLeft: 11 }}>
                {e.name}
                <button
                  type="button"
                  className="chip-x"
                  onClick={() => remove(e.name)}
                  aria-label={`Xóa ${e.name}`}
                  title="Xóa"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {ready && no.length > 0 && (
        <div className="rsvp-list">
          <div className="rsvp-count">{no.length} vị cáo lỗi</div>
          <div className="chips">
            {no.map((e) => (
              <span className="chip chip-no" key={e.name} style={{ paddingLeft: 11 }}>
                {e.name}
                <button
                  type="button"
                  className="chip-x"
                  onClick={() => remove(e.name)}
                  aria-label={`Xóa ${e.name}`}
                  title="Xóa"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}