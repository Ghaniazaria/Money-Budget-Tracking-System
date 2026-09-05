import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  CheckSquare, 
  Plus, 
  Search, 
  Pin, 
  PinOff, 
  Trash2, 
  Edit3, 
  Copy, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  GraduationCap, 
  Briefcase, 
  Tag, 
  BookOpen, 
  Sparkles,
  ArrowRight,
  X,
  Layers,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NoteItem, TaskItem, WorkspaceType } from '../../types';

export const NotesTasksView: React.FC = () => {
  const { 
    notes, 
    tasks, 
    addNote, 
    updateNote, 
    deleteNote, 
    togglePinNote, 
    addTask, 
    updateTaskStatus, 
    deleteTask,
    workspaceType,
    switchWorkspace,
    workspaceName,
    language,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'notes' | 'tasks'>('notes');
  
  // Notes state
  const [noteSearch, setNoteSearch] = useState('');
  const [noteCategoryFilter, setNoteCategoryFilter] = useState<string>('all');
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);

  // Note form state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState<NoteItem['category']>('academic');
  const [noteSubject, setNoteSubject] = useState('');
  const [noteTags, setNoteTags] = useState('');
  const [noteColor, setNoteColor] = useState<NoteItem['color']>('emerald');
  const [notePinned, setNotePinned] = useState(false);

  // Tasks state
  const [taskSearch, setTaskSearch] = useState('');
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'urgent' | 'completed'>('pending');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDueDate, setTaskDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [taskDueTime, setTaskDueTime] = useState('23:59');
  const [taskPriority, setTaskPriority] = useState<TaskItem['priority']>('medium');
  const [taskCategory, setTaskCategory] = useState<TaskItem['category']>(workspaceType === 'student' ? 'assignment' : 'project');
  const [taskSubject, setTaskSubject] = useState('');

  // Filtered Notes
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const matchWorkspace = n.workspace === 'all' || n.workspace === workspaceType;
      const matchSearch = noteSearch === '' || 
        n.title.toLowerCase().includes(noteSearch.toLowerCase()) || 
        n.content.toLowerCase().includes(noteSearch.toLowerCase()) ||
        (n.subject && n.subject.toLowerCase().includes(noteSearch.toLowerCase())) ||
        n.tags.some(t => t.toLowerCase().includes(noteSearch.toLowerCase()));
      const matchCategory = noteCategoryFilter === 'all' || n.category === noteCategoryFilter;
      return matchWorkspace && matchSearch && matchCategory;
    });
  }, [notes, noteSearch, noteCategoryFilter, workspaceType]);

  const pinnedNotes = useMemo(() => filteredNotes.filter(n => n.pinned), [filteredNotes]);
  const otherNotes = useMemo(() => filteredNotes.filter(n => !n.pinned), [filteredNotes]);

  // Filtered Tasks
  const todayStr = new Date().toISOString().split('T')[0];
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchWorkspace = t.workspace === 'all' || t.workspace === workspaceType;
      const matchSearch = taskSearch === '' ||
        t.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(taskSearch.toLowerCase())) ||
        (t.subjectOrProject && t.subjectOrProject.toLowerCase().includes(taskSearch.toLowerCase()));
      
      let matchStatus = true;
      if (taskFilter === 'pending') matchStatus = t.status !== 'completed';
      else if (taskFilter === 'completed') matchStatus = t.status === 'completed';
      else if (taskFilter === 'urgent') matchStatus = t.status !== 'completed' && t.priority === 'high';

      return matchWorkspace && matchSearch && matchStatus;
    });
  }, [tasks, taskSearch, taskFilter, workspaceType]);

  const pendingTasksCount = tasks.filter(t => t.status !== 'completed' && (t.workspace === 'all' || t.workspace === workspaceType)).length;
  const urgentTasksCount = tasks.filter(t => t.status !== 'completed' && t.priority === 'high' && (t.workspace === 'all' || t.workspace === workspaceType)).length;
  const completedTasksCount = tasks.filter(t => t.status === 'completed' && (t.workspace === 'all' || t.workspace === workspaceType)).length;

  const handleOpenNoteModal = (note?: NoteItem) => {
    if (note) {
      setEditingNote(note);
      setNoteTitle(note.title);
      setNoteContent(note.content);
      setNoteCategory(note.category);
      setNoteSubject(note.subject || '');
      setNoteTags(note.tags.join(', '));
      setNoteColor(note.color || 'emerald');
      setNotePinned(note.pinned);
    } else {
      setEditingNote(null);
      setNoteTitle('');
      setNoteContent('');
      setNoteCategory(workspaceType === 'student' ? 'academic' : 'project');
      setNoteSubject(workspaceType === 'student' ? 'Mata Kuliah / Pelajaran' : 'Proyek Klien');
      setNoteTags('');
      setNoteColor('emerald');
      setNotePinned(false);
    }
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    const tagsArray = noteTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (editingNote) {
      updateNote(editingNote.id, {
        title: noteTitle.trim(),
        content: noteContent.trim(),
        category: noteCategory,
        subject: noteSubject.trim() || undefined,
        tags: tagsArray,
        color: noteColor,
        pinned: notePinned,
      });
    } else {
      addNote({
        title: noteTitle.trim(),
        content: noteContent.trim(),
        category: noteCategory,
        subject: noteSubject.trim() || undefined,
        tags: tagsArray,
        color: noteColor,
        pinned: notePinned,
        workspace: workspaceType,
      });
    }
    setIsNoteModalOpen(false);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addTask({
      title: taskTitle.trim(),
      description: taskDesc.trim() || undefined,
      dueDate: taskDueDate,
      dueTime: taskDueTime || undefined,
      priority: taskPriority,
      status: 'pending',
      category: taskCategory,
      subjectOrProject: taskSubject.trim() || undefined,
      workspace: workspaceType,
    });

    setTaskTitle('');
    setTaskDesc('');
    setTaskSubject('');
    setIsTaskModalOpen(false);
  };

  const copyNoteText = (note: NoteItem) => {
    const text = `${note.title}\n${note.subject ? `[${note.subject}]\n` : ''}\n${note.content}`;
    navigator.clipboard.writeText(text);
    showToast(
      language === 'id' ? 'Catatan Disalin' : 'Note Copied',
      language === 'id' ? 'Teks catatan berhasil disalin ke clipboard.' : 'Note text copied to clipboard.',
      'info'
    );
  };

  const getUrgencyInfo = (dueDate: string, status: string) => {
    if (status === 'completed') {
      return { text: language === 'id' ? 'Selesai' : 'Completed', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800' };
    }
    const diff = Math.ceil((new Date(dueDate).getTime() - new Date(todayStr).getTime()) / (1000 * 3600 * 24));
    if (diff < 0) {
      return { text: language === 'id' ? `Terlewat ${Math.abs(diff)} hari` : `${Math.abs(diff)}d overdue`, color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800' };
    } else if (diff === 0) {
      return { text: language === 'id' ? 'Batas Hari Ini' : 'Due Today', color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800' };
    } else if (diff === 1) {
      return { text: language === 'id' ? 'Besok' : 'Due Tomorrow', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800' };
    } else {
      return { text: language === 'id' ? `${diff} hari lagi` : `${diff} days left`, color: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' };
    }
  };

  const getColorClass = (color?: string) => {
    switch (color) {
      case 'blue':
        return 'border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20';
      case 'amber':
        return 'border-amber-200 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20';
      case 'purple':
        return 'border-purple-200 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/20';
      case 'rose':
        return 'border-rose-200 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20';
      default:
        return 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20';
    }
  };

  return (
    <div id="notes-tasks-view" className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Workspace Switcher & Context Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 rounded-2xl p-4 sm:p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-white/15 text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
              {workspaceType === 'student' 
                ? (language === 'id' ? '🎓 Workspace Pelajar & Mahasiswa' : '🎓 Student & Academic Mode')
                : (language === 'id' ? '💼 Workspace Pekerja Lepas / Studio' : '💼 Freelancer & Studio Mode')}
            </span>
            <span className="text-xs text-emerald-200 font-medium">{workspaceName}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            {workspaceType === 'student'
              ? (language === 'id' ? 'Catatan Kuliah, PR & Manajemen Waktu Belajar' : 'Academic Notes, Homework & Study Planner')
              : (language === 'id' ? 'Catatan Klien, Riset & Manajemen Batas Waktu Proyek' : 'Client Notes, Research & Project Task Tracking')}
          </h2>
          <p className="text-xs text-emerald-100/80 max-w-xl">
            {workspaceType === 'student'
              ? (language === 'id' ? 'Atur jadwal tugas kuliah, ujian, praktikum, dan catatan semesteran dengan mudah di samping keuangan saku Anda.' : 'Keep track of college coursework, exam deadlines, and study notes alongside your budget.')
              : (language === 'id' ? 'Simpan brief klien, catatan meeting, dan checklist milestone pengerjaan proyek agar tidak ada deadline terlewat.' : 'Organize client project briefs, meeting notes, and milestone deadlines all in one place.')}
          </p>
        </div>

        {/* Quick Workspace Switch Button */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
          <button
            id="toggle-workspace-mode-btn"
            onClick={() => switchWorkspace(workspaceType === 'student' ? 'freelance' : 'student')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            {workspaceType === 'student' ? (
              <>
                <Briefcase className="w-3.5 h-3.5 text-emerald-700" />
                <span>{language === 'id' ? 'Ganti ke Mode Freelance' : 'Switch to Freelance'}</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                <span>{language === 'id' ? 'Ganti ke Mode Pelajar' : 'Switch to Student'}</span>
              </>
            )}
          </button>
          <span className="text-[11px] text-emerald-200/70 hidden sm:inline">
            {language === 'id' ? '1-klik ganti mode profil' : '1-click profile toggle'}
          </span>
        </div>
      </div>

      {/* Main Tab Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-2">
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
          <button
            id="tab-notes-btn"
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-white dark:bg-gray-900 text-emerald-800 dark:text-emerald-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{language === 'id' ? 'Catatan & Rangkuman' : 'Notes & Summaries'}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              {filteredNotes.length}
            </span>
          </button>

          <button
            id="tab-tasks-btn"
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'tasks'
                ? 'bg-white dark:bg-gray-900 text-emerald-800 dark:text-emerald-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>{language === 'id' ? 'Tugas & Batas Waktu' : 'Tasks & Deadlines'}</span>
            {pendingTasksCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold">
                {pendingTasksCount}
              </span>
            )}
          </button>
        </div>

        {/* Primary Action Button */}
        <div>
          {activeTab === 'notes' ? (
            <button
              id="add-note-modal-btn"
              onClick={() => handleOpenNoteModal()}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'id' ? 'Tulis Catatan Baru' : 'Write New Note'}</span>
            </button>
          ) : (
            <button
              id="add-task-modal-btn"
              onClick={() => setIsTaskModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'id' ? 'Tambah Tugas Baru' : 'Add New Task'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: NOTES VIEW */}
      {/* ========================================================= */}
      {activeTab === 'notes' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Search and Category Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="search-notes-input"
                type="text"
                value={noteSearch}
                onChange={(e) => setNoteSearch(e.target.value)}
                placeholder={language === 'id' ? 'Cari judul, topik, mata kuliah, atau isi catatan...' : 'Search notes, subjects, or keywords...'}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
              {noteSearch && (
                <button
                  onClick={() => setNoteSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-medium">
              {[
                { id: 'all', label: language === 'id' ? 'Semua' : 'All' },
                { id: 'academic', label: language === 'id' ? '🎓 Akademik / Kuliah' : '🎓 Academic' },
                { id: 'project', label: language === 'id' ? '💼 Proyek / Klien' : '💼 Projects' },
                { id: 'finance', label: language === 'id' ? '💰 Keuangan & Saku' : '💰 Finance' },
                { id: 'personal', label: language === 'id' ? '💡 Ide Pribadi' : '💡 Ideas' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setNoteCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                    noteCategoryFilter === cat.id
                      ? 'bg-emerald-800 text-white font-bold'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pinned Notes Section */}
          {pinnedNotes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <Pin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{language === 'id' ? 'Catatan Disematkan (Pinned)' : 'Pinned Notes'}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={() => handleOpenNoteModal(note)}
                    onDelete={() => deleteNote(note.id)}
                    onTogglePin={() => togglePinNote(note.id)}
                    onCopy={() => copyNoteText(note)}
                    getColorClass={getColorClass}
                    language={language}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other Notes Grid */}
          <div className="space-y-3">
            {pinnedNotes.length > 0 && otherNotes.length > 0 && (
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {language === 'id' ? 'Semua Catatan' : 'All Notes'}
              </div>
            )}

            {filteredNotes.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {language === 'id' ? 'Belum ada catatan ditemukan' : 'No notes found'}
                  </h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    {noteSearch
                      ? (language === 'id' ? 'Coba ubah kata kunci pencarian atau kategori filter.' : 'Try changing your search query or filter.')
                      : (language === 'id' ? 'Mulai buat catatan materi pelajaran, ringkasan riset, atau ide baru sekarang.' : 'Create your first lecture summary or project notes.')}
                  </p>
                </div>
                <button
                  onClick={() => handleOpenNoteModal()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'id' ? 'Buat Catatan Pertama' : 'Create First Note'}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={() => handleOpenNoteModal(note)}
                    onDelete={() => deleteNote(note.id)}
                    onTogglePin={() => togglePinNote(note.id)}
                    onCopy={() => copyNoteText(note)}
                    getColorClass={getColorClass}
                    language={language}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 2: TASK MANAGEMENT VIEW */}
      {/* ========================================================= */}
      {activeTab === 'tasks' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Metric Summary Cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xs">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-tight block">
                {language === 'id' ? 'Tugas Aktif' : 'Active Tasks'}
              </span>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {pendingTasksCount}
              </div>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                {language === 'id' ? 'Perlu diselesaikan' : 'Pending completion'}
              </span>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xs">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-tight block">
                {language === 'id' ? 'Mendekati Batas / Urgen' : 'Urgent & Soon'}
              </span>
              <div className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                {urgentTasksCount}
              </div>
              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">
                {language === 'id' ? 'Prioritas tinggi / dekat' : 'High priority'}
              </span>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xs">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-tight block">
                {language === 'id' ? 'Tugas Terselesaikan' : 'Completed'}
              </span>
              <div className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                {completedTasksCount}
              </div>
              <span className="text-[10px] text-gray-400 font-medium">
                {language === 'id' ? 'Selesai tepat waktu' : 'Done on time'}
              </span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="search-tasks-input"
                type="text"
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                placeholder={language === 'id' ? 'Cari judul tugas, mata kuliah, atau deskripsi...' : 'Search tasks or subjects...'}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
              {taskSearch && (
                <button
                  onClick={() => setTaskSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-medium">
              {[
                { id: 'pending', label: language === 'id' ? 'Belum Selesai' : 'To Do' },
                { id: 'urgent', label: language === 'id' ? 'Prioritas Tinggi' : 'High Priority' },
                { id: 'completed', label: language === 'id' ? 'Selesai' : 'Completed' },
                { id: 'all', label: language === 'id' ? 'Semua' : 'All' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTaskFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                    taskFilter === f.id
                      ? 'bg-emerald-800 text-white font-bold'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-2.5">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {language === 'id' ? 'Tidak ada tugas dalam daftar' : 'No tasks in this list'}
                  </h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    {language === 'id' ? 'Semua tugas telah diselesaikan atau belum ditambahkan.' : 'All tasks completed or none added yet.'}
                  </p>
                </div>
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'id' ? 'Buat Tugas Baru' : 'Add New Task'}</span>
                </button>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const urgency = getUrgencyInfo(task.dueDate, task.status);
                const isDone = task.status === 'completed';

                return (
                  <div
                    key={task.id}
                    className={`flex items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl border bg-white dark:bg-gray-850 transition-all ${
                      isDone 
                        ? 'border-gray-200 dark:border-gray-800 opacity-60 bg-gray-50/50 dark:bg-gray-900/50' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-800 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      {/* Checkbox */}
                      <button
                        onClick={() => updateTaskStatus(task.id, isDone ? 'pending' : 'completed')}
                        className={`mt-0.5 sm:mt-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                          isDone
                            ? 'bg-emerald-700 border-emerald-700 text-white'
                            : 'border-gray-300 dark:border-gray-600 hover:border-emerald-600'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div className="min-w-0 space-y-0.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`text-xs font-bold ${isDone ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                            {task.title}
                          </span>

                          {task.subjectOrProject && (
                            <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] font-semibold text-gray-600 dark:text-gray-300">
                              {task.subjectOrProject}
                            </span>
                          )}

                          {task.priority === 'high' && !isDone && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 uppercase">
                              {language === 'id' ? 'Urgen' : 'Urgent'}
                            </span>
                          )}
                        </div>

                        {task.description && (
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right Meta & Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className={`px-2 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 ${urgency.color}`}>
                        <Calendar className="w-3 h-3" />
                        <span>{urgency.text}</span>
                        {task.dueTime && <span>({task.dueTime})</span>}
                      </div>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 text-gray-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                        title={language === 'id' ? 'Hapus Tugas' : 'Delete Task'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT NOTE */}
      {/* ========================================================= */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>{editingNote ? (language === 'id' ? 'Edit Catatan' : 'Edit Note') : (language === 'id' ? 'Tulis Catatan Baru' : 'New Note')}</span>
              </h3>
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {language === 'id' ? 'Judul Catatan' : 'Note Title'} *
                </label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder={language === 'id' ? 'Contoh: Rangkuman Struktur Data Bab 3' : 'e.g. Algorithms Lecture Summary'}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {language === 'id' ? 'Kategori' : 'Category'}
                  </label>
                  <select
                    value={noteCategory}
                    onChange={(e) => setNoteCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="academic">{language === 'id' ? '🎓 Akademik / Kuliah' : 'Academic'}</option>
                    <option value="project">{language === 'id' ? '💼 Proyek / Klien' : 'Project / Freelance'}</option>
                    <option value="finance">{language === 'id' ? '💰 Keuangan & Saku' : 'Finance'}</option>
                    <option value="personal">{language === 'id' ? '💡 Ide Pribadi' : 'Personal'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {language === 'id' ? 'Mata Kuliah / Topik' : 'Subject / Topic'}
                  </label>
                  <input
                    type="text"
                    value={noteSubject}
                    onChange={(e) => setNoteSubject(e.target.value)}
                    placeholder={language === 'id' ? 'CS-101 / Riset Skripsi' : 'CS-101 / Client'}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {language === 'id' ? 'Isi Catatan / Ringkasan' : 'Content / Body'}
                </label>
                <textarea
                  rows={6}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder={language === 'id' ? 'Tulis poin-poin materi, rumus, catatan kuliah, atau ide riset...' : 'Write lecture points, formulas, or project notes...'}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {language === 'id' ? 'Tag Label (pisahkan koma)' : 'Tags (comma separated)'}
                  </label>
                  <input
                    type="text"
                    value={noteTags}
                    onChange={(e) => setNoteTags(e.target.value)}
                    placeholder="Ujian, Praktikum, Bab 1"
                    className="w-full px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                    {language === 'id' ? 'Warna Aksen' : 'Accent Color'}
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    {[
                      { id: 'emerald', bg: 'bg-emerald-600' },
                      { id: 'blue', bg: 'bg-blue-600' },
                      { id: 'amber', bg: 'bg-amber-600' },
                      { id: 'purple', bg: 'bg-purple-600' },
                      { id: 'rose', bg: 'bg-rose-600' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setNoteColor(c.id as any)}
                        className={`w-5 h-5 rounded-full ${c.bg} cursor-pointer transition-transform ${
                          noteColor === c.id ? 'ring-2 ring-offset-2 ring-emerald-500 scale-110' : 'opacity-70'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notePinned}
                    onChange={(e) => setNotePinned(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{language === 'id' ? 'Sematkan di Atas (Pin to top)' : 'Pin to top'}</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNoteModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    {language === 'id' ? 'Batal' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 shadow-xs cursor-pointer"
                  >
                    {language === 'id' ? 'Simpan Catatan' : 'Save Note'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD TASK */}
      {/* ========================================================= */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>{language === 'id' ? 'Tambah Tugas Baru' : 'Add New Task'}</span>
              </h3>
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="p-5 space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {language === 'id' ? 'Judul Tugas / PR' : 'Task Title'} *
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder={language === 'id' ? 'Contoh: Makalah Kecerdasan Buatan Bab 1' : 'e.g. AI Term Paper Chapter 1'}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {language === 'id' ? 'Mata Kuliah / Proyek' : 'Subject / Project'}
                  </label>
                  <input
                    type="text"
                    value={taskSubject}
                    onChange={(e) => setTaskSubject(e.target.value)}
                    placeholder={language === 'id' ? 'Kalkulus / Klien X' : 'Calculus / Client'}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {language === 'id' ? 'Prioritas' : 'Priority'}
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="high">{language === 'id' ? '🔴 Tinggi (Urgen)' : 'High (Urgent)'}</option>
                    <option value="medium">{language === 'id' ? '🟡 Sedang' : 'Medium'}</option>
                    <option value="low">{language === 'id' ? '🟢 Rendah' : 'Low'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {language === 'id' ? 'Batas Waktu (Deadline)' : 'Due Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {language === 'id' ? 'Jam Deadline' : 'Due Time'}
                  </label>
                  <input
                    type="time"
                    value={taskDueTime}
                    onChange={(e) => setTaskDueTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {language === 'id' ? 'Deskripsi / Petunjuk Pengerjaan' : 'Instructions / Notes'}
                </label>
                <textarea
                  rows={2}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder={language === 'id' ? 'Format PDF, unggah ke Google Classroom atau portal dosen...' : 'PDF format, upload to portal...'}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  {language === 'id' ? 'Batal' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 shadow-xs cursor-pointer"
                >
                  {language === 'id' ? 'Simpan Tugas' : 'Save Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

interface NoteCardProps {
  note: NoteItem;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  onCopy: () => void;
  getColorClass: (c?: string) => string;
  language: string;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onTogglePin,
  onCopy,
  getColorClass,
  language
}) => {
  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-150 flex flex-col justify-between space-y-3 shadow-2xs hover:shadow-sm ${getColorClass(note.color)}`}
    >
      <div className="space-y-2">
        {/* Card Header: Subject & Pin */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 border border-black/5 dark:border-white/5">
              {note.category === 'academic' && '🎓 Kuliah'}
              {note.category === 'project' && '💼 Proyek'}
              {note.category === 'finance' && '💰 Keuangan'}
              {note.category === 'personal' && '💡 Ide'}
            </span>
            {note.subject && (
              <span className="text-[11px] font-semibold text-emerald-900 dark:text-emerald-300 truncate max-w-[140px]">
                {note.subject}
              </span>
            )}
          </div>

          <button
            onClick={onTogglePin}
            className={`p-1 rounded-md transition-colors cursor-pointer ${
              note.pinned ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950' : 'text-gray-400 hover:text-gray-600'
            }`}
            title={note.pinned ? 'Lepas Sematan' : 'Sematkan ke Atas'}
          >
            {note.pinned ? <Pin className="w-3.5 h-3.5 fill-current" /> : <PinOff className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Title */}
        <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2">
          {note.title}
        </h4>

        {/* Content snippet */}
        <p className="text-xs text-gray-600 dark:text-gray-300 whitespace-pre-line line-clamp-4 leading-relaxed font-sans">
          {note.content}
        </p>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {note.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded bg-white/60 dark:bg-gray-800/60 text-[10px] text-gray-600 dark:text-gray-300 border border-black/5 dark:border-white/5"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Date & Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5 text-[10px] text-gray-400">
        <span>
          {new Date(note.updatedAt || note.createdAt).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
            month: 'short',
            day: 'numeric'
          })}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={onCopy}
            className="p-1 hover:text-emerald-700 dark:hover:text-emerald-400 rounded transition-colors cursor-pointer"
            title="Salin Teks"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onEdit}
            className="p-1 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors cursor-pointer"
            title="Edit"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors cursor-pointer"
            title="Hapus"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
