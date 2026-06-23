import React, { useState, useEffect } from 'react';
import { notificationApi } from '../services/api';
import toast from 'react-hot-toast';

const TYPE_META = {
  DAILY_CHECK_IN:   { icon: '🌅', color: '#7c3aed', label: 'Daily Check-in' },
  MOOD_REMINDER:    { icon: '😊', color: '#0ea5e9', label: 'Mood Reminder' },
  HABIT_REMINDER:   { icon: '⚡', color: '#10b981', label: 'Habit Reminder' },
  FAMILY_NUDGE:     { icon: '❤️', color: '#ef4444', label: 'Family Nudge' },
  DAILY_SURPRISE:   { icon: '🎁', color: '#f59e0b', label: 'Daily Surprise' },
  COMMUNITY_REPLY:  { icon: '💬', color: '#06b6d4', label: 'Community' },
  ACHIEVEMENT:      { icon: '🏆', color: '#f59e0b', label: 'Achievement' },
  SYSTEM:           { icon: '🔔', color: '#8b5cf6', label: 'System' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [prefs,         setPrefs]         = useState(null);
  const [unread,        setUnread]        = useState(0);
  const [tab,           setTab]           = useState('inbox');
  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);

  const load = async () => {
    try {
      const [n, p, u] = await Promise.all([
        notificationApi.getAll(),
        notificationApi.getPreferences(),
        notificationApi.getUnreadCount(),
      ]);
      setNotifications(n.data.data || []);
      setPrefs(p.data.data);
      setUnread(u.data.data || 0);
    } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const markAllRead = async () => {
    await notificationApi.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnread(0);
    toast.success('All read ✓');
  };

  const sendTest = async () => {
    await notificationApi.sendTest();
    toast.success('Test notification sent!');
    load();
  };

  const savePrefs = async () => {
    setSaving(true);
    try {
      await notificationApi.updatePreferences({
        dailyCheckIn:     prefs.dailyCheckIn,
        moodReminder:     prefs.moodReminder,
        habitReminder:    prefs.habitReminder,
        familyNudges:     prefs.familyNudges,
        dailySurprise:    prefs.dailySurprise,
        communityReplies: prefs.communityReplies,
        reminderTime:     prefs.reminderTime,
      });
      toast.success('Preferences saved!');
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const requestPushPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Your browser does not support push notifications');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      toast.success('Push notifications enabled! 🔔');
      // In a real implementation with VAPID keys, subscribe here:
      // const registration = await navigator.serviceWorker.ready;
      // const subscription = await registration.pushManager.subscribe({ ... });
      // await notificationApi.registerToken(JSON.stringify(subscription), 'web');
    } else {
      toast.error('Permission denied. You can change this in browser settings.');
    }
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:56, marginBottom:12 }}>🔔</div>
        <p style={{ color:'var(--text-secondary)' }}>Loading notifications...</p>
      </div>
    </div>
  );

  const PREF_ITEMS = [
    { key:'dailyCheckIn',     label:'Daily Check-in Reminder',    icon:'🌅', desc:'A gentle evening nudge to reflect on your day' },
    { key:'moodReminder',     label:'Mood Tracker Reminder',       icon:'😊', desc:'Reminder to log how you are feeling' },
    { key:'habitReminder',    label:'Habit Tracker Reminder',      icon:'⚡', desc:'Keep your streak going' },
    { key:'familyNudges',     label:'Family Connection Nudges',    icon:'❤️', desc:'Reminder to reach out to your circle' },
    { key:'dailySurprise',    label:'Daily Surprise Alert',        icon:'🎁', desc:'Be notified when new surprises arrive' },
    { key:'communityReplies', label:'Community Reply Alerts',      icon:'💬', desc:'When someone responds to your posts' },
  ];

  return (
    <div style={{ maxWidth:800, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Notifications 🔔</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4 }}>
          Gentle nudges. Never spam. Always kind.
        </p>
      </div>

      {/* Enable push banner */}
      <div style={{ borderRadius:16, padding:'16px 22px', marginBottom:20,
        background:'linear-gradient(135deg,#f5f3ff,#ede9fe)', border:'1px solid #ddd6fe',
        display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
        <div>
          <p style={{ fontWeight:600, color:'#7c3aed', marginBottom:2 }}>Enable Push Notifications</p>
          <p style={{ fontSize:13, color:'#5b21b6' }}>Get SAATHI's gentle reminders even when the app is closed</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={requestPushPermission} className="btn btn-primary" style={{ fontSize:13 }}>
            🔔 Enable
          </button>
          <button onClick={sendTest} className="btn btn-ghost" style={{ fontSize:13 }}>
            Test
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        <button onClick={() => setTab('inbox')}
          className={`btn ${tab==='inbox' ? 'btn-primary' : 'btn-ghost'}`}>
          📬 Inbox {unread > 0 && <span style={{ background:'#ef4444', color:'white', borderRadius:99,
            padding:'1px 7px', fontSize:11, marginLeft:4 }}>{unread}</span>}
        </button>
        <button onClick={() => setTab('preferences')}
          className={`btn ${tab==='preferences' ? 'btn-primary' : 'btn-ghost'}`}>
          ⚙️ Preferences
        </button>
      </div>

      {tab === 'inbox' && (
        <div>
          {notifications.length > 0 && unread > 0 && (
            <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:12 }}>
              <button onClick={markAllRead} className="btn btn-ghost" style={{ fontSize:12 }}>
                ✓ Mark all read
              </button>
            </div>
          )}

          {notifications.length === 0 ? (
            <div className="card" style={{ textAlign:'center', padding:56 }}>
              <div style={{ fontSize:56, marginBottom:16 }}>📭</div>
              <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:8 }}>All quiet here</h3>
              <p style={{ color:'var(--text-secondary)' }}>Your notifications will appear here</p>
              <button onClick={sendTest} className="btn btn-secondary" style={{ marginTop:16 }}>
                Send a test notification
              </button>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {notifications.map((n, i) => {
                const meta = TYPE_META[n.type] || TYPE_META.SYSTEM;
                return (
                  <div key={i} className="card" style={{
                    padding:'14px 18px', display:'flex', gap:12, alignItems:'flex-start',
                    background: n.read ? 'white' : `${meta.color}08`,
                    borderLeft: n.read ? 'none' : `4px solid ${meta.color}` }}>
                    <div style={{ fontSize:24, flexShrink:0 }}>{meta.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                        <p style={{ fontWeight: n.read ? 400 : 700, fontSize:14 }}>{n.title}</p>
                        <span style={{ fontSize:11, color:'var(--text-muted)', flexShrink:0, marginLeft:12 }}>
                          {new Date(n.createdAt).toLocaleDateString('en',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}
                        </span>
                      </div>
                      <p style={{ fontSize:13, color:'var(--text-secondary)', marginTop:2 }}>{n.body}</p>
                    </div>
                    {!n.read && (
                      <div style={{ width:8, height:8, borderRadius:'50%',
                        background:meta.color, flexShrink:0, marginTop:5 }} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'preferences' && prefs && (
        <div className="card">
          <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:6 }}>Notification Preferences</h3>
          <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:20 }}>
            Choose what SAATHI reminds you about. All notifications are gentle — never pushy.
          </p>

          <div style={{ display:'flex', flexDirection:'column', gap:2, marginBottom:20 }}>
            {PREF_ITEMS.map(({ key, label, icon, desc }) => (
              <div key={key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'14px 16px', borderRadius:12, background:'var(--soft-gray)' }}>
                <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                  <span style={{ fontSize:22 }}>{icon}</span>
                  <div>
                    <p style={{ fontWeight:500, fontSize:14 }}>{label}</p>
                    <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:1 }}>{desc}</p>
                  </div>
                </div>
                <label style={{ position:'relative', display:'inline-block', width:44, height:24, flexShrink:0 }}>
                  <input type="checkbox" checked={prefs[key]} onChange={e => setPrefs({ ...prefs, [key]: e.target.checked })}
                    style={{ opacity:0, width:0, height:0 }} />
                  <span style={{
                    position:'absolute', cursor:'pointer', inset:0, borderRadius:99,
                    background: prefs[key] ? '#7c3aed' : '#e2e8f0', transition:'0.3s'
                  }}>
                    <span style={{
                      position:'absolute', top:2, left: prefs[key] ? 22 : 2, width:20, height:20,
                      borderRadius:'50%', background:'white', transition:'0.3s',
                      boxShadow:'0 1px 4px rgba(0,0,0,0.2)'
                    }} />
                  </span>
                </label>
              </div>
            ))}
          </div>

          <div style={{ marginBottom:20 }}>
            <label className="label">Reminder Time</label>
            <input type="time" className="input" value={prefs.reminderTime}
              onChange={e => setPrefs({ ...prefs, reminderTime: e.target.value })}
              style={{ maxWidth:160 }} />
            <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>
              When you'd like to receive your daily reminders
            </p>
          </div>

          <button onClick={savePrefs} disabled={saving} className="btn btn-primary">
            {saving ? 'Saving...' : '💾 Save Preferences'}
          </button>
        </div>
      )}
    </div>
  );
}
