# 📘 Guia de Uso do Git (Fluxo Completo)
Este guia mostra o fluxo completo de trabalho com Git, desde a criação de uma branch até o envio de um Pull Request (PR) e finalização.
---
## 🚀 Exemplo completo do começo ao fim
```bash
cd meu-projeto
git checkout main
git pull origin main
git checkout -b feature/login
git add .
git commit -m "Adiciona tela de login"
git push -u origin feature/login
```
Depois disso, abra o Pull Request no GitHub.
Quando terminar:
```bash
git checkout main
git pull origin main
git branch -d feature/login
```
---
## 🔍 Ver em qual branch você está

```bash
git branch
```
A branch atual aparece com `*`.
**Exemplo:**
```
* main
```
---
## 🔄 Atualizar a branch principal

Antes de criar uma nova branch:
```bash
git checkout main
git pull origin main
```
---
## 🌿 Criar uma nova branch

Exemplo: criar funcionalidade de login
```bash
git checkout -b feature/login
```
Isso faz duas coisas:
* Cria a branch
* Já muda para ela
---
## ✅ Confirmar branch atual

```bash
git branch
```
**Saída esperada:**
```
* feature/login
  main
```
---
## ✏️ Fazer alterações no código
Edite os arquivos normalmente no projeto.
---
## 📊 Ver alterações
```bash
git status
```
Mostra:
* Arquivos modificados
* Arquivos novos
* Arquivos prontos para commit
---
## ➕ Adicionar arquivos para commit
Para adicionar tudo:
```bash
git add .
```
---

## 💾 Fazer commit

```bash
git commit -m "Adiciona tela de login"
```
---
## ☁️ Enviar branch para o GitHub

Primeira vez:
```bash
git push -u origin feature/login
```
Próximas vezes:
```bash
git push
```
---

## 🔀 Abrir Pull Request (PR)

No GitHub:
1. Entre no repositório
2. Clique em **Compare & pull request**
3. Adicione título e descrição
4. Crie o PR
---
## 🔁 Atualizar PR (caso necessário)

Se pedirem mudanças:
```bash
git add .
git commit -m "Ajusta validação do login"
git push
```
O PR será atualizado automaticamente.
---
## 🔙 Após o merge

```bash
git checkout main
git pull origin main
```
---
## 🧹 Apagar branch local

```bash
git branch -d feature/login
```
---
## ❌ Apagar branch remota (opcional)

```bash
git push origin --delete feature/login
```
---
## 📌 Boas práticas
* Sempre atualize a `main` antes de criar uma nova branch
* Use nomes claros para branches (`feature/`, `fix/`, `hotfix/`)
* Escreva commits objetivos
* Revise seu código antes de abrir PR
