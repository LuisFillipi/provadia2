import { Router } from "express";
import { createEvent, getAgenda, createParticipante, inscreverParticipante } from "../controller/eventosController.js";
import router from "./routerParticipante";

import verificarToken from '../helpers/get-token.js';

const router = router();

router.post ("/eventos/criar", createEvent)
router.get("/eventos/agenda", getAgenda)
router.post("/eventos/inscrever", inscreverParticipante)
router.post("/eventos/participantes/registrar", createParticipante)

export default router;
// base do desapega!