import express from 'express';
const router = express.Router();
import {isLogado} from "../helpers/permissao.js";

router.get('/', isLogado, function (req, res) {
    res.render('admin/index');
})

export default router;