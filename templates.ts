import { DecisionTemplate } from '../types';

export const DECISION_TEMPLATES: DecisionTemplate[] = [
  {
    id: 'carrera-trabajo',
    category: 'Carrera y Trabajo',
    title: 'Aceptar nueva oferta de trabajo vs Mantener empleo actual',
    context: 'Recibí una propuesta en una startup en crecimiento con un 20% más de sueldo pero mayor incertidumbre y horario híbrido, mientras que mi empleo actual es estable, remoto y cómodo.',
    options: ['Nueva Oferta en Startup', 'Mantener Empleo Actual'],
    userPriorities: ['Ingresos Financieros', 'Estabilidad Laboral', 'Flexibilidad y Horario', 'Crecimiento Profesional'],
    iconName: 'Briefcase'
  },
  {
    id: 'vivienda-mudanza',
    category: 'Estilo de Vida y Vivienda',
    title: 'Comprar departamento propio o Alquilar y congelar capital en inversión',
    context: 'Tengo ahorrado el pie para un departamento de 2 habitaciones. No sé si comprometerme con un crédito hipotecario a 25 años o alquilar y poner los ahorros en fondos indexados.',
    options: ['Comprar Departamento con Hipoteca', 'Alquilar e Invertir el Capital'],
    userPriorities: ['Seguridad Patrimonial', 'Libertad Financiera', 'Tranquilidad Mental', 'Movilidad Geográfica'],
    iconName: 'Home'
  },
  {
    id: 'negocio-emprendimiento',
    category: 'Negocios y Emprendimiento',
    title: 'Lanzar mi propio proyecto a tiempo completo vs Emprender a tiempo parcial',
    context: 'Tengo una idea de negocio validada con clientes iniciales. Dudas entre renunciar para dedicarme 100% o seguir trabajando de día y construir de noche.',
    options: ['Renunciar y Dedicación 100%', 'Emprendimiento a Tiempo Parcial (Side-Hustle)'],
    userPriorities: ['Velocidad de Crecimiento', 'Mitigación de Riesgo', 'Salud Financiera', 'Nivel de Estrés'],
    iconName: 'Rocket'
  },
  {
    id: 'estudios-postgrado',
    category: 'Educación y Desarrollo',
    title: 'Estudiar una Maestría Presencial vs Certificaciones Rápidas On-demand',
    context: 'Quiero actualizar mis habilidades de gestión. Evalúo invertir $15,000 en un Máster de 1 año o realizar bootcamps y certificaciones de $2,000 mientras trabajo.',
    options: ['Maestría Presencial Completa', 'Bootcamps y Certificaciones Online'],
    userPriorities: ['Networking y Contactos', 'Retorno de Inversión (ROI)', 'Tiempo Requerido', 'Reconocimiento en el Mercado'],
    iconName: 'GraduationCap'
  },
  {
    id: 'compra-vehiculo',
    category: 'Finanzas Personales',
    title: 'Comprar auto usado al contado o Auto nuevo financiado',
    context: 'Necesito un vehículo para desplazarme diariamente. Un auto usado de 4 años me cuesta $10k al contado sin deudas; uno nuevo $22k con cuotas mensuales.',
    options: ['Auto Usado al Contado', 'Auto Nuevo Financiado'],
    userPriorities: ['Cero Deudas', 'Costo de Mantenimiento y Garantía', 'Seguridad y Tecnología', 'Depreciación'],
    iconName: 'Car'
  }
];
