● 🕐 Git Commit Date Changer - Guia Completo

📝 O que faz

Altera a data e horário de commits específicos no Git usando o hash do commit, mantendo todo o conteúdo e mensagem originais.

🎯 Formato de Solicitação

Hash: [hash-do-commit]
Nova data: YYYY-MM-DD HH:MM:SS

Exemplo:
Hash: 1c1fe34636951088f4b35d1a96da0b937e778b00
Nova data: 2025-08-25 10:12:04

⚙️ Método Utilizado: Interactive Rebase

Passo 1: Identificar a posição do commit

git log --oneline -10

# Localiza o commit target e identifica o commit anterior

Passo 2: Iniciar rebase interativo

GIT_SEQUENCE_EDITOR="sed -i '1s/pick/edit/'" git rebase -i [commit-anterior]

- Automaticamente marca o primeiro commit (target) como "edit"
- Para no commit específico que queremos alterar

Passo 3: Alterar a data

git commit --amend --date="YYYY-MM-DD HH:MM:SS"

- Modifica apenas a data/hora
- Mantém mensagem e conteúdo inalterados

Passo 4: Finalizar o processo

git rebase --continue

- Reaplica todos os commits seguintes
- Mantém a ordem cronológica

✅ O que acontece

- ✅ Hash muda: Normal, pois a data faz parte do hash
- ✅ Conteúdo preservado: Código e mensagem ficam idênticos
- ✅ Ordem mantida: Commits seguintes permanecem na sequência
- ✅ Histórico limpo: Sem commits duplicados

🔍 Verificação

git log --pretty=format:"%H %ad %s" --date=local -5
Mostra: Hash | Data/Hora | Mensagem

⚠️ Importante

- Funciona para qualquer commit: Recente ou antigo
- Altera todo histórico posterior: Commits após o alterado terão novos hashes
- Não cria duplicatas: Método limpo e preciso
- Mantém cronologia: Ordem por data é preservada

🚀 Vantagens sobre filter-branch

- ✅ Mais rápido e simples
- ✅ Menos propenso a erros
- ✅ Não reescreve histórico desnecessariamente
- ✅ Mais fácil de entender e controlar

📋 Exemplo Completo

INPUT:
Hash: abc123def
Data: 2025-08-25 15:30:45

PROCESSO:

1. git log --oneline → localiza abc123def
2. git rebase -i [commit-anterior] → para no abc123def
3. git commit --amend --date="2025-08-25 15:30:45"
4. git rebase --continue

RESULTADO:
Hash: xyz789ghi (novo hash)
Data: Mon Aug 25 15:30:45 2025 ✅

💡 Basta enviar o hash e a data desejada que eu executo todo o processo automaticamente!
