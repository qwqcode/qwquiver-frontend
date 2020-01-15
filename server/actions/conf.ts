import Database from '../Database'
import Table, { CONF_FIELD } from '../Table'
import Utils from '../Utils'
import FT from '../../common/interfaces/field'
import express, { Router, Request, Response } from 'express'
import _ from 'lodash'

export default function conf (req: Request, res: Response) {
  const tableList = Utils.getAllTableConfObj()
  const fieldTransDict = FT
  const tableGrpList = _.uniq(_.flatMap(tableList, (o: Table) => o.grp))

  Utils.success(res, '', {
    tableList,
    tableGrpList,
    fieldTransDict
  })
}
