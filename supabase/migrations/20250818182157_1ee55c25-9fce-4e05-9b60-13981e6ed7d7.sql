-- Insert all navigation modules into the modules table (without ON CONFLICT)
INSERT INTO modules (name, description, permission) VALUES
('dashboard', 'Dashboard principal com visão geral do sistema', 'read'),
('calls', 'Gestão de chamadas telefónicas e histórico', 'read,write'),
('messages', 'Gestão de mensagens e comunicações', 'read,write'),
('tasks', 'Gestão de tarefas e atividades', 'read,write'),
('tickets', 'Sistema de tickets de suporte', 'read,write'),
('users', 'Gestão de utilizadores do sistema', 'read,write'),
('settings', 'Configurações do sistema', 'read,write');