-- Função para inserir dados de demonstração para novos utilizadores
CREATE OR REPLACE FUNCTION public.insert_demo_data_for_user(new_user_id UUID)
RETURNS void AS $$
DECLARE
    existing_tasks_count INTEGER;
    existing_tickets_count INTEGER;
BEGIN
    -- Verificar se já existem dados para este utilizador
    SELECT COUNT(*) INTO existing_tasks_count FROM public.tasks WHERE created_by = new_user_id;
    SELECT COUNT(*) INTO existing_tickets_count FROM public.tickets WHERE reporter_id = new_user_id;
    
    -- Se não há dados, inserir dados de demonstração
    IF existing_tasks_count = 0 AND existing_tickets_count = 0 THEN
        -- Inserir algumas tarefas de exemplo
        INSERT INTO public.tasks (title, description, status, priority, category, team, created_by, assignee_id, due_date)
        VALUES 
        ('Configurar dashboard analytics', 'Implementar métricas de desempenho no painel principal', 'in_progress', 'high', 'Analytics', 'technical', new_user_id, new_user_id, CURRENT_DATE + INTERVAL '7 days'),
        ('Documentar API endpoints', 'Atualizar documentação dos novos endpoints REST', 'pending', 'medium', 'Content', 'technical', new_user_id, new_user_id, CURRENT_DATE + INTERVAL '14 days'),
        ('Otimizar consultas de base de dados', 'Melhorar performance das queries principais', 'pending', 'high', 'Support', 'technical', new_user_id, new_user_id, CURRENT_DATE + INTERVAL '5 days'),
        ('Configurar monitorização', 'Setup de alertas e dashboards de sistema', 'completed', 'medium', 'Analytics', 'technical', new_user_id, new_user_id, CURRENT_DATE - INTERVAL '2 days');
        
        -- Inserir alguns tickets de exemplo
        INSERT INTO public.tickets (title, description, status, priority, type, team, reporter_id, assignee_id)
        VALUES 
        ('Integração WhatsApp intermitente', 'Sistema por vezes não recebe mensagens do WhatsApp', 'open', 'high', 'integration', 'technical', new_user_id, new_user_id),
        ('Pedido nova funcionalidade dashboard', 'Cliente solicita gráficos adicionais no painel', 'in_progress', 'medium', 'feature_request', 'technical', new_user_id, new_user_id),
        ('Configuração servidor produção', 'Necessário ajustar configurações SSL', 'proposed_solution', 'low', 'configuration', 'technical', new_user_id, new_user_id);
        
        -- Inserir algumas chamadas de exemplo
        INSERT INTO public.calls (caller_number, receiver_number, status, duration, handled_by, notes)
        VALUES 
        ('+351912345678', '+351800123456', 'completed', 180, new_user_id, 'Cliente satisfeito com resolução'),
        ('+351913456789', '+351800123456', 'completed', 90, new_user_id, 'Questão técnica resolvida'),
        ('+351914567890', '+351800123456', 'missed', NULL, NULL, 'Cliente não atendeu');
        
        -- Inserir algumas mensagens de exemplo
        INSERT INTO public.messages (sender_number, receiver_number, content, message_type, status, processed_by)
        VALUES 
        ('+351912345678', '+351800123456', 'Olá, preciso de ajuda com configuração', 'text', 'read', new_user_id),
        ('+351800123456', '+351912345678', 'Claro! Em que posso ajudar?', 'text', 'delivered', new_user_id),
        ('+351913456789', '+351800123456', 'Sistema não funciona corretamente', 'text', 'read', new_user_id);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;