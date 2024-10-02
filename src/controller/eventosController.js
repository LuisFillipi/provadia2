import conn from "../config/conn.js";
import { v4 as uuid } from "uuid";
import { request, response } from "express";

// base do desapega!

export const createEvent = async (request, response) => {
    const { titulo, data,} = request.body

    const token = getToken (request);
    const user = await getUserByToken(token)

    if (!titulo){
        return response.status(400).json({message: "O titulo do evento é obrigatorio!"})
    }
    if(!data){
        return response.status(400).json({message: " A data do evento é obrigatoria!"})
    }
    
    const evento_id = uuidv4()

    const insertEventoSql = /*sql*/ `insert into eventos (evento_id, titulo, data, usuarios_id) VALUES (?, ?, ?, ?)`;
    const eventoData = [evento_id, titulo, data, user.usuario_id];

    conn.query(insertEventoSql, eventoData, (err) => {
        if (err) {
            console.error(err)
            return response.status(500).json({ err: "erro ao criar o evento"})
        }
        const insertPalestranteSql = /*sql*/ `insert into evento_palestrante(evento_palestrante_id, evento_id, palestrante_id) VALUES ?`;

        conn.query(insertPalestranteSql, [palestranteValues], (err) => {
            if (err){
                console.error(err)
                return response.status(500).json({err: " erro ao associar palestrante pro evento"});
            }
            return response.status(201).json({message: "evento criado!"})
        })
    })
}
export const getAgenda = (request, response) => {
const selectSql = /*sql*/` SELECT e.evento_id, e.titulo, e.data, GROUP_CONCAT(p.nome SEPARATOR ', ') AS palestrantes from eventos e 
LEFT JOIN evento_palestrante AS on e.evento_id = ep.evento_id
LEFT JOIN palestrante p on ep.palestrante_id = p.palestrante_id GROUP BY e.evento_id, e.titulo, e.data `

conn.query(selectSql, (err, data) => {
    if (err) {
        console.error(err)
        return response.status(500).json({err: " erro ao listar eventos"})
    }
    return response.status(200).json(data)
})

}
export const createParticipante = async (request, response) => {
    const { nome, email } = request.body;

    if (!nome) {
        return response.status(400).json({ message: "O nome do participante é obrigatório" })
    }
    if (!email) {
        return response.status(400).json({ message: "O e-mail do participante é obrigatório" })
    }

    const participante_id = uuidv4()

    const insertParticipanteSql = /*sql*/ `INSERT INTO participantes(participante_id, nome, email) VALUES(?, ?, ?)`;
    const participanteData = [participante_id, nome, email]

    conn.query(insertParticipanteSql, participanteData, (err) => {
        if (err) {
            console.error(err)
            return response.status(500).json({ err: "Erro ao cadastrar participante" })
        }
        return response.status(201).json({ message: "Participante cadastrado com sucesso" })
    })
}

export const inscreverParticipante = (request, response) => {
    const { participantesId, eventoId } = request.body;

    if (!participantesId || !eventoId) {
        return response.status(400).json({ message: "Participante e evento são obrigatórios" });
    }

    const insertInscricaoSql = /*sql*/ `INSERT INTO evento_participante(evento_participante_id, evento_id, participante_id) VALUES(?, ?, ?)`;
    const inscricaoData = [uuidv4(), eventoId, participantesId];

    conn.query(insertInscricaoSql, inscricaoData, (err) => {
        if (err) {
            console.error(err);
            return response.status(500).json({ err: "Erro ao inscrever participante no evento" });
        }
        return response.status(201).json({ message: "Participante inscrito com sucesso" });
    });
};