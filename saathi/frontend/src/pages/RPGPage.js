import React, { useState, useEffect } from 'react';
import { rpgApi } from '../services/api';
import toast from 'react-hot-toast';

const LEVEL_COLORS = ['#94a3b8','#10b981','#0ea5e9','#7c3aed','#f59e0b','#ef4444','#ec4899','#a78bfa'];
const QUEST_ICONS = {
  MOOD_LOG:'😊', JOURNAL:'📓', HABIT:'⚡', GRATITUDE:'🌱', FAMILY_CONTACT:'❤️',
  FOCUS_SESSION:'🌳', COMMUNITY_POST:'🌍', COMPANION_CHAT:'🤗', GOAL_PROGRESS:'🎯', DAILY_LOGIN:'🌅'
};

export default function RPGPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(null);
  const [tab, setTab] = useState('quests');

  const load = async () => {
    try {
      const res = await rpgApi.getProfile();
      setProfile(res.data.data);
    } catch { toast.error('Failed to load RPG profile'); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const completeQuest = async (questId) => {
    setCompleting(questId);
    try {
      await rpgApi.completeQuest(questId);
      toast.success('Quest completed! XP earned! ⭐');
      load();
    } catch (e) { toast.error(e?.message || 'Already completed'); }
    setCompleting(null);
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:56, marginBottom:12, animation:'float 2s ease-in-out infinite' }}>⚔️</div>
        <p style={{ color:'var(--text-secondary)' }}>Loading your adventure...</p>
      </div>
    </div>
  );

  const { level=1, title='Seeker', xpPoints=0, streakDays=0,
          progressPercent=0, currentLevelXp=0, nextLevelXp=100,
          todayQuests=[], completedQuestsToday=0, achievements=[] } = profile || {};

  const levelColor = LEVEL_COLORS[Math.min(level - 1, LEVEL_COLORS.length - 1)];
  const completedQuests = todayQuests.filter(q => q.completed);
  const activeQuests = todayQuests.filter(q => !q.completed);

  return (
    <div style={{ maxWidth:1000, margin:'0 auto' }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26 }}>Life RPG ⚔️</h1>
        <p style={{ color:'var(--text-secondary)', marginTop:4 }}>You are the hero of your own story. Level up every day.</p>
      </div>

      {/* Hero Card */}
      <div style={{
        borderRadius:24, padding:'32px 36px', marginBottom:24,
        background:`linear-gradient(135deg, ${levelColor}22, ${levelColor}44)`,
        border:`1px solid ${levelColor}44`, position:'relative', overflow:'hidden'
      }}>
        <div style={{ position:'absolute', top:-60, right:-60, width:200, height:200,
          borderRadius:'50%', background:`${levelColor}22` }} />
        <div style={{ position:'absolute', bottom:-40, left:60, width:120, height:120,
          borderRadius:'50%', background:`${levelColor}18` }} />

        <div style={{ display:'flex', alignItems:'center', gap:24, flexWrap:'wrap' }}>
          {/* Level Badge */}
          <div style={{
            width:96, height:96, borderRadius:24, flexShrink:0,
            background:`linear-gradient(135deg,${levelColor},${levelColor}cc)`,
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            boxShadow:`0 8px 24px ${levelColor}44`, color:'white'
          }}>
            <span style={{ fontSize:11, fontWeight:600, opacity:.85, letterSpacing:1 }}>LEVEL</span>
            <span style={{ fontSize:40, fontWeight:700, fontFamily:'Poppins', lineHeight:1 }}>{level}</span>
          </div>

          <div style={{ flex:1 }}>
            <h2 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:26, marginBottom:4 }}>{title}</h2>
            <div style={{ display:'flex', gap:20, flexWrap:'wrap', marginBottom:14 }}>
              {[
                { icon:'⭐', label:'Total XP', value:xpPoints.toLocaleString() },
                { icon:'🔥', label:'Day Streak', value:`${streakDays} days` },
                { icon:'🏆', label:'Quests Done', value:`${completedQuestsToday}/${todayQuests.length} today` },
                { icon:'🎖️', label:'Achievements', value:achievements.length },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ background:'rgba(255,255,255,0.5)', borderRadius:12, padding:'8px 14px' }}>
                  <p style={{ fontSize:11, color:'var(--text-secondary)', marginBottom:1 }}>{label}</p>
                  <p style={{ fontWeight:700, fontSize:16 }}>{icon} {value}</p>
                </div>
              ))}
            </div>

            {/* XP Progress Bar */}
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:5 }}>
                <span style={{ color:'var(--text-secondary)' }}>Progress to Level {level + 1}</span>
                <span style={{ fontWeight:600, color:levelColor }}>{currentLevelXp} / {nextLevelXp} XP</span>
              </div>
              <div style={{ background:'rgba(255,255,255,0.4)', borderRadius:99, height:10, overflow:'hidden' }}>
                <div style={{
                  height:'100%', borderRadius:99,
                  background:`linear-gradient(90deg,${levelColor},${levelColor}cc)`,
                  width:`${progressPercent}%`, transition:'width 0.8s ease',
                  boxShadow:`0 0 8px ${levelColor}88`
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {[
          { id:'quests', label:'📋 Daily Quests' },
          { id:'achievements', label:'🏆 Achievements' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`btn ${tab===t.id ? 'btn-primary' : 'btn-ghost'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'quests' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          {/* Active Quests */}
          <div>
            <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:12, fontSize:15 }}>
              ⚔️ Active Quests
            </h3>
            {activeQuests.length === 0 ? (
              <div className="card" style={{ textAlign:'center', padding:32 }}>
                <div style={{ fontSize:40, marginBottom:8 }}>🎉</div>
                <p style={{ fontWeight:600, color:'#10b981' }}>All quests completed!</p>
                <p style={{ fontSize:13, color:'var(--text-secondary)', marginTop:4 }}>Amazing work today, hero!</p>
              </div>
            ) : activeQuests.map(quest => (
              <div key={quest.id} className="card" style={{ marginBottom:10, padding:'16px 18px' }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                  <div style={{ fontSize:28, flexShrink:0 }}>{QUEST_ICONS[quest.type] || '⚡'}</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:600, fontSize:14, marginBottom:2 }}>{quest.title}</p>
                    <p style={{ fontSize:12, color:'var(--text-secondary)', marginBottom:10 }}>{quest.description}</p>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ background:'#fef3c7', color:'#d97706', padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:600 }}>
                        +{quest.xpReward} XP
                      </span>
                      <button onClick={() => completeQuest(quest.id)} disabled={completing === quest.id}
                        className="btn btn-primary" style={{ padding:'6px 14px', fontSize:12 }}>
                        {completing === quest.id ? '...' : '✓ Complete'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Completed Quests */}
          <div>
            <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:12, fontSize:15 }}>
              ✅ Completed Today
            </h3>
            {completedQuests.length === 0 ? (
              <div className="card" style={{ textAlign:'center', padding:32, border:'2px dashed var(--border)' }}>
                <div style={{ fontSize:32, marginBottom:8 }}>🗡️</div>
                <p style={{ color:'var(--text-secondary)', fontSize:13 }}>Complete quests to see them here</p>
              </div>
            ) : completedQuests.map(quest => (
              <div key={quest.id} className="card" style={{ marginBottom:10, padding:'16px 18px', background:'#f0fdf4', borderColor:'#bbf7d0', opacity:.85 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:24 }}>{QUEST_ICONS[quest.type] || '⚡'}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:600, fontSize:14, textDecoration:'line-through', color:'var(--text-muted)' }}>{quest.title}</p>
                    <p style={{ fontSize:12, color:'#10b981', fontWeight:500, marginTop:2 }}>✓ +{quest.xpReward} XP earned</p>
                  </div>
                  <span style={{ fontSize:20 }}>🏅</span>
                </div>
              </div>
            ))}

            {completedQuests.length > 0 && (
              <div style={{
                borderRadius:14, padding:'14px 18px', marginTop:8,
                background:'linear-gradient(135deg,#f0fdf4,#dcfce7)', border:'1px solid #bbf7d0',
                textAlign:'center'
              }}>
                <p style={{ fontWeight:700, color:'#15803d', fontSize:15 }}>
                  🌟 {completedQuests.reduce((s,q) => s + q.xpReward, 0)} XP earned today!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'achievements' && (
        <div>
          <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:16, fontSize:15 }}>
            Your Achievements ({achievements.length})
          </h3>
          {achievements.length === 0 ? (
            <div className="card" style={{ textAlign:'center', padding:56 }}>
              <div style={{ fontSize:56, marginBottom:16 }}>🏆</div>
              <h3 style={{ fontFamily:'Poppins', fontWeight:600, marginBottom:8 }}>No achievements yet</h3>
              <p style={{ color:'var(--text-secondary)' }}>Complete daily quests and build streaks to unlock badges!</p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
              {achievements.map((ach, i) => (
                <div key={i} className="card" style={{
                  padding:'20px', textAlign:'center',
                  border:`2px solid ${ach.badgeColor}44`,
                  background:`${ach.badgeColor}08`
                }}>
                  <div style={{ fontSize:40, marginBottom:8 }}>{ach.icon || '🏅'}</div>
                  <p style={{ fontWeight:700, fontSize:14, color:ach.badgeColor, marginBottom:4 }}>{ach.title}</p>
                  <p style={{ fontSize:12, color:'var(--text-secondary)' }}>{ach.description}</p>
                  <p style={{ fontSize:10, color:'var(--text-muted)', marginTop:8 }}>
                    {new Date(ach.unlockedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
