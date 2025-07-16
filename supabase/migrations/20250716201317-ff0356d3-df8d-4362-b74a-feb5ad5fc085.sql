-- Inserir dados de exemplo para utilizadores/profiles
INSERT INTO public.profiles (user_id, name, email, role, team) VALUES
('11111111-1111-1111-1111-111111111111', 'João Silva', 'joao.silva@empresa.com', 'developer', 'technical'),
('22222222-2222-2222-2222-222222222222', 'Maria Santos', 'maria.santos@empresa.com', 'manager', 'support'),
('33333333-3333-3333-3333-333333333333', 'Pedro Costa', 'pedro.costa@empresa.com', 'user', 'sales'),
('44444444-4444-4444-4444-444444444444', 'Ana Ferreira', 'ana.ferreira@empresa.com', 'developer', 'technical'),
('55555555-5555-5555-5555-555555555555', 'Carlos Oliveira', 'carlos.oliveira@empresa.com', 'manager', 'management')
ON CONFLICT (user_id) DO NOTHING;

-- Inserir dados de exemplo para tickets
INSERT INTO public.tickets (title, description, status, priority, type, team, reporter_id, assignee_id) VALUES
('Problema na integração WhatsApp', 'Sistema não está a receber mensagens do WhatsApp corretamente', 'open', 'high', 'integration', 'technical', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'),
('Erro no sistema de webhooks', 'Webhooks não estão a ser disparados para eventos de mensagens', 'in_progress', 'medium', 'bug', 'technical', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444'),
('Configuração Twilio', 'Necessário configurar novo número Twilio para testes', 'proposed_solution', 'low', 'configuration', 'technical', '33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333'),
('Suporte a cliente VIP', 'Cliente premium reporta lentidão no sistema', 'open', 'high', 'support', 'support', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222'),
('Nova funcionalidade relatórios', 'Implementar dashboard de analytics para managers', 'open', 'medium', 'feature_request', 'technical', '55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111');

-- Inserir dados de exemplo para tarefas
INSERT INTO public.tasks (title, description, status, priority, category, team, created_by, assignee_id, due_date) VALUES
('Implementar autenticação SSO', 'Configurar single sign-on com Azure AD', 'in_progress', 'high', 'Integration', 'technical', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', '2025-07-25'),
('Actualizar documentação API', 'Documentar novos endpoints da API REST', 'pending', 'medium', 'Content', 'technical', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '2025-07-30'),
('Teste performance sistema', 'Executar testes de carga no ambiente de produção', 'pending', 'high', 'Support', 'technical', '44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', '2025-07-20'),
('Configurar monitoring', 'Setup de alertas e dashboards de monitorização', 'completed', 'medium', 'Analytics', 'technical', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '2025-07-15'),
('Treino equipa suporte', 'Sessão de formação sobre novos procedimentos', 'pending', 'low', 'Support', 'support', '55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', '2025-08-01');

-- Inserir dados de exemplo para chamadas
INSERT INTO public.calls (caller_number, receiver_number, status, duration, handled_by, notes) VALUES
('+351912345678', '+351800123456', 'completed', 180, '22222222-2222-2222-2222-222222222222', 'Cliente satisfeito com resolução do problema'),
('+351913456789', '+351800123456', 'completed', 90, '22222222-2222-2222-2222-222222222222', 'Questão técnica resolvida rapidamente'),
('+351914567890', '+351800123456', 'missed', NULL, NULL, 'Cliente não atendeu'),
('+351915678901', '+351800123456', 'active', NULL, '22222222-2222-2222-2222-222222222222', 'Chamada em andamento'),
('+351916789012', '+351800123456', 'completed', 240, '44444444-4444-4444-4444-444444444444', 'Suporte técnico avançado fornecido');

-- Inserir dados de exemplo para mensagens
INSERT INTO public.messages (sender_number, receiver_number, content, message_type, status, processed_by) VALUES
('+351912345678', '+351800123456', 'Olá, preciso de ajuda com a configuração', 'text', 'read', '22222222-2222-2222-2222-222222222222'),
('+351800123456', '+351912345678', 'Claro! Em que posso ajudar?', 'text', 'delivered', '22222222-2222-2222-2222-222222222222'),
('+351913456789', '+351800123456', 'O sistema não está a funcionar', 'text', 'read', '44444444-4444-4444-4444-444444444444'),
('+351800123456', '+351913456789', 'Vou verificar isso para si', 'text', 'sent', '44444444-4444-4444-4444-444444444444'),
('+351914567890', '+351800123456', 'Obrigado pelo suporte!', 'text', 'delivered', '22222222-2222-2222-2222-222222222222');