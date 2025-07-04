import Aluno from '../models/Aluno.js'
import Ingresso from "../models/Ingresso.js";
import Membro from "../models/Membro.js";
import Usuario from "../models/Usuario.js"

await Aluno.sync()
await Ingresso.sync()
await Membro.sync()
await Usuario.sync()