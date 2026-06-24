# Echo

Um app mobile que conecta seus habitos de escuta do Spotify com a descoberta de shows locais. Veja o que voce ouve, explore suas estatisticas e encontre apresentacoes perto de voce — tudo com os dados armazenados no proprio dispositivo.

## Vídeo - Demo



## Vídeo - Explicação do projeto



## Conceito

O Echo entrega tres funcionalidades em um unico app:

- **Analise de escuta** — top faixas, artistas e caracteristicas de audio por periodos, exibidos em um grid 3x3
- **Radar de shows** — usa o GPS para encontrar apresentacoes em um raio de 30km, cruzando com sua biblioteca
- **Privacidade offline-first** — todo o historico de escuta e armazenado em cache local via SQLite; seus dados nunca saem do dispositivo

## Arquitetura

```
Celular (Expo / React Native)
  |
  |-- Spotify Web API (direto, client-side)
  |     Perfil, top faixas, ouvidas recentemente, audio features
  |
  |-- Servidor local FastAPI (na sua maquina)
  |     Proxy da API do Ticketmaster — chave nunca vai para o dispositivo
  |     Recebe coordenadas GPS, retorna shows proximos
  |
  |-- Armazenamento local
        SecureStore (tokens OAuth) + SQLite (historico de escuta)
```

O app se comunica diretamente com o Spotify via OAuth PKCE (sem client secret no dispositivo). Os dados de shows passam por um proxy FastAPI rodando na sua maquina, que consulta a API Discovery do Ticketmaster com a chave no lado do servidor.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Mobile | Expo (React Native), TypeScript |
| Navegacao | Expo Router, Material Top Tabs |
| Autenticacao | expo-auth-session (PKCE) |
| Armazenamento | expo-secure-store, expo-sqlite |
| GPS | expo-location |
| Notificacoes | expo-notifications |
| Exportacao | react-native-view-shot + expo-sharing |
| Backend | FastAPI (Python), httpx, geopy, pydantic |
| APIs | Spotify Web API, Ticketmaster Discovery API v2 |

## Estrutura do Projeto

```
echo/
  echo-mobile/        # App Expo
    app/              # Telas (login, home, stats, radar, profile)
    components/       # Componentes compartilhados (NowPlayingCard, StatGrid, ConcertCard, etc.)
    services/         # Clientes de API (spotify, database, location, backend)
    context/          # AuthContext (ciclo de vida OAuth)
    hooks/            # Hooks de dados (useData.ts)
    styles/           # Estilos por tela e por componente
  echo-backend/       # Servidor FastAPI
    main.py           # Entrada da aplicacao, CORS, logging
    routers.py        # GET /health, POST /api/concerts
    services.py       # Proxy Ticketmaster + cruzamento de artistas
    models.py         # Schemas Pydantic
    config.py         # Configuracao de ambiente
```

## Configuracao

### 1. API do Spotify

Crie um app em [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard). Adicione a Redirect URI: `echo://auth/callback`. Copie o Client ID.

### 2. API do Ticketmaster

Obtenha uma chave em [developer.ticketmaster.com](https://developer.ticketmaster.com).

### 3. Variaveis de ambiente

```
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

# Mobile (build de desenvolvimento necessario para notificacoes e suporte nativo completo)
cd echo-mobile
npm install
npx expo run:android
# Ou conecte o celular via USB para instalar direto
```

## Detalhes da Implementacao

- **OAuth PKCE** — sem client secret no dispositivo; o code verifier e armazenado no SecureStore antes do redirect e recuperado pela tela de callback para a troca do token
- **Sincronizacao SQLite** — o endpoint de ouvidas recentes do Spotify alimenta o banco local a cada carregamento da Home; as estatisticas diarias sao agregadas a partir desse cache
- **Proxy do backend** — o FastAPI recebe coordenadas do app, consulta o Ticketmaster com a chave do servidor, cruza nomes de artistas para tags de correspondencia e retorna ate 15 eventos ordenados por data
- **Exportacao** — o grid de estatisticas e capturado via `react-native-view-shot` e compartilhado pelo menu nativo como PNG
- **Navegacao por deslize** — Material Top Tabs posicionados na parte inferior fornecem navegacao nativa por arrasto entre telas com suporte a safe area
