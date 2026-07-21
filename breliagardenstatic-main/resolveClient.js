/**
 * Middleware de Resolução de Cliente - Multi-tenant [rotas públicas]
 * Descobre qual cliente (florista, dentista, etc.) é dono do site sendo
 * acessado e injeta os dados dele em req.client / res.locals.client.
 *
 * Depende da tabela `clients`:
 *   id, slug, dominio, nome, template, whatsapp, logo_url, cor_primaria, is_active
 *
 * Estratégia MVP: resolve por subdomínio (ex: florista.suaplataforma.com.br,
 * dentista.suaplataforma.com.br). Quando um cliente tiver domínio próprio
 * apontando pro seu VPS (ex: sorrisovivo.com.br), ele cai no fallback por
 * `dominio` — não precisa mudar nada no código, só cadastrar o domínio na tabela.
 */
const { pool } = require('../config/database');

async function resolveClient(req, res, next) {
  try {
    const host = req.hostname; // ex: florista.suaplataforma.com.br ou sorrisovivo.com.br
    const subdomain = host.split('.')[0];

    const [rows] = await pool.query(
      `SELECT id, nome, slug, template, whatsapp, logo_url, cor_primaria, dominio
       FROM clients
       WHERE (slug = ? OR dominio = ?) AND is_active = 1
       LIMIT 1`,
      [subdomain, host]
    );

    if (!rows.length) {
      return res.status(404).render('pages/404', { title: 'Site não encontrado', settings: {} });
    }

    req.client = rows[0];
    res.locals.client = rows[0]; // já fica disponível direto nas views EJS, sem passar manual em cada render()
    next();
  } catch (err) {
    console.error('❌ Erro ao resolver cliente:', err);
    res.status(500).render('pages/500', { title: 'Erro', settings: {} });
  }
}

module.exports = { resolveClient };
