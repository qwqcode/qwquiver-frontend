import express, { Router } from 'express'
import Actions from './Actions'

const router: Router = Router()
const actions = new Actions()

router.get('/', actions.index)
router.get('/conf', actions.conf)
router.get('/query', actions.query)

export default router