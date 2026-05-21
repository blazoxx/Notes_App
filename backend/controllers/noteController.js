const Note = require('../models/Note');

exports.list = async (req, res) => {
  try {
    const { q } = req.query;
    const filter = { user: req.user._id };
    if (q && q.trim()) {
      const rx = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ title: rx }, { content: rx }, { tags: rx }];
    }
    const notes = await Note.find(filter).sort({ pinned: -1, updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, content = '', tags = [], color = '#ffffff', pinned = false } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ message: 'Title is required' });
    const note = await Note.create({
      user: req.user._id,
      title: title.trim(),
      content,
      tags: Array.isArray(tags) ? tags : String(tags).split(',').map((t) => t.trim()).filter(Boolean),
      color,
      pinned: !!pinned,
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    const fields = ['title', 'content', 'tags', 'color', 'pinned'];
    for (const f of fields) if (req.body[f] !== undefined) note[f] = req.body[f];
    if (typeof note.tags === 'string')
      note.tags = note.tags.split(',').map((t) => t.trim()).filter(Boolean);
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.togglePin = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    note.pinned = !note.pinned;
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
