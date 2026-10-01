import { buildInicio } from "./inicio.js";
import { buildPensamento } from "./pensamento.js";
import { buildEscrita } from "./escrita.js";
import { buildProjectos } from "./projectos.js";
import { buildPercurso } from "./percurso.js";
import { buildContacto } from "./contacto.js";

export const BUILDERS = [buildInicio, buildPensamento, buildEscrita, buildProjectos, buildPercurso, buildContacto];
