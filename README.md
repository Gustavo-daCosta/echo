# Echo

Um app mobile que conecta seus hábitos de escuta do Spotify com a descoberta de shows locais. Veja o que você ouve, explore suas estatísticas e encontre apresentações perto de você — tudo com os dados armazenados no próprio dispositivo.

## Vídeo - Demo

https://github.com/user-attachments/assets/c6468f01-7ed5-42fe-9a26-3e3f2696043c

## Vídeo - Explicação do projeto

https://github.com/user-attachments/assets/e60216ff-edaf-4aca-9d09-7fcf06285bb4


## Conceito

O Echo entrega três funcionalidades em um único app:

* **Análise de escuta** — top faixas, artistas e características de áudio por períodos, exibidos em um grid 3x3
* **Radar de shows** — usa o GPS para encontrar apresentações em um raio de 30 km, cruzando com sua biblioteca
* **Privacidade offline-first** — todo o histórico de escuta é armazenado em cache local via SQLite; seus dados nunca saem do dispositivo

## Arquitetura

```text
Celular (Expo / React Native)
  |
  |-- Spotify Web API (direto, client-side)
  |     Perfil, top faixas, ouvidas recentemente, audio features
  |
  |-- Servidor local FastAPI (na sua máquina)
  |     Proxy da API do Ticketmaster — chave nunca vai para o dispositivo
  |     Recebe coordenadas GPS, retorna shows próximos
  |
  |-- Armazenamento local
        SecureStore (tokens OAuth) + SQLite (histórico de escuta)
```

O app se comunica diretamente com o Spotify via OAuth PKCE (sem client secret no dispositivo). Os dados de shows passam por um proxy FastAPI rodando na sua máquina, que consulta a API Discovery do Ticketmaster com a chave no lado do servidor.

## Stack

| Camada        | Tecnologia                                     |
| ------------- | ---------------------------------------------- |
| Mobile        | Expo (React Native), TypeScript                |
| Navegação     | Expo Router, Material Top Tabs                 |
| Autenticação  | expo-auth-session (PKCE)                       |
| Armazenamento | expo-secure-store, expo-sqlite                 |
| GPS           | expo-location                                  |
| Notificações  | expo-notifications                             |
| Exportação    | react-native-view-shot + expo-sharing          |
| Backend       | FastAPI (Python), httpx, geopy, pydantic       |
| APIs          | Spotify Web API, Ticketmaster Discovery API v2 |

## Estrutura do Projeto

```text
echo/
  echo-mobile/        # App Expo
    app/              # Telas (login, home, stats, radar, profile)
    components/       # Componentes compartilhados (NowPlayingCard, StatGrid, ConcertCard, etc.)
    services/         # Clientes de API (spotify, database, location, backend)
    context/          # AuthContext (ciclo de vida OAuth)
    hooks/            # Hooks de dados (useData.ts)
    styles/           # Estilos por tela e por componente
  echo-backend/       # Servidor FastAPI
    main.py           # Entrada da aplicação, CORS, logging
    routers.py        # GET /health, POST /api/concerts
    services.py       # Proxy Ticketmaster + cruzamento de artistas
    models.py         # Schemas Pydantic
    config.py         # Configuração de ambiente
```

## Configuração

### 1. API do Spotify

Crie um app em `developer.spotify.com/dashboard`. Adicione a Redirect URI: `echo://auth/callback`. Copie o Client ID.

### 2. API do Ticketmaster

Obtenha uma chave em `developer.ticketmaster.com`.

### 3. Variáveis de ambiente

```bash
# echo-mobile/.env
EXPO_PUBLIC_SPOTIFY_CLIENT_ID=seu_client_id
EXPO_PUBLIC_BACKEND_URL=http://seu_ip_da_rede:8000

# echo-backend/.env
TICKETMASTER_API_KEY=sua_chave
```

### 4. Instalar e Rodar

```bash
# Backend
cd echo-backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000

# Mobile (build de desenvolvimento necessário para notificações e suporte nativo completo)
cd echo-mobile
npm install
npx expo run:android
# Ou conecte o celular via USB para instalar direto
```

## Detalhes da Implementação

* **OAuth PKCE** — sem client secret no dispositivo; o code verifier é armazenado no SecureStore antes do redirect e recuperado pela tela de callback para a troca do token
* **Sincronização SQLite** — o endpoint de ouvidas recentes do Spotify alimenta o banco local a cada carregamento da Home; as estatísticas diárias são agregadas a partir desse cache
* **Proxy do backend** — o FastAPI recebe coordenadas do app, consulta o Ticketmaster com a chave do servidor, cruza nomes de artistas para tags de correspondência e retorna até 15 eventos ordenados por data
* **Exportação** — o grid de estatísticas é capturado via `react-native-view-shot` e compartilhado pelo menu nativo como PNG
* **Navegação por deslize** — Material Top Tabs posicionados na parte inferior fornecem navegação nativa por arrasto entre telas com suporte a safe area
