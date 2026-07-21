/**
 * Middleware de Autenticação - [RF001]
 * Protege rotas administrativas + garante escopo por cliente (multi-tenant)
 */

/**
 * Verifica se o usuário está autenticado como admin
 */
function requireAuth(req, res, next) {
  if (req.session && req.session.admin) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  req.flash('error', 'Acesso negado. Faça login primeiro.');
  return res.redirect('/admin/login');
}

/**
 * Redireciona para dashboard se já estiver logado
 */
function redirectIfAuth(req, res, next) {
  if (req.session && req.session.admin) {
    return res.redirect('/admin/dashboard');
  }
  return next();
}

/**
 * NOVO: Trava o client_id do admin logado em req.client_id.
 * Toda query do painel (products, categories, settings, faqs...) deve
 * usar req.client_id no WHERE — nunca confiar em client_id vindo do body/query,
 * senão um admin poderia editar dados de outro cliente trocando um parâmetro.
 *
 * IMPORTANTE: no controller de login, ao validar email/senha, o SELECT em
 * `admins` já deve trazer o client_id junto, e o login salva assim:
 *   req.session.admin = { id: admin.id, nome: admin.name, client_id: admin.client_id };
 */
function attachAdminClient(req, res, next) {
  if (!req.session.admin || !req.session.admin.client_id) {
    req.flash('error', 'Sessão inválida. Faça login novamente.');
    return req.session.destroy(() => res.redirect('/admin/login'));
  }
  req.client_id = req.session.admin.client_id;
  next();
}

module.exports = { requireAuth, redirectIfAuth, attachAdminClient };
