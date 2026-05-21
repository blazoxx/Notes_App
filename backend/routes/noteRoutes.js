const router = require('express').Router();
const protect = require('../middleware/auth');
const { list, create, update, remove, togglePin } = require('../controllers/noteController');

router.use(protect);
router.get('/', list);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
router.patch('/:id/pin', togglePin);

module.exports = router;
