import type { ApuntesTopic } from './types';

export const SECURITY_TOPIC: ApuntesTopic = {
  id: 'topic-sec-basics',
  name: 'Conceptos de seguridad',
  type: 'CONCEPT',
  sortOrder: 65,
  concepts: [
    {
      key: 'cia-triad',
      id: 'ki-sec-cia-triad',
      name: 'Tríada CIA',
      definition:
        'Los tres objetivos de la seguridad: confidencialidad, integridad y disponibilidad.',
      confusedWith: ['pdar', 'confidentiality'],
    },
    {
      key: 'confidentiality',
      id: 'ki-sec-confidentiality',
      name: 'Confidencialidad',
      definition:
        'Que solo las personas autorizadas puedan ver la información, como el dueño de una caja fuerte.',
      confusedWith: ['integrity', 'availability'],
    },
    {
      key: 'integrity',
      id: 'ki-sec-integrity',
      name: 'Integridad',
      definition:
        'Que los datos no sean modificados, dañados ni borrados sin autorización.',
      confusedWith: ['confidentiality', 'availability'],
    },
    {
      key: 'availability',
      id: 'ki-sec-availability',
      name: 'Disponibilidad',
      definition:
        'Tener acceso ininterrumpido a los sistemas y datos cuando se necesitan.',
      confusedWith: ['integrity', 'confidentiality'],
    },
    {
      key: 'malware',
      id: 'ki-sec-malware',
      name: 'Malware',
      definition:
        'Programa que busca infiltrarse en un sistema o dañarlo sin consentimiento.',
      confusedWith: ['brute-force', 'mitm'],
    },
    {
      key: 'brute-force',
      name: 'Fuerza bruta',
      definition:
        'Ataque que intenta adivinar una contraseña probando de forma automatizada todas las combinaciones posibles.',
      confusedWith: ['ddos', 'mitm'],
    },
    {
      key: 'ddos',
      id: 'ki-sec-ddos',
      name: 'DDoS',
      long: 'Distributed Denial of Service',
      definition:
        'Ataque desde muchos equipos que satura los recursos de un servidor (procesador, memoria) para dejarlo fuera de servicio.',
      confusedWith: ['brute-force', 'mitm'],
      note: 'En AWS lo mitiga Shield.',
    },
    {
      key: 'mitm',
      name: 'MITM',
      long: 'Man-in-the-Middle',
      definition:
        'Ataque en el que alguien se coloca entre dos partes e intercepta su comunicación.',
      confusedWith: ['ddos', 'brute-force'],
    },
    {
      key: 'physical-control',
      name: 'Control físico',
      definition:
        'Barrera tangible que protege la infraestructura, como cerraduras o guardias.',
      confusedWith: ['administrative-control', 'technical-control'],
    },
    {
      key: 'administrative-control',
      name: 'Control administrativo',
      definition: 'Políticas, normas y procedimientos de seguridad.',
      confusedWith: ['technical-control', 'physical-control'],
    },
    {
      key: 'technical-control',
      name: 'Control técnico',
      definition:
        'Mecanismo tecnológico de protección, como un firewall o un algoritmo de cifrado.',
      confusedWith: ['physical-control', 'administrative-control'],
    },
    {
      key: 'preventive-control',
      name: 'Control preventivo',
      definition: 'Control que evita que ocurra un incidente de seguridad.',
      confusedWith: [
        'detective-control',
        'corrective-control',
        'compensating-control',
      ],
    },
    {
      key: 'detective-control',
      name: 'Control detectivo',
      definition:
        'Control que identifica cuándo ocurrió un incidente: qué, cuándo, dónde y por qué.',
      confusedWith: [
        'preventive-control',
        'corrective-control',
        'compensating-control',
      ],
    },
    {
      key: 'corrective-control',
      name: 'Control correctivo',
      definition: 'Control que repara el daño después de un incidente.',
      confusedWith: [
        'compensating-control',
        'detective-control',
        'preventive-control',
      ],
    },
    {
      key: 'compensating-control',
      name: 'Control compensatorio',
      definition:
        'Control alternativo cuando el principal no es posible; implica aceptar cierto nivel de riesgo.',
      confusedWith: [
        'corrective-control',
        'preventive-control',
        'detective-control',
      ],
    },
    {
      key: 'pdar',
      name: 'Ciclo PDAR',
      definition:
        'Ciclo de vida de la seguridad: prevención, detección, análisis y respuesta, porque la seguridad no es estática.',
      confusedWith: ['cia-triad', 'sdlc'],
    },
    {
      key: 'virus',
      name: 'Virus',
      definition:
        'Malware que se replica en otros equipos y necesita que una persona lo ejecute.',
      confusedWith: ['worm', 'trojan'],
    },
    {
      key: 'worm',
      name: 'Gusano',
      definition:
        'Malware que se propaga solo, explotando vulnerabilidades, hasta saturar el sistema.',
      confusedWith: ['virus', 'trojan'],
    },
    {
      key: 'trojan',
      name: 'Troyano',
      definition: 'Malware disfrazado de programa legítimo.',
      confusedWith: ['virus', 'rootkit'],
    },
    {
      key: 'ransomware',
      name: 'Ransomware',
      definition: 'Malware que cifra la información para pedir un rescate.',
      confusedWith: ['spyware', 'trojan'],
    },
    {
      key: 'spyware',
      name: 'Spyware',
      definition:
        'Malware que espía al usuario y recopila su información sin que lo sepa.',
      confusedWith: ['ransomware', 'rootkit'],
    },
    {
      key: 'rootkit',
      name: 'Rootkit',
      definition:
        'Malware que se instala a nivel del kernel para ocultar procesos y mantener el control.',
      confusedWith: ['trojan', 'spyware'],
    },
    {
      key: 'aup',
      name: 'AUP',
      long: 'Acceptable Use Policy',
      definition:
        'Política que explica de manera formal y legal las reglas y restricciones de uso de los sistemas.',
      confusedWith: ['baseline', 'administrative-control'],
      note: 'En español, política de uso aceptable; ataca los fallos de la psicología humana.',
    },
    {
      key: 'sdlc',
      name: 'SDLC seguro',
      definition:
        'Integrar la seguridad en cada fase del desarrollo de software: requisitos y diseño, desarrollo, pruebas, y despliegue y mantenimiento.',
      confusedWith: ['pdar', 'hardening'],
      note: 'SDLC significa Software Development Life Cycle.',
    },
    {
      key: 'sqli',
      name: 'Inyección SQL',
      definition:
        'Ataque que mete código en los campos de texto de una aplicación para que la base de datos lo ejecute.',
      confusedWith: ['xss', 'directory-traversal'],
      note: 'En AWS, WAF ayuda a bloquearla.',
    },
    {
      key: 'xss',
      name: 'XSS',
      long: 'Cross-Site Scripting',
      definition:
        'Ataque que inyecta scripts que se ejecutan en el navegador de otros usuarios cuando la página muestra sus datos.',
      confusedWith: ['sqli', 'buffer-overflow'],
    },
    {
      key: 'buffer-overflow',
      name: 'Desbordamiento de búfer',
      definition:
        'Ataque que escribe más datos de los que caben en un espacio de memoria.',
      confusedWith: ['sqli', 'directory-traversal'],
    },
    {
      key: 'directory-traversal',
      name: 'Salto de directorios',
      definition:
        'Ataque que cambia la ruta de la URL para acceder a archivos fuera de lo permitido.',
      confusedWith: ['xss', 'sqli'],
    },
    {
      key: 'ids',
      name: 'IDS',
      long: 'Intrusion Detection System',
      definition: 'Sistema que detecta ataques y genera alarmas.',
      confusedWith: ['nids', 'hids'],
    },
    {
      key: 'nids',
      name: 'NIDS',
      definition:
        'Sistema de detección de intrusos de red: analiza el tráfico de la red.',
      confusedWith: ['hids', 'ids'],
    },
    {
      key: 'hids',
      name: 'HIDS',
      definition:
        'Sistema de detección de intrusos de host: supervisa un equipo, por ejemplo los cambios en sus archivos.',
      confusedWith: ['nids', 'ids'],
    },
    {
      key: 'authentication',
      id: 'ki-sec-authentication',
      name: 'Autenticación',
      definition: 'Comprobar quién es alguien: ¿quién eres?',
      confusedWith: ['authorization', 'mfa'],
    },
    {
      key: 'authorization',
      id: 'ki-sec-authorization',
      name: 'Autorización',
      definition: 'Determinar qué permisos tiene alguien: ¿qué puedes hacer?',
      confusedWith: ['authentication', 'least-privilege'],
    },
    {
      key: 'mfa',
      id: 'ki-sec-mfa',
      name: 'MFA',
      long: 'Multi-Factor Authentication',
      definition:
        'Capa extra en el inicio de sesión que combina factores: algo que sabes (PIN), algo que tienes (app autenticadora) o algo que eres (huella).',
      confusedWith: ['authentication', 'least-privilege'],
      note: 'El nombre va en inglés. Es la primera protección del root user.',
    },
    {
      key: 'least-privilege',
      id: 'ki-sec-least-privilege',
      name: 'Least privilege',
      definition:
        'Dar solo los permisos indispensables para una tarea, durante un tiempo definido.',
      note: 'El nombre va en inglés.',
      confusedWith: ['rbac', 'authorization'],
    },
    {
      key: 'rbac',
      name: 'RBAC',
      long: 'Role-Based Access Control',
      definition:
        'Control de acceso en el que los permisos se asignan a roles.',
      confusedWith: ['dac', 'least-privilege'],
    },
    {
      key: 'dac',
      name: 'DAC',
      long: 'Discretionary Access Control',
      definition:
        'Control de acceso en el que el dueño del recurso decide quién entra.',
      confusedWith: ['rbac', 'least-privilege'],
    },
    {
      key: 'hardening',
      name: 'Hardening',
      definition:
        'Reducir la superficie de ataque de un sistema quitando lo innecesario y cerrando accesos.',
      confusedWith: ['baseline', 'patching'],
      note: 'Ejemplo: en un servidor web solo se abren los puertos de HTTP y HTTPS.',
    },
    {
      key: 'baseline',
      name: 'Línea base',
      definition:
        'Configuración mínima y estándar de seguridad que deben cumplir los sistemas.',
      confusedWith: ['hardening', 'aup'],
    },
    {
      key: 'patching',
      name: 'Ciclo de vida de parches',
      definition:
        'Proceso para probar y aplicar de forma ordenada las actualizaciones de seguridad.',
      confusedWith: ['hardening', 'baseline'],
    },
    {
      key: 'dmz',
      name: 'DMZ',
      long: 'Zona desmilitarizada',
      definition:
        'Segmento de red que expone servicios públicos de forma controlada, separado de la red interna.',
      confusedWith: ['private-subnet', 'hardening'],
    },
    {
      key: 'data-at-rest',
      name: 'Datos en reposo',
      definition:
        'Datos guardados en disco; se protegen con cifrado simétrico.',
      confusedWith: ['data-in-transit', 'data-in-use'],
    },
    {
      key: 'data-in-transit',
      name: 'Datos en tránsito',
      definition: 'Datos que viajan por la red; se protegen con TLS/SSL.',
      confusedWith: ['data-at-rest', 'data-in-use'],
    },
    {
      key: 'data-in-use',
      name: 'Datos en uso',
      definition: 'Datos que se están procesando en la memoria RAM.',
      confusedWith: ['data-at-rest', 'data-in-transit'],
    },
    {
      key: 'symmetric',
      id: 'ki-sec-symmetric-encryption',
      name: 'Cifrado simétrico',
      definition:
        'Cifrado con una misma clave compartida para cifrar y descifrar; es rápido, pero hay que enviar la clave de forma segura (AES).',
      confusedWith: ['asymmetric', 'hybrid-encryption'],
    },
    {
      key: 'asymmetric',
      id: 'ki-sec-asymmetric-encryption',
      name: 'Cifrado asimétrico',
      definition:
        'Cifrado con una clave pública, que se comparte, para cifrar y una clave privada, que no se comparte, para descifrar (RSA, ECC).',
      confusedWith: ['symmetric', 'hybrid-encryption'],
    },
    {
      key: 'hybrid-encryption',
      name: 'Cifrado híbrido',
      definition:
        'Combinación en la que el cifrado asimétrico intercambia la clave y el simétrico cifra los datos, como hace TLS.',
      confusedWith: ['symmetric', 'asymmetric'],
    },
    {
      key: 'pki',
      name: 'PKI',
      long: 'Public Key Infrastructure',
      definition:
        'Sistema de certificados digitales y entidades que vinculan cada clave pública con su dueño.',
      confusedWith: ['ca', 'x509'],
    },
    {
      key: 'ca',
      name: 'CA',
      long: 'Certificate Authority',
      definition:
        'Tercero de confianza que emite y firma los certificados digitales.',
      confusedWith: ['ra', 'csr'],
      note: 'En español, entidad de certificación.',
    },
    {
      key: 'ra',
      name: 'RA',
      long: 'Registration Authority',
      definition:
        'Entidad que verifica la identidad real de quien pide un certificado antes de que se emita.',
      confusedWith: ['ca', 'csr'],
      note: 'En español, autoridad de registro.',
    },
    {
      key: 'x509',
      name: 'X.509',
      definition:
        'Estándar de certificado digital que vincula una clave pública con su dueño.',
      confusedWith: ['pki', 'csr'],
    },
    {
      key: 'crl',
      name: 'CRL',
      long: 'Certificate Revocation List',
      definition: 'Lista de certificados anulados antes de su vencimiento.',
      confusedWith: ['ocsp', 'csr'],
    },
    {
      key: 'ocsp',
      name: 'OCSP',
      long: 'Online Certificate Status Protocol',
      definition:
        'Protocolo para consultar en línea si un certificado sigue siendo válido.',
      confusedWith: ['crl', 'csr'],
    },
    {
      key: 'csr',
      name: 'CSR',
      long: 'Certificate Signing Request',
      definition:
        'Solicitud con tu clave pública que envías para obtener un certificado firmado.',
      confusedWith: ['crl', 'x509'],
    },
    {
      key: 'bcp',
      name: 'BCP',
      long: 'Business Continuity Plan',
      definition:
        'Plan para mantener el negocio funcionando durante y después de un desastre.',
      confusedWith: ['drp', 'rto'],
    },
    {
      key: 'drp',
      name: 'DRP',
      long: 'Disaster Recovery Plan',
      definition: 'Plan para recuperar lo que se dañó después de un desastre.',
      confusedWith: ['bcp', 'rpo'],
    },
    {
      key: 'rpo',
      name: 'RPO',
      long: 'Recovery Point Objective',
      definition:
        'Cantidad máxima de datos que se puede perder, medida desde la última copia de seguridad.',
      confusedWith: ['rto', 'mtd'],
    },
    {
      key: 'rto',
      name: 'RTO',
      long: 'Recovery Time Objective',
      definition:
        'Tiempo máximo de inactividad aceptable hasta restablecer el servicio.',
      confusedWith: ['rpo', 'mtd'],
    },
    {
      key: 'mtd',
      name: 'MTD',
      long: 'Maximum Tolerable Downtime',
      definition:
        'Tiempo máximo que el negocio puede sobrevivir sin funcionar.',
      confusedWith: ['rto', 'wrt'],
    },
    {
      key: 'wrt',
      name: 'WRT',
      long: 'Work Recovery Time',
      definition:
        'Tiempo para verificar que todo funciona después de recuperar los sistemas.',
      confusedWith: ['rto', 'mtd'],
    },
    {
      key: 'full-backup',
      name: 'Copia completa',
      definition: 'Respaldo de todos los datos.',
      confusedWith: ['incremental-backup', 'differential-backup'],
      note: 'En inglés, full backup.',
    },
    {
      key: 'incremental-backup',
      name: 'Copia incremental',
      definition:
        'Respaldo que guarda solo los cambios desde la última copia de cualquier tipo.',
      confusedWith: ['differential-backup', 'full-backup'],
    },
    {
      key: 'differential-backup',
      name: 'Copia diferencial',
      definition:
        'Respaldo que guarda los cambios acumulados desde la última copia completa.',
      confusedWith: ['incremental-backup', 'full-backup'],
    },
    {
      key: 'backup-restore',
      name: 'Backup and Restore',
      definition:
        'Estrategia de recuperación que solo restaura datos desde copias: costo muy bajo, pero RPO y RTO de días.',
      confusedWith: ['pilot-light', 'warm-standby', 'multi-site'],
    },
    {
      key: 'pilot-light',
      name: 'Luz piloto',
      definition:
        'Estrategia de recuperación con una réplica de lo esencial apagada hasta el desastre: costo bajo, RPO y RTO de horas.',
      confusedWith: ['warm-standby', 'backup-restore', 'multi-site'],
      note: 'En inglés, pilot light.',
    },
    {
      key: 'warm-standby',
      name: 'Warm Standby',
      definition:
        'Estrategia de recuperación con una copia reducida siempre encendida y datos replicados de forma continua: costo medio, RPO y RTO de minutos.',
      confusedWith: ['pilot-light', 'multi-site', 'backup-restore'],
    },
    {
      key: 'multi-site',
      name: 'Multi-site activo',
      definition:
        'Estrategia de recuperación con una copia completa de la infraestructura funcionando a la vez: costo alto, RPO y RTO de milisegundos.',
      confusedWith: ['warm-standby', 'pilot-light', 'backup-restore'],
    },
    {
      key: 'nist-csf',
      name: 'NIST CSF',
      long: 'Cybersecurity Framework',
      definition:
        'Marco para gestionar y reducir los riesgos de ciberseguridad.',
      confusedWith: ['soc', 'aup'],
    },
    {
      key: 'soc',
      name: 'SOC',
      long: 'System and Organization Controls',
      definition:
        'Informes de auditoría sobre los controles internos de seguridad, disponibilidad y confidencialidad de una organización.',
      confusedWith: ['nist-csf', 'pci-dss'],
      note: 'Hay tres tipos (1, 2 y 3) y se descargan desde AWS Artifact.',
    },
  ],
};
