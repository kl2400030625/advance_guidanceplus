import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { MessageSquare, Plus, ThumbsUp, Eye, Send, X, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const tagOptions = ['Career Advice', 'DSA', 'Internships', 'Web Dev', 'AI/ML', 'Resume', 'Interviews', 'Study Tips', 'Projects'];

export default function Forum() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postDetail, setPostDetail] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: [] });
  const [comment, setComment] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('');

  const loadPosts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterTag) params.tag = filterTag;
      if (search) params.search = search;
      const data = await api.getPosts(params);
      setPosts(data);
    } catch { toast.error('Failed to load posts'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadPosts(); }, [filterTag, search]);

  const openPost = async (post) => {
    setSelectedPost(post.id);
    try {
      const data = await api.getPost(post.id);
      setPostDetail(data);
    } catch { toast.error('Failed to load post'); }
  };

  const submitPost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return toast.error('Title and content required');
    try {
      await api.createPost(newPost);
      toast.success('Post created! 🎉');
      setNewPost({ title: '', content: '', tags: [] });
      setShowNewPost(false);
      loadPosts();
    } catch { toast.error('Failed to create post'); }
  };

  const submitComment = async () => {
    if (!comment.trim()) return;
    try {
      const c = await api.addComment(selectedPost, { content: comment });
      setPostDetail(prev => ({ ...prev, comments: [...(prev.comments || []), { ...c, author_name: user?.name }] }));
      setComment('');
      toast.success('Comment added!');
    } catch { toast.error('Failed to add comment'); }
  };

  const upvote = async (postId) => {
    try {
      await api.upvotePost(postId);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p));
      toast.success('Upvoted! 👍');
    } catch {}
  };

  const toggleTag = (tag) => setNewPost(p => ({ ...p, tags: p.tags.includes(tag) ? p.tags.filter(t => t !== tag) : [...p.tags, tag] }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl mb-1">Community Forum</h1>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">Ask questions, share knowledge, and connect with fellow students.</p>
        </div>
        <button onClick={() => setShowNewPost(true)} className="btn-primary">
          <Plus size={16} /> New Post
        </button>
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="glass-card p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto" style={{ background: 'var(--surface)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg">Create a Post</h3>
              <button onClick={() => setShowNewPost(false)} className="btn-ghost p-1.5 rounded-lg"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input className="input-field" placeholder="Ask a question or share something..." value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea className="input-field min-h-28 resize-none" placeholder="Write your post here..." value={newPost.content} onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {tagOptions.map(t => (
                    <button key={t} type="button" onClick={() => toggleTag(t)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${newPost.tags.includes(t) ? 'btn-primary py-1 px-3' : 'btn-ghost py-1 px-3'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowNewPost(false)} className="btn-ghost flex-1 justify-center py-2.5">Cancel</button>
                <button onClick={submitPost} className="btn-primary flex-1 justify-center py-2.5">Post →</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Post List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search & Filter */}
          <div className="flex gap-3">
            <input className="input-field flex-1 py-2 text-sm" placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} />
            <select className="input-field py-2 text-sm w-40" value={filterTag} onChange={e => setFilterTag(e.target.value)}>
              <option value="">All Tags</option>
              {tagOptions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="shimmer h-24 rounded-2xl" />)}</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare size={48} className="mx-auto mb-3 opacity-20" />
              <p className="font-semibold mb-2">No posts yet</p>
              <button onClick={() => setShowNewPost(true)} className="btn-primary text-sm">Be the first to post!</button>
            </div>
          ) : posts.map(post => (
            <div key={post.id} className={`glass-card p-5 cursor-pointer transition-all animate-slide-up ${selectedPost === post.id ? 'border-primary-500 shadow-lg' : ''}`}
              onClick={() => openPost(post)}>
              {post.is_pinned && <span className="badge badge-warning text-xs mb-2 inline-flex">📌 Pinned</span>}
              <h3 className="font-bold text-sm mb-2">{post.title}</h3>
              <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--text-muted)' }}>{post.content}</p>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex gap-1.5">
                  {(post.tags || []).slice(0, 3).map(t => <span key={t} className="badge badge-primary text-xs">{t}</span>)}
                </div>
                <div className="ml-auto flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <button onClick={(e) => { e.stopPropagation(); upvote(post.id); }} className="flex items-center gap-1 hover:text-primary-500 transition-colors">
                    <ThumbsUp size={12} /> {post.upvotes}
                  </button>
                  <span className="flex items-center gap-1"><MessageSquare size={12} /> {post.comment_count || 0}</span>
                  <span className="flex items-center gap-1"><Eye size={12} /> {post.views}</span>
                  <span className="font-medium">{post.author_name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Post Detail / Sidebar */}
        <div className="space-y-4">
          {selectedPost && postDetail ? (
            <div className="glass-card p-5 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-bold text-sm">{postDetail.post?.title}</h3>
                <button onClick={() => { setSelectedPost(null); setPostDetail(null); }} className="btn-ghost p-1 rounded-lg flex-shrink-0"><X size={14} /></button>
              </div>
              <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>by {postDetail.post?.author_name} · {new Date(postDetail.post?.created_at).toLocaleDateString()}</p>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text)' }}>{postDetail.post?.content}</p>
              <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>COMMENTS ({postDetail.comments?.length || 0})</p>
                <div className="space-y-3 mb-4">
                  {postDetail.comments?.map(c => (
                    <div key={c.id} className="p-3 rounded-xl" style={{ background: 'var(--surface-2)' }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--primary)' }}>{c.author_name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.content}</p>
                    </div>
                  ))}
                  {postDetail.comments?.length === 0 && <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>No comments yet. Be first!</p>}
                </div>
                <div className="flex gap-2">
                  <input className="input-field flex-1 text-xs py-2" placeholder="Add a comment..." value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => e.key === 'Enter' && submitComment()} />
                  <button onClick={submitComment} className="btn-primary p-2 rounded-xl"><Send size={14} /></button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-5">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Tag size={14} /> Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tagOptions.map(t => (
                  <button key={t} onClick={() => setFilterTag(filterTag === t ? '' : t)}
                    className={`badge text-xs cursor-pointer transition-all ${filterTag === t ? 'badge-primary' : 'badge-info'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
