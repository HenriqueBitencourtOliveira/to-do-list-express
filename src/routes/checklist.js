const express = require('express')

const router = express.Router()

const Checklist = require('../models/checklist');

router.get('/', async (req, res) => {
    try {
        let checklists = await Checklist.find({})
        res.status(200).render('checklists/index', { checklists: checklists })
    } catch (error) {
        res.status(422).render('pages/error', { error: 'Error ao exibir' })
    }
})


router.get('/new', async (req, res) => {
    try {
        let checklist = new Checklist()
        res.status(200).render('checklists/new', { checklist: checklist })
    } catch (error) {
        res.status(500).render('pages/error', { errors: 'Error ao carregar' })
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        let checklist = await Checklist.findById(req.params.id)
        res.status(200).render('checklists/edit', { checklist: checklist })
    } catch (error) {
        res.status(500).render('pages/error', { error: 'Error ao editar' })
    }
})

router.post('/', async (req, res) => {
    let { name } = req.body.checklist
    let checklist = new Checklist({ name })
    try {
        await checklist.save()
        res.redirect('/checklists')
    } catch (error) {
        res.status(422).render('checklists/new', { checklist: { ...checklist, error } })
    }
})


router.get('/:id', async (req, res) => {
    try {
        let checklist = await Checklist.findById(req.params.id).populate('tasks')
        res.status(200).render('checklists/show', { checklist: checklist })
    } catch (error) {
        res.status(500).render('pages/error', { error: 'Error ao criar' })
    }
})

router.put('/:id', async (req, res) => {
    try {
        let { name } = req.body.checklist;
        let checklist = await Checklist.findByIdAndUpdate(req.params.id, { name }, { new: true });
        res.redirect('/checklists');
    } catch (error) {
        let errors = error.errors;
        res.status(422).render('checklists/edit', { checklist: { ...checklist, errors } });
    }
});


router.delete('/:id', async (req, res) => {

    try {
        await Checklist.deleteOne({ _id: req.params.id });
        res.redirect('/checklists')
    } catch (error) {
        res.status(500).render('pages/error', { error: 'Error ao deletar' })
    }
})

module.exports = router